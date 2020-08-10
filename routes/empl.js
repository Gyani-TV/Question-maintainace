var express = require('express');
var router = express.Router();
var User = require('../models/employee');
var bodyParser = require('body-parser')
const isLoggedOn = require("../middlewares/isLoggedOn");
const isAccessValid = require('../middlewares/rbac')


/* GET users listing. */
router.get('/logon', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('company/employee/logon', { title: 'Employee Logon here' });

});

//POST route for updating data and report errors
router.post('/logon', function (req, res, next) {
  // confirm that user typed same password twice
  

    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        // add some headers to be used with nginx
        req.session.ipAddress= req.header('x-forwarded-for') || req.connection.remoteAddress;
        req.session.userEmail= user.email; 
        return res.redirect('/emp/profile');
      }
    });
  
})

/**
 * GET the Registration Done Step 1 of 2 raise a ticket 
 * and then the admin verifies it and gives storage access 
 */
router.get('/signup', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('company/employee/signup', { title: 'Employee Signup add ticker and OTP from admin' });

});


//POST route for updating data and report errors
router.post('/signup', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.user_password !== req.body.confirm_password) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    //res.send
("passwords dont match");
    return next(err+'passwords do not match');
  }



    var userData = {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      group: req.body.department,
      email: req.body.user_email,
      password: req.body.user_password,
      contact: req.body.contact_no
    }
    //console.log(userData)

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/emp/logon');
      }
    });
    //res.render('company/employee/signup', { title: 'Employee Signup add ticker and OTP from admin' })

})


// //to be removed
// router.get('/profile/:id',function(req, res, next) {
//   // res.send('respond with a resource');
//   var pageparams = {
//     title: 'Employee profile page',
//     empId: req.params.id
//   }
//   res.render('company/employee/profile',pageparams);

// });


// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          //err.status = 400;
          return next(err);
        } else {
          var ui= {
            group: user.group,
            pageparams :{
              title: 'Employee profile page',
              empId: req.session.userEmail
            }
          }
          res.render('company/employee/profile',ui);
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/emp/logon');
      }
    });
  }
});

module.exports = router;
