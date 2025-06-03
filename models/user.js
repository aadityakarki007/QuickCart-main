import mangoose from "mongoose";

const userSchema = new mangoose.Schema({ 
     _id:{ type: String, required: true },
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     imageUrl: { type: String },
     cartItems: { type: Object, default: {} }
}, {minimize: false})

const User = mangoose.models.User || mangoose.model('User', userSchema)


export default User;




