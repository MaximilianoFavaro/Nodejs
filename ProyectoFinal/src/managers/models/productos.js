import mongoose from "mongoose";

const productosCollection = 'productos';

const productosSchema = new mongoose.Schema({

    id:{type:Number, required: true},
    timestamp: {type: String, required:true},
    nombre: {type: String, required:true},
    descripcion: {type:String, required:true},
    codigo: {type: Number, required:true},
    url: {type:String, required:true},
    precio: {type:Number,required:true},
    stock:{type:Number, required:true},
    ingreso:Boolean

});

export const productModel = mongoose.model(productosCollection, productosSchema);
