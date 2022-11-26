import { ContenedorDaoCarritos } from '../../daos/daoindex.js';
const admin = true;
 

const  getAllCarrito= async (req,res) => {
    try{
        const allObjects = await ContenedorDaoCarritos.getAll()
        res.send(allObjects)
    }catch(error){
        console.log(error)
        res.send({
            error: -1,
            message: "Error al obtener todos los productos en GET /api/productos"
        })
    }
}

const  getCarritoById= async(req,res)=>{
    try{
        const {id} = req.params
        const objectById = await ContenedorDaoCarritos.getById(id)
        res.send(objectById)
    }catch(error){
        console.log(error);
        res.send({
            error: -1,
            message: `Error al buscar el producto ${id}`
        })
    }
}

const addCarrito=( async(req,res) =>{
    if(admin){
        try{
            
            console.log('Entrando a addCarrito')
            let newCarrito = req.body;  
            console.log(newCarrito)              
            const carritoNew = await ContenedorDaoCarritos.save(newCarrito);
            res.send(carritoNew)

        }catch(error){
            console.log(error)
        }
    }else{
        res.send({
            error: -1,
            message: 'Error en la ruta /api/productos conel metodo POST no autorizado'
        })
    }
})

const putCarrito = async(req,res) =>{
    if(this.admin){
        try{
            const {id}= req.params
            const newProd = req.body
            const produtosUpdated = await ContenedorDaoCarritos.updateById(parseInt(id),newProd)
            res.send ( {
                message: 'Carrito actualizado',
                carrito: newProd
            })

        }catch(error){
            console.log(error);
            res.status(404).message({
                error: -1,
                message: 'Error en la ruta /api/productos/:id conel metodo PUT no autorizado'
            })
        }
    }
}

const  deleteCarritoById = async(req,res)=>{
    if(admin){
        try{
            const {id}= req.params;
            const product = await ContenedorDaoCarritos.deleteById(parseInt(id))
            const getAllCarrito= await ContenedorDaoCarritos.getAll()
            res.send(getAllCarrito)

        }catch(error){
            console.log('Error al borrar by id')

        }
    }
}

const getNestedCarrito = async(req,res)=>{
    try{
        const {id} = req.params
        const allObjects = await ContenedorDaoCarritos.getById(parseInt(id))
        console.log('Al ejecutar getNestedCarrito')
        console.log(allObjects)        

        res.send(allObjects[0].productos)
    }
    catch(error){
        console.log(error)
        res.send({message:'Error al buscar productos', code:-1})
    }

}

const addNestedCarrito = async(req,res) => {
    try{
        const {id} = req.params
        const allObjects= await ContenedorDaoCarritos.getById(parseInt(id))
        console.log('Al mostrar ALLOBJC')
        console.log(allObjects)
        const productos = allObjects[0].productos
        console.log('Al obtener todos los productos desde getById '+JSON.stringify(allObjects.productos))
        const prodLen = productos.length
        console.log('Long productos: '+prodLen)
        
        productos[prodLen]=req.body
        
        allObjects.productos = productos        
        await ContenedorDaoCarritos.updateById(id,allObjects)
        const updatedObject = await ContenedorDaoCarritos.getById(parseInt(id))
        res.send(updatedObject)

    }catch{
        console.log('Error al ejecutar addNestedObject')
    }
}

const deleteNestedCarrito= async(req,res)=>{
    try{
        const{id} = req.params
        const{id_prod}=req.params

        const allObjects=await ContenedorDaoCarritos.getById(parseInt(id))
        console.log('Al mostrar ALLOBJECTS '+allObjects)
        const productos=allObjects[0].productos
        console.log('Productos: '+productos)
        const newNestedObject = productos.filter(item => item.id !==parseInt(id_prod))
        console.log('new nested: '+newNestedObject)
        allObjects[0].productos = newNestedObject
        let newUpdate = {timestamp:allObjects[0].timestamp,productos:allObjects[0].productos}
        console.log('all objects final: '+newUpdate)
        const resp=await ContenedorDaoCarritos.updateById(id,newUpdate)

        res.send(resp)

    }catch(error){
        console.log('Error al eliminar un producto del carrito')
    }
}

export {getAllCarrito,getCarritoById,getNestedCarrito, addCarrito, putCarrito,addNestedCarrito,deleteNestedCarrito,deleteCarritoById}