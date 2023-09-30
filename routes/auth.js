const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth");

router.get('/', authController.loginView);
router.get('/register', authController.registerView);

router.post('/signUp', authController.signUp);
router.post('/login', authController.login);

router.get('/logout', authController.logout);


var isAutenticated = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.redirect("/?error=debe estar logueado para acceder a esta funcionalidad");
}


module.exports.isAutenticated = isAutenticated;
module.exports.router = router; 