const mongoose = require('mongoose')

let carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    engine: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    createdOn: { type: Date, default: Date.now() },    
    createdBy: { type: String },
    likes: { type: [String], required: true },
    reviews: { type: [String], required: true },
    timestamp: { type: Date, default: Date.now() }
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car