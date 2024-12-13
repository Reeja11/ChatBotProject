import { Configuration, OpenAIApi } from 'openai';

const openaikey = 'your-api-key-here'
const configuration = new Configuration({
    apiKey: openaikey,
});
const openai = new OpenAIApi(configuration);

export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text,
        });

        return response.data.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
};

