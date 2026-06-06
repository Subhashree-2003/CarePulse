const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    diagnosis: String,

    allergies: String,

    medications: String

}, { timestamps: true });

module.exports = mongoose.model(
    'MedicalRecord',
    medicalRecordSchema
);