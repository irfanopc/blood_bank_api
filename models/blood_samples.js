const mongoose = require('mongoose')
const bloodSchema = new mongoose.Schema({
 blood_group :String,
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital'
}
 
})

const blood_samples = mongoose.model('blood_samples', bloodSchema);

module.exports = blood_samples;