import mongoose from "mongoose";

const matchreq_schema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    senderMessage:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }

},{timestamps:true,strict:true})

matchreq_schema.pre("save",async function (next){
    console.log(this);
})


export const matchRequest = mongoose.model("MatchRequest",matchreq_schema);