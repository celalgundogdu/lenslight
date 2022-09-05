import Photo from '../models/photoModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const createPhoto = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename: true,
                folder: 'lenslight'
            }
        );
        await Photo.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user._id,
            url: result.secure_url,
            imageId: result.public_id
        });
        fs.unlinkSync(req.files.image.tempFilePath);
        res.status(201).redirect('/users/dashboard');
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const getAllPhotos = async (req, res) => {
    try {
        const photos = res.locals.user
            ? await Photo.find({ user: { $ne: res.locals.user._id } })
            : await Photo.find();
        res.status(200).render('photos', {
            photos,
            path: 'photos'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const getPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id).populate('user');
        const currentUser = res.locals.user;
        let isOwner = false;
        if (currentUser) {
            isOwner = photo.user.equals(currentUser._id);
        }
        res.status(200).render('photo', {
            photo,
            isOwner,
            path: 'photos'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        await cloudinary.uploader.destroy(photo.imageId);
        await Photo.findByIdAndDelete(req.params.id);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (req.files) {
            await cloudinary.uploader.destroy(photo.imageId);
            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename: true,
                    folder: 'lenslight'
                }
            );
            photo.url = result.secure_url;
            photo.imageId = result.public_id;
            fs.unlinkSync(req.files.image.tempFilePath);
        }
        photo.name = req.body.name;
        photo.description = req.body.description;
        await photo.save();
        res.status(200).redirect(`/photos/${req.params.id}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};

export { createPhoto, getAllPhotos, getPhoto, deletePhoto, updatePhoto };