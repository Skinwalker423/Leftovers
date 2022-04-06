
const Prepper = require('../models/prepper');
const Review = require('../models/reviews');
const User = require('../models/users');

module.exports.isPrepperAuthor = async(req, res, next) => {
    const { id } = req.params;
    const prepper = await Prepper.findById(id);
    console.log(prepper);
    if(req.user._id.equals(prepper.author._id)){
        return next();
    }
    req.flash('error', 'You are not authorized');
    res.redirect(`/preppers/${id}`);
}



module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, review_id } = req.params;
    try{
        const review = await Review.findById(review_id);
        if(!review){
            req.flash('error', 'No such review');
            return res.redirect(`/preppers/${id}`);
        }
        console.log(review);
        if(req.user._id.equals(review.author._id)){
            return next();
        }
    }catch(err){
        req.flash('error', err.message);
        res.redirect(`/preppers/${id}`);
    }

    
}


