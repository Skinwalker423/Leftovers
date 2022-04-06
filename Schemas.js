const Joi = require('joi');

module.exports.prepperSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    })

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    description: Joi.string().required()
})
