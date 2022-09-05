import mongoose from 'mongoose';

const connectDb = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: 'lenslight',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to db');
    }).catch(error => {
        console.log(`Db connection error: ${error}`);
    });
};

export default connectDb;