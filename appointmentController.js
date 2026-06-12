const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {

    try {

        const {
            patientId,
            doctorId,
            startTime,
            endTime
        } = req.body;

        // COLLISION CHECK

        const existingAppointment =
            await Appointment.findOne({

                doctorId,

                startTime: {
                    $lt: endTime
                },

                endTime: {
                    $gt: startTime
                }

            });

        if(existingAppointment){

            return res.status(400).json({
                message:
                'Doctor already booked for this slot'
            });
        }

        const appointment =
            await Appointment.create({

                patientId,
                doctorId,
                startTime,
                endTime

            });

        res.status(201).json({
            message:
            'Appointment booked successfully',
            appointment
        });

    } catch(error){

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getAppointments = async (req, res) => {

    try {

        const appointments =
            await Appointment.find()
            .populate('patientId')
            .populate('doctorId');

        res.json(appointments);

    } catch(error){

        res.status(500).json({
            error: error.message
        });
    }
};