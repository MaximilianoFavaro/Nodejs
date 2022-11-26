import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const options = {
    fileSystem: {
        pathProducts: 'productos.json',
        pathCarts: 'carritos.json',
    },
    mongoDb:{
        mongoUrl: "mongodb+srv://stealth:stealth@ecommerceproyectofinal.yj00mkp.mongodb.net/?retryWrites=true&w=majority"
    }
}
