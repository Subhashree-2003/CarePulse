const MedicalRecord =
require('../models/MedicalRecord');

exports.createMedicalRecord =
async (req, res) => {

    try {

        const record =
            await MedicalRecord.create(req.body);

        res.status(201).json(record);

    } catch(error){

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getMedicalRecords =
async (req, res) => {

    try {

        const records =
            await MedicalRecord.find()
            .populate('patientId')
            .populate('doctorId');

        res.json(records);

    } catch(error){

        res.status(500).json({
            error: error.message
        });
    }
};