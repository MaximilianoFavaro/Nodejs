import express from 'express'
import  { getAllProductos,getProductosById,putProductos,deleteProductById,addProductos }  from './controllers/productosControler.js'
import {getAllCarrito,getCarritoById,getNestedCarrito, addCarrito, putCarrito,addNestedCarrito,deleteNestedCarrito,deleteCarritoById} from './controllers/carritoControler.js'
const router = express.Router();




// Consultar todos los productos
router.get("/api/productos",getAllProductos);
// Consultar por ID
router.get("/api/productos/:id",getProductosById);
//Añadir un producto
router.post('/api/productos', addProductos);
//Actualizar un producto
router.put('/api/productos/:id', putProductos);
//Eliminar producto por ID
router.delete('/api/productos/:id',deleteProductById);
// ------------- carrito -----------------------
//crear carrito
router.post('/api/carrito',addCarrito);
//borrar carrito por id
router.delete('/api/carrito/:id',deleteCarritoById);
//listar todos los productos de un carrito
router.get('/api/carrito/:id/productos', getNestedCarrito);
//Añadir un producto al carrito
router.post('/api/carrito/:id/productos',addNestedCarrito);
//delete un producto de un carrito
router.delete('/api/carrito/:id/productos/:id_prod',deleteNestedCarrito);

// --------- control rutas invalidas ---------------------



export {router}