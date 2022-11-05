
import { productos } from '../../managers/fileObjects.js';
const admin = true;

const getAllProductos= (async (req,res) => {
        try{
            const allObjects = await productos.getAll()
            if (allObjects !== -1){
            res.send(JSON.stringify(allObjects))
            }else {
                res.send({ message:'El archivo esta vacio', code:-1})
            }
        }catch(error){
            console.log(error)
            res.send({
                error: -1,
                message: "Error al obtener todos los productos en GET /api/productos"
            })
        }
    })
    
const getProductosById= (async(req,res)=>{
        try{
            const {id} = req.params            
            const objectById = await productos.getById(parseInt(id))            
            res.send(objectById)
        }catch(error){
            console.log(error);
            res.send({
                error: -1,
                message: `Error al buscar el producto ${id}`
            })
        }
    })
    
 const addProductos=(async (req,res) =>{        
        if(admin){
            try{
                
                let newProduct = req.body;                
                const productosNew = await productos.save(newProduct);
                res.send(productosNew)
    
            }catch(error){
                console.log(error)
            }
        }else{
            res.status(404).message({
                error: -1,
                message: 'Error en la ruta /api/productos conel metodo POST no autorizado'
            })
        }
    })

const putProductos = (async(req,res) =>{
        if(admin){
            try{
                const {id}= req.params
                const newProd = req.body
                const produtosUpdated = await productos.updateById(parseInt(id),newProd)
                res.send ( {
                    message: 'Producto actualizado',
                    producto: newProd
                })
    
            }catch(error){
                console.log(error);
                res.status(404).message({
                    error: -1,
                    message: 'Error en la ruta /api/productos/:id conel metodo PUT no autorizado'
                })
            }
        }
    })

 const deleteProductById = (async(req,res)=>{
        if(admin){
            try{
                const {id}= req.params;
                const product = await productos.deleteById(parseInt(id))
                res.send({ message:'Producto eliminado', code:0})
    
            }catch(error){
                console.log('Error al borrar by id')
    
            }
        }
    })

  
    






export { getAllProductos,getProductosById,putProductos,deleteProductById,addProductos }