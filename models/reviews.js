const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;

