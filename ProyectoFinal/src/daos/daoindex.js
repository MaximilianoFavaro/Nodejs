
import {options} from "../config/databaseConfig.js";
import { productModel} from "../managers/models/productos.js"
import { sequenceModel} from "../managers/models/sequence.js"
import { carritoModel} from "../managers/models/carrito.js"

let ContenedorDaoProductos;
let ContenedorDaoCarritos;

//identificador
let databaseType = "mongo";

switch(databaseType){
    case "archivos":
        const {ProductsDaoArchivos} = await import("./productos/productoFiles.js");
        const {CarritoDaoArchivos} = await import("./carritos/carritoFiles.js");
        ContenedorDaoProductos = new ProductsDaoArchivos(options.fileSystem.pathProducts);
        ContenedorDaoCarritos = new CarritoDaoArchivos(options.fileSystem.pathCarts);
        break;
    case "sql":
        /*const {ProductosDaoSQL} = await import("./products/productsSql.js");
        const {CarritosDaoSQL} = await import("./carts/cartsSql.js");
        ContenedorDaoProductos = new ProductosDaoSQL(options.sqliteDB, "productos");
        ContenedorDaoCarritos = new CarritosDaoSQL(options.sqliteDB,"carritos");
        */break;
    case "mongo":
        const {CarritoDaoMongo} = await import("./carritos/carritoMongo.js")
        const {ProductsDaoMongo}= await import("./productos/productoMongo.js")
        ContenedorDaoCarritos = new CarritoDaoMongo(carritoModel,sequenceModel, "carrito_id")
        ContenedorDaoProductos = new ProductsDaoMongo(productModel,sequenceModel, "product_id")
}

export {ContenedorDaoProductos,ContenedorDaoCarritos}