import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

const user_schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        validate: [validator.isEmail, 'please enter valid email'],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength: [8, 'minimum 8 characters must be in password'],
    },
    otp:String,
    otp_left:Number,
    otp_time:Date,
    height:{
        type:String
    },
    weight:{
        type:Number
    },
    age:{
        type:Number,
        required:[true,"Enter your age"]
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female","other"]
    },
    preference:{
        type:String,
        required:true,
        enum:["male","female","both"]
    },
    date_type:{
        type:String,
        required:true,
        enum:["long term","short term","casual"]
    },
    photos:[String],
    location:{
        type: {
          type: String,
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: undefined,
        },       
        address:String,
    },
    filters:{
        type:String,
        default:null
    }
},{timestamps:true,strict:true})

user_schema.index({location:'2dsphere'})

user_schema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

user_schema.pre('save', async function (next) {
    //is modified is a mongoose method which tells weather a field was modified or not
    if (!this.isModified('password')) {
      return next();
    }
  
    //if not modified then hash the password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

export const User = mongoose.model('User', user_schema);

