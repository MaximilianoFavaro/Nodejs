import { FileManager } from "./fileManager.js";

console.log('Por crear archivos')
const productos = new FileManager("./src/files/productos.txt");
const carrito   = new FileManager("./src/files/carrito.txt")

export {productos, carrito}