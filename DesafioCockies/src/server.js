const express = require('express');
const options = require("./config/dbConfig");
const {productsRouter, products} = require('./routes/products');
const handlebars = require('express-handlebars');
const {Server} = require("socket.io");
const {normalize, schema} = require("normalizr");

const cookieParser = require("cookie-parser");
const session = require("express-session")
const MongoStore = require("connect-mongo")

const Contenedor = require("./managers/contenedorProductos");
const ContenedorChat = require('./managers/contenedorChat');
const ContenedorSql = require("./managers/contenedorSql");

const {faker} = require('@faker-js/faker');
faker.locale="es";
//service
// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSql(options.mariaDB, "products");
const chatApi = new ContenedorChat("chat.txt");
// const chatApi = new ContenedorSql(options.sqliteDB,"chat");

//server
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(cookieParser())

app.use(session({
    store:MongoStore.create({mongoUrl:"mongodb+srv://stealth:stealth@ecommerceproyectofinal.yj00mkp.mongodb.net/?retryWrites=true&w=majority"}),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:600000}
}))


//normalizacion
//creamos los esquemas.
//esquema del author
const authorSchema = new schema.Entity("authors",{}, {idAttribute:"email"});

//esquema mensaje
const messageSchema = new schema.Entity("messages", {author: authorSchema});


const chatSchema = new schema.Entity("chat", {
    messages:[messageSchema]
}, {idAttribute:"id"});

//aplicar la normalizacion
//crear una funcion que la podemos llamar para normalizar la data
const normalizarData = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
};

const normalizarMensajes = async()=>{
    const results = await chatApi.getAll();
    const messagesNormalized = normalizarData(results);
    // console.log(JSON.stringify(messagesNormalized, null,"\t"));
    return messagesNormalized;
}
// routes
//view routes
app.get('/', async(req,res)=>{
    res.render('home')
})

app.use(session({
    secret:"claveSecreta", //clave de encriptación de la sesión

    //config para guardar en la memoria del servidor
    resave:true,
    saveUninitialized:true,
}));

//middleware para validar la sesión del usuario
const checkSession = (req,res,next)=>{
    //validamos si la sesión esta activa
    if(req.session.user){
       const result = (req.session.user === undefined)  ? res.render("home",{users : ""}) : res.render("home",{users : req.session.user.name })
    } else{
        next();
    }
}

//rutas asociadas a las páginas del sitio web
app.get("/",(req,res)=>{
    const result = (req.session.user === undefined)  ? res.render("home",{users : ""}) : res.render("home",{users : req.session.user.name })
});

app.get("/registro",checkSession,(req,res)=>{
    res.render("signup")
});

app.get("/inicio-sesion",checkSession,(req,res)=>{
    res.render("login")
});

app.get("/perfil",(req,res)=>{
    if(req.session.user){
        res.render("profile");
    } else{
        res.send("<div>Debes <a href'/inicio-sesion'>inciar sesion</a> o <a href='/registro'>registrarte</a></div>")
    }
});

let users = [];

//rutas de autenticacion
app.post("/signup",(req,res)=>{
    const newUser = req.body;
    //el usuario existe?
    const userExists = users.find(elm=>elm.email === newUser.email);
    if(userExists){
        res.render("signup",{error:"usuario ya registrado"});
    } else{
        users.push(newUser);
        req.session.user = newUser;
        const result = (req.session.user === undefined)  ? res.render("home",{users : ""}) : res.render("home",{users : req.session.user.name })
    }
});

app.post("/login",(req,res)=>{
    const user = req.body;
    //el usuario existe
    const userExists = users.find(elm=>elm.email === user.email);
    if(userExists){
        //validar la contraseña
        if(userExists.password === user.password){
            req.session.user = user;
            console.log(userExists.name)
            const result = (userExists.name === undefined)  ? res.render("home",{users : ""}) : res.render("home",{users : userExists.name })
           // const result = (req.session.user === undefined)  ? res.render("home",{users : ""}) : res.render("home",{users : req.session.user.name })
        } else{
            res.redirect("/inicio-sesion")
        }
    } else{
        res.redirect("/registro");
    }
});

app.get("/logout",(req,res)=>{
    const result = (req.session.user === undefined)  ? res.render("logout",{users : ""}) : res.render("logout",{users : req.session.user.name, })
    req.session.destroy();
}); 






app.get('/productos',async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
})

app.get('/api/products-test', async(req,res) =>{
    let arrayProductos = [];
    try {for(let i = 0; i<6; i++){
        arrayProductos.push({            
            title: faker.commerce.product(),
            price:faker.finance.amount(),
            thumbnail: faker.image.imageUrl()

            })
        }
    }catch(error){console.log(error)}
    
    res.render('products-test',{productstest:arrayProductos});
});

//api routes
app.use('/api/products',productsRouter)

app.use('/api/products-test',productsRouter)



//express server
const server = app.listen(8080,()=>{
    console.log('listening on port 8080')
})



//websocket server
const io = new Server(server);

//configuracion websocket
io.on("connection",async(socket)=>{
    //PRODUCTOS
    //envio de los productos al socket que se conecta.
    io.sockets.emit("products", await productosApi.getAll())

    //recibimos el producto nuevo del cliente y lo guardamos con filesystem
    socket.on("newProduct",async(data)=>{
        await productosApi.save(data);
        //despues de guardar un nuevo producto, enviamos el listado de productos actualizado a todos los sockets conectados
        io.sockets.emit("products", await productosApi.getAll())
    })

    //CHAT
    //Envio de todos los mensajes al socket que se conecta.
    io.sockets.emit("messages", await normalizarMensajes());

    //recibimos el mensaje del usuario y lo guardamos en el archivo chat.txt
    socket.on("newMessage", async(newMsg)=>{
        console.log(newMsg);
        await chatApi.save(newMsg);
        io.sockets.emit("messages", await normalizarMensajes());
    });
})