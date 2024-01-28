const express = require('express');
const cntrl = require('../controllers/settingsController');
const auth = require('../controllers/authController');

const router = express.Router();
router.use(auth.auth_required);

router.get('/', cntrl.settings);
router.get('/category', cntrl.categoryCRUD);
router.get('/get_categories_by_session_user', cntrl.get_categories);
router.get('/account_settings', cntrl.account_settings);

router.post('/category', cntrl.add_category);
router.delete('/delete_category', cntrl.delete_category);
router.put('/rename_category', cntrl.rename_category);
router.patch('/account_settings', cntrl.account_settings_patch);

module.exports = router;