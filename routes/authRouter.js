const express = require('express');
const aur = require('../controllers/authController.js')

const router = express.Router();

router.use(aur.session({
    secret: 'my-key-phrase',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));
router.get('/signup', aur.auth_sign_up);
router.get('/signin', aur.auth_sign_in);
router.post('/signin', aur.auth_sign_in_post);
router.post('/signup', aur.auth_sign_up_post);
router.delete('/signout', aur.auth_sign_out_post);
router.get('/', (req, res) => { res.redirect('/auth/signup') });

module.exports = router;