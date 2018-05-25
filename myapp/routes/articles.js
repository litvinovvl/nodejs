let express = require('express');
let article = express.Router();
let createError = require('http-errors');
let store = require('../store');

//GET-----------------------------------------------------------------------------------------------------------------//

article.get('/', function(req, res, next) {
    res.json(store);
});

article.get('/:id', viewOne);

function viewOne(req, res, next) {
    let tmp = store.find(article => article.id == req.params.id);
    if(tmp) {
        res.json(tmp);
    } else {
        next(createError(404));
    }
}

//DELETE--------------------------------------------------------------------------------------------------------------//

article.delete('/:id', deleteOne);

function deleteOne(req, res, next) {
    let i = store.indexOf(store.find(article => article.id == req.params.id));
    if(i !== -1) {
        store.splice(i, 1);
        res.status(200);
        res.end();
    } else {
        next(createError(404));
    }
}

//POST----------------------------------------------------------------------------------------------------------------//

article.post('/', postOne);

function postOne(req, res, next) {
    if (req.body instanceof Object && req.body.hasOwnProperty('userId') && req.body.hasOwnProperty('title') && req.body.hasOwnProperty('body')) {
        let tmp = { ...req.body, id: Date.now() };
        store.push(tmp);
        res.send(store[store.length - 1]);
    } else {
        next(createError(422));
    }
}

//PUT-----------------------------------------------------------------------------------------------------------------//

article.put('/:id', checkOne, putOneAccept);

function checkOne(req, res, next) {
    if(store.indexOf(store.find(article => article.id == req.params.id)) !== -1) {
        next()
    } else {
        next(createError(404));
    }
}

function putOneAccept(req, res, next) {
    let i = store.indexOf(store.find(article => article.id == req.params.id));
    if (req.body instanceof Object && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('userId') && req.body.hasOwnProperty('title') && req.body.hasOwnProperty('body')) {
        store[i] = { ...req.body, id: Number(req.body.id), userId: Number(req.body.userId) };
        res.send(store[i]);
    } else {
        next(createError(422));
    }
}

//PATCH---------------------------------------------------------------------------------------------------------------//

article.patch('/:id', checkOne, patchOneAccept);

function patchOneAccept(req, res, next) {
    let i = store.indexOf(store.find(article => article.id === Number(req.params.id)));
    if(req.body instanceof Object){
        store[i] = { ...store[i], ...req.body };
        res.send(store[i]);
    } else {
        next(createError(422));
    }
}

module.exports = article;
