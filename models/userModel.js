import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isAlphanumeric, 'Username must contain only alphanumeric characters']
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password must be longer than 4 characters']
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    timestamps: true
});

userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

export default User;