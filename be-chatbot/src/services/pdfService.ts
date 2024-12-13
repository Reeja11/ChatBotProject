import pdfParse from 'pdf-parse';

// Function to parse the PDF
export const parsePDF = async (fileBuffer: Buffer): Promise<string[]> => {
    try {
        const data = await pdfParse(fileBuffer);

        // Chunk the text for better embedding results (500-1000 tokens per chunk)
        const text = data.text;
        const chunkSize = 500; // Approximate number of tokens per chunk
        const chunks = [];

        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }

        return chunks;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file');
    }
};
