import mongoose from "mongoose";

const sequenceCollection = 'sequence';

const sequenceSchema = new mongoose.Schema({
    id: {type:String,required:true},
    seq:{type:Number,required:true}

});

export const sequenceModel = mongoose.model(sequenceCollection, sequenceSchema);
