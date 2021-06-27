var express = require('express');
const crypto = require("crypto");
const { User } = require('../models');
var router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        if (req.session.loggedin) {
            res.render('board', { uid: req.session.uid });
        } else {
            console.log('[Ragister GET] Register page loading...');
            res.render('register');
        }
    })
    .post(async (req, res, next) => {
        try {
            var id = req.body.id;
            var pw = req.body.pw;
            var email = req.body.email;
            console.log(req.body);

            console.log("Try to add user");
            var salt = crypto.randomBytes(64).toString("base64");
            var hashPw = crypto
                .pbkdf2Sync(pw, salt, 100, 64, "sha512")
                .toString("base64");
            console.log(hashPw);

            const addUser = await User.create({
                username: id,
                password: hashPw,
                salt: salt,
                email: email,
            });

            console.log("Success to INSERT new user");
            res.render('login', {alert: ""});
        } catch (err) {
            console.log("Failed to INSERT new user");
            res.render('register');
        }
    })

router.route('/idcheck')
    .post(async (req, res, next) => {
        console.log("[POST] ID Check");
        const idcheck = await User.findOne({
            where: {
                username: req.body.id
            }
        }, { raw: true });

        if (idcheck != null) {
            res.json({ duplicate: 1 });
            console.log("ID Dup");
        } else {
            res.json({ duplicate: 0 });
            console.log("ID OK");
        }
    })

module.exports = router;