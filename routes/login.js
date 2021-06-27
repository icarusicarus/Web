const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { User } = require('../models');

router.route('/')
    .get(async (req, res, next) => {
        console.log(req.session.loggedin);
        if (req.session.loggedin == undefined) {
            console.log("[Login GET] Login page loading...");
            res.render('login', {alert: ""});
        } else {
            console.log("[Login GET] Already loggedin. Go to main page.");
            res.redirect('/board');
        }
    })
    .post(async (req, res, next) => {
        console.log("[Login POST]");
        const id = req.body.username;
        const pw = req.body.password;

        if (id && pw) {
            const hashPw = await getHashPW(id, pw);
            if (hashPw == null) {
                console.log("Login fail, redirect login page");
                res.render('login', {alert: "Please check ID and PW"});
            } else {
                try {
                    const login = await User.findOne({
                        where: {
                            username: id,
                            password: hashPw
                        }
                    }, { raw: true });

                    var logged = login.username;

                    if (logged) {
                        req.session.loggedin = true;
                        req.session.uid = id;
                        res.redirect('/board');
                        console.log("Login OK!");
                    }
                    
                } catch (err) {
                    console.error(err);
                    res.render('login', {alert: "Something Wrong :(\nPlease Login Correctly"});
                }
            }
        }
    })

async function getHashPW(username, pw, callback) {
    const exist = await User.findOne({
        where: { username: username }
    }, { raw: true });

    if (exist != null) {
        const result = await User.findAll({
            attributes: ['salt'],
            where: { username: username }
        }, { raw: true });

        var salt = result[0].salt;
        var hashPW;
        if (salt) {
            hashPw = crypto
                .pbkdf2Sync(pw, salt, 100, 64, "sha512")
                .toString("base64");
        } else {
            console.log("[Error] getHashPW: Can't find correspond ID.");
            return 0;
        }
    } else {
        var hashPW = null;
        console.log("No such user! You need to register.");
        return hashPW;
    }

    return hashPw;
}

module.exports = router;