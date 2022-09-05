import mongoose from 'mongoose';
const { Schema } = mongoose;

const photoSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String,
        required: true
    },
    imageId: {
        type:String
    }
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;