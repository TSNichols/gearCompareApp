const mongoose = require('mongoose')

// Create schema
const sellerSchema = new mongoose.Schema({
    name:               { type: String, default: ''},
    currency:           { type: String, uppercase: true, trim: true, default: 'USD'},
    basePrice:          { type: Number, min: 0, default: 0},
    membershipReq:      { type: Boolean, default: false },
    discount:           { type: Number, min: 0, default: 0 },
    shipping:           { type: String, default: 'Free' },
    tax:                { type: Number, min: 0, default: 0 },
    availability:       { type: Number, min: 0, default: 0 },
    rating:             { type: Number, min: 0, default: 0 },
    totalPrice:         { type: Number, min: 0, default: 0 },
    hidden:             { type: Boolean, default: true },
    link:               { type: String, default: '' },
    createdAt:          { type: Date, default: () => Date.now(), immutable: true },
    updatedAt:          { type: Date, default: () => Date.now() },
});

sellerSchema.pre('save', function(next){
    this.updatedAt = Date.now()
    next()
})

// Tells Node.js what to export
module.exports = sellerSchema;