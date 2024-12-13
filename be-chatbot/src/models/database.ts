import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = 'your mongo uri here';
        if (!mongoURI) {
            throw new Error('MongoDB connection string is missing in the .env file');
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        const err = error as Error;
        console.error('MongoDB connection error:', err.message);
        console.error('Stack trace:', err.stack); // Detailed error information
        process.exit(1); // Exit the process on failure
    }
};

connectDB();

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    fileContent: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

// Debug schema creation
console.log('Message Schema created:', messageSchema);

const Message = mongoose.model('Message', messageSchema);

export const saveToDatabase = async (message: string, file: string) => {
    try {
        console.log('Preparing to save data to database...');
        console.log('Message:', message);
        console.log('File Content:', file);

        const newMessage = new Message({ message, file});
        await newMessage.save();
        console.log('✅ Data saved to MongoDB successfully');
    } catch (error) {
        console.error(' Error saving to database:', error);
        console.error('Stack trace:', (error as Error).stack); // Log stack trace for deeper debugging
        throw new Error('Failed to save data to database');
    }
};

