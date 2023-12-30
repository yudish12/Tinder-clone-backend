import mongoose from "mongoose";

const match_schema = new mongoose.Schema({
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
    ],
    matchRequest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MatchRequest',
        required:true
    },
    status:{
        type:String,
        enum:['matched','unmatched','reported']
    }
},{timestamps:true,strict:true})

export const match = mongoose.model("Match",match_schema);