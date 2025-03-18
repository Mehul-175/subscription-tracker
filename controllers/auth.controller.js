import mongoose from "mongoose"
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

/* eslint-disable no-unused-vars */
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //create a new user

        const {name, email, password} = req.body

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                status: 'error',
                message: 'User already exists'
            })
        }

        //Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(!name || !email || !password){
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            })
        }

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session })

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        })


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}


export const signIn = async (req, res, next) => {
    
    try {
        const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        })    
    }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                status: 'error',
                message: 'Invalid password'
            })
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        return res.status(200).json({
            status: 'success',
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        })

    } catch (error) {
        next(error);
    }
}


export const signOut = async (req, res, next) => {}