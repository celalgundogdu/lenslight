import nodemailer from 'nodemailer';
import Photo from '../models/photoModel.js';
import User from '../models/userModel.js';

const getIndexPage = async (req, res) => {
    const photos = await Photo.find().sort({ createdAt: -1 }).limit(3);
    const numOfUsers = await User.countDocuments({});
    const numOfPhotos = await Photo.countDocuments({});
    res.render('index', {
        photos,
        numOfPhotos,
        numOfUsers,
        path: 'index'
    });
};

const getAboutPage = (req, res) => {
    res.render('about', {
        path: 'about'
    });
};

const getContactPage = (req, res) => {
    res.render('contact', {
        path: 'contact'
    });
}

const getRegisterPage = (req, res) => {
    res.render('register', {
        path: 'register'
    });
};

const getLoginPage = (req, res) => {
    res.render('login', {
        path: 'login'
    });
};

const getLogout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}

const sendMail = async (req, res) => {
    const htmlTemplate = `
        <h2>Mail Details</h2>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <p>${req.body.message}</p>
    `;
    
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: process.env.NODE_MAIL, // generated ethereal user
            pass: process.env.NODE_PASSWORD, // generated ethereal password
            },
        });
        // send mail with defined transport object
        await transporter.sendMail({
            to: "celalgundogdu.dev@gmail.com", // list of receivers
            subject: `MAIL FROM ${req.body.email}`, // Subject line
            html: htmlTemplate, // html body
        });
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
}

export { getIndexPage, getAboutPage, getRegisterPage, getLoginPage, getLogout, getContactPage, sendMail };