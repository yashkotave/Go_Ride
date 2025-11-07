const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"user",
        require : true
    },
    captain:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"captain",
    },
    pickup:{
        type:String,
        require : true,
    },
    pickupDes:{
        type:String,
        require : true,
    },
    destination:{
        type:String,
        require : true,
    },
    destinationDes:{
        type:String,
        require : true,
    },
    fare:{
        type:Number,
        require : true,
    },
    status : {
        type : String,
        enum : ['pending','ongoing','accepted','completed','cancelled'],
        default : 'pending',
    },
    duration:{
        type : Number,
    }, // In sec's
    distance:{
        type : Number,
    }, // In meters
    paymentId : {
        type : String
    },
    orderId : {
        type : String
    },
    signature : {
        type : String
    },
    otp:{
        type : String,
        select : false,
        require : true,
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
    vehicleType: {
        type: String,
        enum: ['car', 'moto', 'auto']
    },
})

module.exports = mongoose.model("ride",rideSchema)