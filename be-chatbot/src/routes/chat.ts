import express from 'express';
import multer from 'multer';
import { handleMessageAndFile } from '../services/openAIService';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log('Incoming request received at /chat endpoint');
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);

        const message = req.body.message;
        const file = req.file;

        // Validate required fields
        if (!message) {
            console.error('Validation Error: Message is required');
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Processing message and file...');
        const response = await handleMessageAndFile(message, file);

        console.log('✅ Successfully processed message and file:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error occurred in /chat endpoint:');
        console.error('Details:', (error as Error).message);
        console.error('Stack trace:', (error as Error).stack);

        res.status(500).json({
            error: 'An error occurred',
            details: (error as Error).message,
        });
    }

    
});


export default router;
