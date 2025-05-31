import mangoose from 'mongoose';

const userSchema = new mangoose.Schema({ 
     _id:{ type : string, required: true },
     name: { type: String, required: true },
     Email: { type: String, required: true, unique: true },
     cartItems: { type: Object, default: {} },
}, {minimize: false})

const User = mangoose.models.User || mangoose.model('User', userSchema)


export default User;




