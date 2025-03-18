import Subscription from "../models/subscription.models.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error)
    }
}


export const getSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            return res.status(401).json({success: false, message: 'You are not the owner of this account'});
        }

        const subscriptions = await Subscription.find({user: req.user._id});

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error)
    }
}