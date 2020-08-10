const express = require('express');
const router = express.Router();

//custom middleware for adysenlab - purpose only
const firebaseMiddleware = require('express-firebase-middleware');

router.use((req, res, next) => {
    next();
});

//  deprecated usages
//router.use('/auth', firebaseMiddleware.auth);

router.get('/', (req, res) => {
    res.json({
        message: 'fireStore home'
    });
});

router.get('/hello', (req, res) => {
    res.json({
        message: `You're welcomed in as  with Firebase admin: `
    });
});

module.exports = router;