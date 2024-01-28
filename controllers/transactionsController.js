const Transaction = require('../models/transaction');
const Category = require('../models/category');
const { response } = require('express');

const main_view = (req, res) => {
    Transaction.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$username", req.session.user] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$datetime" },
                    week: { $week: "$datetime" },
                },
            }
        },
        {
            $sort: {
                "_id.year": -1,
                "_id.week": -1,
            }
        }
    ])
    .then(result => {
        const pg = Number(req.params.pg) - 1;

        Category.find({user: req.session.user})
        .then((raw_categories) => {
            var categories = []
            for (let i = 0; i < raw_categories.length; ++i) {
                categories[`${raw_categories[i]._id}`] = raw_categories[i].title;
            }

            if (result.length == 0 && pg == 0) res.render('index_s', { title: 'Home', session: req.session, transactions: {}, categories });
            else if ((result.length == 0 && pg != 1) || pg >= result.length || pg < 0) res.status(404).render('404', { title: 'Not found', session: req.session });
            else {
                Transaction.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $week: "$datetime" }, result[pg]["_id"].week ] },
                                    { $eq: [{ $year: "$datetime" }, result[pg]["_id"].year ] },
                                    { $eq: ["$username", req.session.user] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$datetime" },
                                week: { $week: "$datetime" },
                                dayOfWeek: { $dayOfWeek: "$datetime" }
                            },
                            transactions: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: {
                            "_id.dayOfWeek": 1,
                            "_id.week": -1,
                            "_id.year": -1
                        }
                    }
                ])
                .then((total_result) => {
                    const transactions = [];
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                    for (var i = 0; i < total_result.length; i++) {
                        transactions[i]= {
                            "dayOfWeek": days[total_result[i]["_id"].dayOfWeek - 1],
                            "transactions": total_result[i]["transactions"]
                        }
                    }
                    res.render('index_s', { title: 'Home', session: req.session, transactions, categories });
                })
            }
        })
    })
    .catch(err => {
        console.error(err);
    });
}

const create_transaction = (req, res) => {
    req.body.datetime = new Date(req.body.datetime);
    
    const transaction = new Transaction({
        username: req.session.user,
        type: req.body.type,
        amount: req.body.amount,
        category: req.body.category,
        datetime: req.body.datetime
    });

    transaction.save()
        .then((result) => {
            res.json({state: 'success'});
        })
        .catch((err) => {
            console.log(err);
        });
}

const get_transaction = (req, res) => {
    const filter = { username: req.session.user, _id: req.params.id };
    
    delete req.body.id;
    delete req.body.username;
    
    const upd = req.body;

    Transaction.findOne(filter)
        .then((result) => {
            Category.findOne({_id: result.category})
            .then((category) => {
                if (category) {
                    var response = {body: result, category_title: category.title};
                }
                else {
                    var response = {body: result, category_title: ''};
                }
                res.json(response);
            })
        })
        .catch((err) => {
            console.log(err);
        });
}

const edit_transaction = (req, res) => {
    const filter = { username: req.session.user, _id: req.params.id };

    delete req.body.id;
    delete req.body.username;
    
    const upd = {
        type: req.body.type,
        amount: req.body.amount,
        category: req.body.category,
        datetime: req.body.datetime
    };

    Transaction.findOneAndUpdate(filter, upd)
        .then((result) => {
            res.json({state: 'success'});
        })
        .catch((err) => {
            console.log(err);
        });
}

const delete_transaction = (req, res) => {
    const filter = { username: req.session.user, _id: req.params.id };

    Transaction.findOneAndDelete(filter)
        .then((result) => {
            res.json({state: 'success'});
        })
        .catch((err) => {
            console.log(err);
            res.json({state: 'fail'});
        })
}

function incExp_view (req, res, filter, title) {
    Transaction.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$username", req.session.user] },
                        { $eq: filter }
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$datetime" },
                    week: { $week: "$datetime" },
                },
            }
        },
        {
            $sort: {
                "_id.year": -1,
                "_id.week": -1,
            }
        }
    ])
    .then(result => {
        const pg = Number(req.params.pg) - 1;

        Category.find({user: req.session.user})
        .then((raw_categories) => {
            var categories = []
            for (let i = 0; i < raw_categories.length; ++i) {
                categories[`${raw_categories[i]._id}`] = raw_categories[i].title;
            }

            if (result.length == 0 && pg == 0) res.render('index_s', { title: 'Home', session: req.session, transactions: {}, categories });
            else if ((result.length == 0 && pg != 1) || pg >= result.length || pg < 0) res.status(404).render('404', { title: 'Not found', session: req.session });
            else {
                Transaction.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $week: "$datetime" }, result[pg]["_id"].week ] },
                                    { $eq: [{ $year: "$datetime" }, result[pg]["_id"].year ] },
                                    { $eq: filter },
                                    { $eq: ["$username", req.session.user] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$datetime" },
                                week: { $week: "$datetime" },
                                dayOfWeek: { $dayOfWeek: "$datetime" }
                            },
                            transactions: { $push: "$$ROOT" }
                        }
                    },
                    {
                        $sort: {
                            "_id.dayOfWeek": 1,
                            "_id.week": -1,
                            "_id.year": -1
                        }
                    }
                ])
                .then((total_result) => {
                    const transactions = [];
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                    for (var i = 0; i < total_result.length; i++) {
                        transactions[i]= {
                            "dayOfWeek": days[total_result[i]["_id"].dayOfWeek - 1],
                            "transactions": total_result[i]["transactions"]
                        }
                    }
                    res.render('index_s', { title: title, session: req.session, transactions, categories });
                })
            }
        })
    })
    .catch(err => {
        console.error(err);
    });
}

module.exports = {
    main_view,
    create_transaction,
    get_transaction,
    delete_transaction,
    edit_transaction,
    incExp_view,
}