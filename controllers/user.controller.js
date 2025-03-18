import User from "../models/user.models.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({success: true, users});
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'});
        }
        res.status(200).json({success: true, user});
    } catch (error) {
        next(error);
    }
}