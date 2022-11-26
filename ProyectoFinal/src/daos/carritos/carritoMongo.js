import { ContenedorMongo } from "../../managers/mongoDbManager.js"

class CarritoDaoMongo extends ContenedorMongo{
    constructor(carritoModel,sequenceModel, sequenceType){
        super(carritoModel,sequenceModel,sequenceType)

    }
}

export{CarritoDaoMongo} 