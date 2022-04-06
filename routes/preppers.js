const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Prepper = require('../models/prepper');
const {validatePrepper} = require('../utilities/validations.js');
const isLoggedIn = require('../utilities/isLoggedIn');
const User = require('../models/users');
const {isPrepperAuthor} = require('../utilities/authentication');



router.get('/',catchAsync (async(req, res, next) => {
    const prepperDb = await Prepper.find({});
    res.render('preppers/prepper', { prepperDb });
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('preppers/new');
})
router.post('/',isLoggedIn, validatePrepper, catchAsync(async(req, res, next) => {
    const formData = req.body;
    const newPrepper = await new Prepper(formData);
    newPrepper.author = req.user;
    await newPrepper.save();
    req.flash('success', 'You have successfully created a new account');
    res.redirect(`preppers/${newPrepper._id}`);
}))

router.get('/:id',catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const prepper = await Prepper.findById(id).populate('author').populate({path:'reviews', populate: {path: 'author'}});
    if(!prepper){
        req.flash('error', 'Cannot find the prepper');
        res.redirect('/preppers');
    }
    res.render('preppers/show', {prepper}); 
}))

router.get('/:id/edit',isLoggedIn, isPrepperAuthor, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const editPrepperData = await Prepper.findById(id);
    if(!editPrepperData){
        req.flash('error', 'Cannot find the prepper');
        res.redirect('/preppers');
    }
    res.render('preppers/edit', { editPrepperData });
}))
router.put('/:id',isLoggedIn, isPrepperAuthor, catchAsync (async(req, res, next) => {
    const {id} = req.params;
    const editFormData = req.body;
    const updatedPrepperData = await Prepper.findByIdAndUpdate(id, editFormData);
    req.flash('success', 'You have successfully updated your account');
    res.redirect(`/preppers/${id}`);
}))
router.delete('/:id/delete',isLoggedIn, isPrepperAuthor, catchAsync (async(req, res, next) => {
    const {id} = req.params;
    const deletePrepper = await Prepper.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted your account');
    res.redirect('/preppers');
}))



module.exports = router;

