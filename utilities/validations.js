const ExpressError = require('../utilities/ExpressError');
const { prepperSchema, reviewSchema } = require('../Schemas');

module.exports.validatePrepper = function (req, res, next) {
    const { error } = prepperSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.massage).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
