const session = require('express-session');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Category = require('../models/category');

const auth_sign_up = (req, res) => {
    res.render('auth/signup', { title: 'SignUp', session: req.session })
}

const auth_sign_in = (req, res) => {
    if (!req.session.user) res.render('auth/signin', { title: 'SignIn', session: req.session });
    else {
        res.redirect('/');
    }
}

const auth_sign_in_post = (req, res) => {
    User.findOne({username: req.body.username})
        .then((result) => {
            bcrypt.compare(req.body.password, result.password)
            .then((isCorrect) => {
                if (isCorrect) {
                    req.session.user = result.username;
                    console.log(req.session);
                    res.redirect('/');
                }
                else {
                    res.redirect('/auth/signin');
                }
            })
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/auth/signin');
        });
}

const auth_sign_up_post = (req, res) => {
    if (req.body.password == req.body.confirmation) {
        let user_data = req.body;
        bcrypt.hash(user_data.password, 10).then((encryptedPwd) => {
            user_data.password = encryptedPwd;
            const user = new User(user_data);
            user.save()
                .then((result) => {
                    const category1 = new Category({ title: 'cash', user: result.username });
                    const category2 = new Category({ title: 'card', user: result.username });

                    category1.save();
                    category2.save();

                    console.log(user);
                    res.redirect('/auth/signin');
                })
                .catch((err) => {
                    console.log(err);
                    res.send('username is invalid')
                });
        });
    }
    else {
        res.redirect('/auth/signup');
    }
}

const auth_sign_out_post = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            const respon = {
                url: '/auth/signin',
            }
            res.json(respon);
        }
    });
}

const auth_required = (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/auth/signin')
    }

}

module.exports = {
    auth_sign_up,
    auth_sign_in,
    auth_sign_in_post,
    auth_sign_up_post,
    session,
    bcrypt,
    auth_required,
    auth_sign_out_post
}