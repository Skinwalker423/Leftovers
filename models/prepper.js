const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;


const prepperSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'}]
})

prepperSchema.post('findOneAndDelete', async function(prepper) {
    
    if(prepper){
        console.log(prepper);
        await Review.deleteMany({_id: {$in: prepper.reviews}});
        
    }
} )

const Prepper = new mongoose.model('Prepper', prepperSchema);

module.exports = Prepper;