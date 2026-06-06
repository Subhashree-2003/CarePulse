import mongoose from 'mongoose';

//Define the menu schema
const appointmentSchema = new mongoose.Schema({
    appt_id :{
        type : String,
        required : true
    },
    patient_id :{
        type : String,
        required : true
    },
    patient_name :{
        type : String,
        required : true
    },
    doc_id :{
        type : String,
        required : true
    },
    appt_date :{
        type : Number,
        required : true
    },
    appt_time :{
        type : Number,
        required : true
    },
    appt_status : {
        type : Boolean,
        default : 0
    }
});


//create person model
const Appointment = mongoose.model('Appointment',appointmentSchema, 'appointment');
export default Appointment;