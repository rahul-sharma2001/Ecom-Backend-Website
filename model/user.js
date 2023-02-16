const mongoose = require('mongoose')
const {isEmail}=require('validator')
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"must provide firstname"],
        trim:true,
        maxlength:[20 ,"not more than 20 characters"]
    },
    lastName:{
        type:String,
        required:[true,"must provide lastname"],
        trim:true,
        maxlength:[20 ,"not more than 20 characters"]
    },
    emailId:{
        type:String,
        required:[true,"must provide email"],
        unique:true,
        validate:[isEmail ,' PLEASE PROVIDE VALID EMAIL'],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"must provide password"],
    },
    contactNumber:{
        type:Number,
        required:[true,"must provide contact-number"],
        maxlength:[10,"contact number should not contain more than 10 characters"]
    },
    role:{
        type:String,
        // required:[true,"must provide role"],
        trim:true,
        default:'user'
    },
    
})

//for not showing password in json obj
// userSchema.methods.toJSON = function() {
//     var obj = this.toObject();
//     delete obj.password;
//     return obj;
//   }

module.exports=mongoose.model('user',userSchema)