import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        trim: true,
        minLength: 6,
        maxLength: 100
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;