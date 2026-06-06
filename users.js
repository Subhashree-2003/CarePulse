import mongoose from 'mongoose';

//Define the menu schema
const usersSchema = new mongoose.Schema({
    user_id :{
        type : String,
        required : true
    },
    username :{
        type : String,
        required : true
    },
    phone_no :{
        type : Number,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    adress :{
        type : String,
        required : true
    },
    password : {
        type : String,
        default : 0
    }
});


//create person model
const Users = mongoose.model('Users',usersSchema);
export default Users;