import mongoose from 'mongoose';

//Define the menu schema
const doctorSchema = new mongoose.Schema({
    doc_id :{
        type : String,
        required : true
    },
    doc_name :{
        type : String,
        required : true
    },
    specialist :{
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
    password : {
        type : String,
        default : 0
    }
});


//create person model
const Doctor = mongoose.model('Doctor',doctorSchema, 'doctor');
export default Doctor;
