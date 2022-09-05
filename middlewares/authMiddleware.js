import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if (err) {
                    return res.redirect('/login');
                }
                next();
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'No authorized'
        })
    }
};

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if(err) {
                    res.locals.user = null;
                    next();
                } else {
                    res.locals.user = await User.findById(decodedToken.userId);
                    next();
                }
            });
        } else {
            res.locals.user = null;
            next();
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            error
        })
    }
};

export { authenticateToken, checkUser };