import mongoose from "mongoose";
import { options } from "../config/databaseConfig.js";

//LA URL donde se esta ejcutando nuestra base de datos
const URL =options.mongoDb.mongoUrl

//conectamos a la base de datos
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error=>{
    if(error) throw new Error(`Conexion fallida ${error}`);
    console.log("conexion base de datos exitosa!")
})

class ContenedorMongo{

    constructor(model,sequenceModel,sequenceType){
        this.model = model;
        this.sequenceModel=sequenceModel
        this.sequenceType = sequenceType
        
    }


    getSequenceID= async()=>{

        let count = await this.sequenceModel.count({id:this.sequenceType});
       
        let newSequence

        if (count === 0) {
            let result = await this.sequenceModel.insertMany( {id: this.sequenceType , seq : 1 },{new:true} );
            return 1

        }else{
            let seq = await this.sequenceModel.find({id: this.sequenceType})
            let seqNew = seq[0].seq + 1 
            newSequence = await this.sequenceModel.updateOne({id: this.sequenceType},{$set:{seq: seqNew}});
            let seqNew2 = await this.sequenceModel.find({id: this.sequenceType})
            return seqNew2[0].seq
        }
    }
    
     save = async (newObject)=> {
        try{
            let id = await this.getSequenceID()
            let newProduct = { id, ...newObject}
            let result = await this.model.insertMany(newProduct);
            console.log(result);
            return result;
    
        }catch(error){
            console.log(error)
        }
    }
    
    getAll = async() => {
        try{
            let result = await this.model.find().sort();
            return result;
        }catch(error){
            console.log(error)
        }
    }
    
    getById = async (idObject) =>{
        try{
    
            let result = await this.model.find({id:parseInt(idObject)});
            return result;
    
        }catch(error){
            console.log(error);
        }
    }
    
    deleteById = async(idObject) => {
        try{
            let result = await this.model.deleteOne({id:parseInt(idObject)})
            
            return result;
        }catch(error){
            console.log(error)
        }
    }
    updateById = async(idObject,newData) =>{
        try{
            let filter = {id: parseInt(idObject)}        
    
            let result = this.model.updateOne(filter,{$set:{...newData}},{new:true})
            console.log('Al mostrar resultado de updatebyid')
            
            console.log('luego de updatebyid')
            return result;
    
        }catch(error){
            console.log(error)
        }
    }


}



export {ContenedorMongo}