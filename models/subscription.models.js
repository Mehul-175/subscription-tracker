import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price cannot be negative'],
    },
    currency: {
        type: String,
        enum: ['USD', 'INR', 'EUR'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        default: 'Monthly',
    },
    category:{
        type: String,
        enum: ['sports','news','entertainment','lifestyle','technology','finance','politics', 'other'],
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriods = {
            Daily: 1,
            Weekly: 7,
            Monthly: 30,
            Yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;