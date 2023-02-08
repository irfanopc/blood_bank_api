const mongoose = require('mongoose')
const bloodRequestSchema = new mongoose.Schema({
 name : String,   
 age:Number,
 blood_group :String,
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital'
}
})

const blood_request = mongoose.model('blood_request', bloodRequestSchema);

module.exports = blood_request;