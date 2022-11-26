import { FileManager } from "../../managers/fileManager.js";

class ProductsDaoArchivos extends FileManager {
    constructor(filename){
        super(filename)
    }
}
export {ProductsDaoArchivos}