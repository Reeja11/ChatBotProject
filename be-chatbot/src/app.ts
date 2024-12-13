import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chromaService from './services/chromaService';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

async function startServer() {
    try {
        const chromaInitialized = await chromaService.initialize();
        if (!chromaInitialized) {
            throw new Error('Failed to initialize ChromaDB');
        }

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();