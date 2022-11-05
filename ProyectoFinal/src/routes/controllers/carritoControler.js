import {carrito} from '../../managers/fileObjects.js'
const admin = true;

const  getAllCarrito= async (req,res) => {
    try{
        const allObjects = await carrito.getAll()
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
        const objectById = await carrito.getById(id)
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
            const carritoNew = await carrito.save(newCarrito);
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
            const produtosUpdated = await carrito.updateById(parseInt(id),newProd)
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
            const product = await carrito.deleteById(parseInt(id))
            const getAllCarrito= await carrito.getAll()
            res.send(getAllCarrito)

        }catch(error){
            console.log('Error al borrar by id')

        }
    }
}

const getNestedCarrito = async(req,res)=>{
    try{
        const {id} = req.params
        const allObjects = await carrito.getById(parseInt(id))
        console.log(allObjects)        

        res.send(allObjects.productos)
    }
    catch(error){
        console.log(error)
        res.send({message:'Error al buscar productos', code:-1})
    }

}

const addNestedCarrito = async(req,res) => {
    try{
        const {id} = req.params
        const allObjects= await carrito.getById(parseInt(id))
        const productos = allObjects.productos
        console.log('Al obtener todos los productos desde getById '+JSON.stringify(allObjects.productos))
        const prodLen = productos.length
        console.log('Long productos: '+prodLen)
        
        productos[prodLen]=req.body
        
        allObjects.productos = productos        
        await carrito.updateById(id,allObjects)
        const updatedObject = await carrito.getById(parseInt(id))
        res.send(updatedObject)

    }catch{
        console.log('Error al ejecutar addNestedObject')
    }
}

const deleteNestedCarrito= async(req,res)=>{
    try{
        const{id} = req.params
        const{id_prod}=req.params

        const allObjects=await carrito.getById(parseInt(id))
        const productos=allObjects.productos
        const newNestedObject = productos.filter(item => item.id !==parseInt(id_prod))
        allObjects.productos = newNestedObject
        const resp=await carrito.updateById(id,allObjects)

        res.send(resp)

    }catch(error){
        console.log('Error al eliminar un producto del carrito')
    }
}

export {getAllCarrito,getCarritoById,getNestedCarrito, addCarrito, putCarrito,addNestedCarrito,deleteNestedCarrito,deleteCarritoById}