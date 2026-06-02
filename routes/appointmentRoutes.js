import express from 'express';
const router = express.Router();
// 1. Changed to 'import' and added the mandatory '.js' extension
import Appointment from '../appointment.js';


router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newappointment = new appointment(data);

        const response = await newappointment.save();
        console.log('data saved');
        res.status(200).json(response);
    } catch (err) {
        console.log(err); // Logged actual error to help you debug if saving fails
        res.status(500).json({ error: 'internal server error' });
    }
});




router.get('/', async (req, res) => {
    try {
        const data = await Appointment.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err); // Logged actual error
        res.status(500).json({ error: 'internal server error' });
    }
});





router.put('/:id', async (req, res) => {
    try {
        const mongoId = req.params.id;       // Grabs '6a042d8038589444c43682d1' from the URL
        const dataToUpdate = req.body;    // Grabs 'DOC202' from your JSON body

        // Find the document by its MongoDB _id and update the custom doc_id field
        // Note: Change 'doc_id' below to match your schema key exactly if it's named 'doctor_id' instead
         const response = await Appointment.findByIdAndUpdate(
            mongoId, 
            dataToUpdate,  
            { new: true, runValidators: true } // new: true returns the newly updated data
        );

        // If the ID doesn't exist in your database
        if (!response) {
            return res.status(404).json({ error: 'No appiontment found with that database ID' });
        }

        console.log('Database updated successfully!');
        res.status(200).json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// DELETE method to remove a doctor by their MongoDB _id
router.delete('/:id', async (req, res) => {
    try {
        const mongoId = req.params.id; // Grabs the long ID from the URL

        // findByIdAndDelete locates the document by its _id and removes it completely
        const response = await Appointment.findByIdAndDelete(mongoId);

        // If the ID doesn't exist in the database
        if (!response) {
            return res.status(404).json({ error: 'No doctor found with that database ID' });
        }

        console.log('Document deleted successfully from database');
        
        // Return a success message alongside the data that was deleted
        res.status(200).json({ 
            message: 'Data deleted successfully!',
            deletedDoctor: response 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// 2. Changed from module.exports to ES Module default export
export default router;


