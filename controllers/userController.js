import User from '../models/userModel.js';
import Photo from '../models/photoModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = {};
        // duplicate key error
        if (error.code = 11000) {
            errors.email = 'Email is already in use';
        }
        if (error.name === 'ValidationError') {
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
        }
        res.status(400).json(errors);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        let isPasswordSuccessful = false;
        if (user) {
            isPasswordSuccessful = await bcrypt.compare(password, user.password);
            if (isPasswordSuccessful) {
                const token = createToken(user._id);
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 100 * 60 * 60 * 24
                })
                res.redirect('/users/dashboard');
            } else {
                res.status(401).json({
                    success: false,
                    error: 'Invalid password'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const getDashboardPage = async (req, res) => {
    const photos = await Photo.find({ user: res.locals.user._id });
    const user = await User.findById(res.locals.user._id).populate(['followers', 'followings']);
    res.render('dashboard', {
        photos,
        user,
        path: 'dashboard',
    });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user._id } });
        res.status(200).render('users', {
            users,
            path: 'users'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const inFollowers = user.followers.some(follower => {
            return follower.equals(res.locals.user._id);
        });
        const photos = await Photo.find({ user: user._id });
        res.status(200).render('user', {
            user,
            photos,
            inFollowers,
            path: 'users'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const follow = async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { followers: res.locals.user._id } },
            { new: true }
        );
        user = await User.findByIdAndUpdate(
            res.locals.user._id,
            { $push: { followings: req.params.id } },
            { new: true }
        );
        res.status(200).redirect(`/users/${req.params.id}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const unfollow = async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(
            req.params.id,
            { $pull: { followers: res.locals.user._id } },
            { new: true }
        );
        user = await User.findByIdAndUpdate(
            res.locals.user._id,
            { $pull: { followings: req.params.id } },
            { new: true }
        );
        res.status(200).redirect(`/users/${req.params.id}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

export { createUser, login, getDashboardPage, getAllUsers, getUser, follow, unfollow };