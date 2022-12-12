const mongoose = require('mongoose')

const sellerSchema = require('./seller')

const ropeSchema = new mongoose.Schema({
    name:           { type: String, default: '' },
    brand:          { type: String, default: '' },
    diameter:       { type: Number, default: 0 },
    length:         { type: Number, default: 0 },
    falls:          { type: Number, default: 0 },
    dynElong:       { type: Number, default: 0 },
    staElong:       { type: Number, default: 0 },
    halfMark:       { type: Boolean, default: false },
    weight:         { type: Number, default: 0 },
    createdAt:      { type: Date, default: () => Date.now(), immutable: true },
    uiaaRated: {
        single:     { type: Boolean, default: false },
        half:       { type: Boolean, default: false },
        twin:       { type: Boolean, default: false },
    },
    seller:         [{ type: sellerSchema }],
})

// looks for or creates collection 'ropes' with schema 'ropeSchema'
const Rope = mongoose.model('Rope', ropeSchema)

module.exports = Rope






