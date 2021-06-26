module.exports = function () {
    var express = require('express');
    var router = express.Router();
    const bcrypt = require('bcryptjs');
    var adminController = require('../controllers/admin');
    router.route('/')
        .get(adminController.home)
    router.route('/index')
        .get(adminController.home)
    
    return router;
}