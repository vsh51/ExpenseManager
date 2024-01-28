const express = require('express');
const cntrl = require('../controllers/transactionsController');
const auth = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/page/1');
})

router.get('/page/:pg', auth.auth_required, cntrl.main_view);
router.post('/create_transaction', auth.auth_required, cntrl.create_transaction);
router.get('/get_transaction/:id', auth.auth_required, cntrl.get_transaction);
router.put('/edit_transaction/:id', auth.auth_required, cntrl.edit_transaction);
router.delete('/delete/:id', auth.auth_required, cntrl.delete_transaction);

router.get('/incomes/page/:pg', auth.auth_required, (req, res) => {
    cntrl.incExp_view(req, res, ["$type", "income"], "Incomes");
});
router.get('/expenses/page/:pg', auth.auth_required, (req, res) => {
    cntrl.incExp_view(req, res, ["$type", "expense"], "Expenses");
});

module.exports = router;