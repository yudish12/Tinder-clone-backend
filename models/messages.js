import mongoose from 'mongoose';

const messages_schema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    matchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Match',
        required:true,
    }
},{strict:true,timestamps:true});

export const messages = mongoose.model("Messages",messages_schema);