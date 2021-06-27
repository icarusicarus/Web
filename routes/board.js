const express = require("express");
const router = express.Router();
const { Board } = require('../models');

router.route('/')
    .get(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        res.redirect('/board/list');
    })

// post list show
router.route('/list')
    .get(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        console.log("[Board GET] Board page loading...");
        const list = await Board.findAll();
        res.render('board', {list: list});
})

// create post
router.route('/write')
    .get(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        console.log("[Board Write GET] Board Write page loading...");
        res.render('write');
    })

    .post(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        var title = req.body.title;
        var body = req.body.body;
        var author = req.session.uid;
        await Board.create({
            title: title,
            body: body,
            author: author
        });
        res.redirect('/board/list');
    })

// post update
router.route('/edit/:postId')
    .get(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        console.log("[Board Edit GET] Board Edit page loading...");
        var postId = req.params.postId;
        const post = await Board.findOne({
            where: {
                id: postId
            }
        });
        res.render('edit', {post: post});
    })

    .post(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        var postId = req.params.postId;
        var title = req.body.title;
        var body = req.body.body;
        await Board.update({
            title: title,
            body: body
        }, {
            where: {
                id: postId
            }
        });
        res.redirect('/board/list');
    })

// post delete
router.route('/delete/:postId')
    .post(async (req, res, next) => {
        console.log("[DELETE]");
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        var post = req.params.postId;
        await Board.destroy({
            where: {
                id: post
            }
        });
        res.redirect('/board');
    })

// post show
router.route('/:postId')
    .get(async (req, res, next) => {
        if(req.session.loggedin==undefined){
            res.redirect('/');
        }
        var postId = req.params.postId;
        const post = await Board.findOne({
            where: {
                id: postId
            }
        });
        res.render('read', {post: post});
    })


module.exports = router;