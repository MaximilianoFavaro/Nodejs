import { ContenedorMongo } from "../../managers/mongoDbManager.js";

class ProductsDaoMongo extends ContenedorMongo{
    constructor(productModel,sequenceModel, sequenceType){
        super(productModel,sequenceModel,sequenceType)

    }
}

export{ProductsDaoMongo} 