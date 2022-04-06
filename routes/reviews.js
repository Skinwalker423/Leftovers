const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Prepper = require('../models/prepper');
const Review = require('../models/reviews');
const {validateReview} = require('../utilities/validations.js');
const isLoggedIn = require('../utilities/isLoggedIn');
const {isReviewAuthor} = require('../utilities/authentication');


// function validateReview(req, res, next){
//     const { error } = reviewSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.massage).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

router.post('/reviews',isLoggedIn, validateReview, catchAsync (async(req, res, next) => {
    const { id } = req.params;
    const { rating, description } = req.body;
    const newReview = await new Review({rating, description});
    const prepper = await Prepper.findById(id);
    prepper.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await prepper.save();
    console.log(newReview);
    req.flash('success', 'You have successfully added a review');
    res.redirect(`/preppers/${id}`);
}))


router.delete('/reviews/:review_id',isLoggedIn, isReviewAuthor, catchAsync (async(req, res, next) => {
    console.log('this part worked');
    const { id, review_id } = req.params;
    console.log(review_id);
    const review = await Review.findByIdAndDelete(review_id);
    const prepper = await Prepper.findByIdAndUpdate(id, {$pull: {reviews: {$in: review_id}}});
    req.flash('success', 'You have successfully deleted a review');
    res.redirect(`/preppers/${id}`);
}))

module.exports = router;
