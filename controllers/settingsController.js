const Transaction = require('../models/transaction');
const Category = require('../models/category');
const bcrypt = require('../controllers/authController').bcrypt;
const User = require('../models/user');

const settings = (req, res) => {
    Transaction.countDocuments({username: req.session.user})
    .then((count) => {
        Transaction.countDocuments({username: req.session.user, type: "income"})
        .then((totalInc) => {
        res.render('settings', { title: "Settings", session: req.session, count, totalInc })
        })
    })
}

const categoryCRUD = (req, res) => {
    res.render('category', { title: "Settings", session: req.session })
}

const add_category = (req, res) => {
    const user = req.session.user;
    const title = req.body.title;

    console.log(user, title);

    const category = new Category({ title, user });
    category.save()
    .then((result) => {
        res.json({status: "saved"});
    })
    .catch((err) => {
        res.json({status: "failed", err});
    })
}

const get_categories = (req, res) => {
    const user = req.session.user;

    Category.find({user})
    .then((result) => {
        res.json(result);
    })
}

const delete_category = (req, res) => {
    const user = req.session.user;
    
    Category.findOneAndDelete({
        user,
        _id: req.body._id
    })
    .then((result) => {
        res.json({status: "deleted"});
    })
    .catch((err) => {
        res.json({status: "failed"});
    })
}

const rename_category = (req, res) => {
    const user = req.session.user;
    const filter = {_id: req.body._id, user};
    const upd = req.body.title;

    Category.findOneAndUpdate(filter, { title: upd })
    .then((result) => {
        res.json({ status: 'updated' });
    })
    .catch((err) => {
        res.json({ status: "failed", err })
    })
}

const account_settings = (req, res) => {
    res.render('account_settings',{ title: "Settings", session: req.session })
}

const account_settings_patch = (req, res) => {
    if(req.body.confirmation === req.body.newPassword) {
        const user = req.session.user;
        bcrypt.hash(req.body.confirmation, 10).then((encryptedPwd) => {
            User.findOneAndUpdate({username: user}, {password: encryptedPwd})
            .then((result) => {
                req.session.destroy(err => {
                    if (!err) {
                        const respon = {
                            url: '/auth/signin',
                            status: "updated"
                        }
                        res.json(respon);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                res.json({status: "failed", err});
            })
        })
    }
}

module.exports = {
    settings,
    categoryCRUD,
    add_category,
    get_categories,
    delete_category,
    rename_category,
    account_settings,
    account_settings_patch
}