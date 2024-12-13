import { Configuration, OpenAIApi } from 'openai';
import { ChromaClient } from 'chromadb';
import { parsePDF } from './pdfService';


const openaikey = 'your-api-key-here'
const configuration = new Configuration({
    apiKey: openaikey,
});
const openai = new OpenAIApi(configuration);

// Initialize ChromaDB Client
const chromaClient = new ChromaClient({
    path: './chroma_data', // Local storage path for ChromaDB
});

// Function to store embeddings in ChromaDB
const storeInChroma = async (collectionName: string, chunks: string[], embeddings: number[][]) => {
    try {
        const collection = await chromaClient.getOrCreateCollection({ name: collectionName });

        for (let i = 0; i < chunks.length; i++) {
            await collection.add({
                ids: [`doc-${Date.now().toString()}-${i}`], // Corrected template string
                embeddings: [embeddings[i]],
                metadatas: [{ chunk: chunks[i], timestamp: new Date().toISOString() }],
            });
        }
        

        console.log('Embeddings successfully stored in ChromaDB.');
    } catch (error) {
        console.error('Error storing in ChromaDB:', error);
    }
};

// Main function to handle message and file
export const handleMessageAndFile = async (message: string, file?: Express.Multer.File) => {
    try {
        let fileChunks: string[] = [];

        // Process the uploaded file if present
        if (file) {
            if (file.mimetype === 'application/pdf') {
                fileChunks = await parsePDF(file.buffer);
            } else {
                const text = file.buffer.toString('utf-8');
                const chunkSize = 500; // Split text into chunks of 500 tokens
                for (let i = 0; i < text.length; i += chunkSize) {
                    fileChunks.push(text.slice(i, i + chunkSize));
                }
            }
        }

        // Generate embeddings for each chunk
        const embeddings = await Promise.all(
            fileChunks.map(async (chunk) => {
                const response = await openai.createEmbedding({
                    model: 'text-embedding-ada-002',
                    input: chunk,
                });
                return response.data.data[0].embedding;
            })
        );

        // Store embeddings in ChromaDB
        await storeInChroma('pdf-embeddings', fileChunks, embeddings);

        // Interact with OpenAI's LLM for response
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
        });

        return { response: chatResponse.data.choices[0].message?.content };
    } catch (error) {
        console.error('Error handling message and file:', (error as Error).message);
        throw error;
    }
};