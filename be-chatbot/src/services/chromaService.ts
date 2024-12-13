import { ChromaClient } from 'chromadb-js';
import { Configuration, OpenAIApi } from 'openai';
import { IChromaService } from '../interfaces/ChromaService';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class ChromaService implements IChromaService {
    private client: ChromaClient;
    private collection: any = null;
    private static instance: ChromaService;

    private constructor() {
        this.client = new ChromaClient({
            path: "http://localhost:8000"
        });
    }

    public static getInstance(): ChromaService {
        if (!ChromaService.instance) {
            ChromaService.instance = new ChromaService();
        }
        return ChromaService.instance;
    }

    public async initialize(): Promise<boolean> {
        try {
            console.log("Initializing ChromaDB...");

            this.collection = await this.client.getOrCreateCollection({
                name: "document_store",
                metadata: {
                    "description": "Document storage for chat application",
                    "timestamp": new Date().toISOString()
                }
            });

            const collections = await this.client.listCollections();
            console.log("Available collections:", collections);

            console.log("ChromaDB initialized successfully");
            return true;
        } catch (error) {
            console.error("ChromaDB initialization error:", error);
            return false;
        }
    }

    public async addDocuments(texts: string[], metadata: any[] = []): Promise<void> {
        if (!this.collection) {
            throw new Error("ChromaDB collection not initialized");
        }

        try {
            const embeddings = await Promise.all(
                texts.map(async (text) => {
                    const response = await openai.createEmbedding({
                        model: "text-embedding-ada-002",
                        input: text,
                    });
                    return response.data.data[0].embedding;
                })
            );

            const ids = texts.map((_, index) => `doc_${Date.now()}_${index}`);

            await this.collection.add({
                ids: ids,
                embeddings: embeddings,
                metadatas: metadata.length ? metadata : texts.map(() => ({})),
                documents: texts
            });

            console.log(`Added ${texts.length} documents to ChromaDB`);
        } catch (error) {
            console.error("Error adding documents:", error);
            throw error;
        }
    }

    public async queryDocuments(query: string, numResults: number = 5): Promise<string[]> {
        if (!this.collection) {
            throw new Error("ChromaDB collection not initialized");
        }

        try {
            const embeddingResponse = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: query,
            });
            const queryEmbedding = embeddingResponse.data.data[0].embedding;

            const results = await this.collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: numResults,
            });

            return results.documents?.[0] || [];
        } catch (error) {
            console.error("Error querying documents:", error);
            throw error;
        }
    }

    public async getCollectionInfo() {
        if (!this.collection) {
            return null;
        }

        try {
            const count = await this.collection.count();
            return {
                name: this.collection.name,
                count,
            };
        } catch (error) {
            console.error("Error getting collection info:", error);
            return null;
        }
    }

    public async reset(): Promise<void> {
        try {
            if (this.collection) {
                await this.client.deleteCollection({
                    name: this.collection.name
                });
            }
            await this.initialize();
            console.log("ChromaDB reset successfully");
        } catch (error) {
            console.error("Error resetting ChromaDB:", error);
            throw error;
        }
    }
}

export default ChromaService.getInstance();