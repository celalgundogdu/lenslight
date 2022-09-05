import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import connectDb from './db.js';
import pageRoute from './routes/pageRoute.js';
import photoRoute from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js';
import { checkUser } from './middlewares/authMiddleware.js';
import fileupload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import methodOverride from 'method-override';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

connectDb();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileupload({ useTempFiles: true }));
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

app.use('*', checkUser);
app.use('/', pageRoute);
app.use('/photos', photoRoute);
app.use('/users', userRoute);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});