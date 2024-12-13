const mongoose = require('mongoose');

const uri = 'mongodb+srv://reejaroy11:projectmongo@cluster1.inynd.mongodb.net/CHATBOT?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
