import express from 'express';
const router = express.Router();
// 1. Changed to 'import' and added '.js' extension
import Doctor from '../doctor.js';



router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newdoctor = new Doctor(data);

        const response = await newdoctor.save();
        console.log('data saved');
        res.status(200).json(response);
    } catch (err) {
        console.log(err); // Log actual error for debugging
        res.status(500).json({ error: 'internal server error' });
    }
});




router.get('/', async (req, res) => {
    try {
        const data = await Doctor.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err); // Log actual error for debugging
        res.status(500).json({ error: 'internal server error' });
    }
});





router.put('/:id', async (req, res) => {
    try {
        const mongoId = req.params.id; // Grabs the long ID from the URL
        const dataToUpdate = req.body; // Grabs EVERY field you sent in Postman JSON

        // Passing req.body directly tells Mongoose to update whatever fields are present
        const response = await Doctor.findByIdAndUpdate(
            mongoId, 
            dataToUpdate,  
            { new: true, runValidators: true } // new: true returns the newly updated data
        );

        if (!response) {
            return res.status(404).json({ error: 'No doctor found with that database ID' });
        }

        console.log('Database updated successfully!');
        res.status(200).json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});





router.delete('/:id', async (req, res) => {
    try {
        const mongoId = req.params.id; // Grabs the long ID from the URL

        // findByIdAndDelete locates the document by its _id and removes it completely
        const response = await Doctor.findByIdAndDelete(mongoId);

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