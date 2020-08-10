//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

module.exports = function isLoggedIn(req, res, next) {
  var session = req.session;
    if (session.userEmail === undefined) {  // user not avaliable
      // user is inside a session 
      console.log('the session paramater of unauth',req.sesssion)
      var err= new Error("you are currently not authorized to be here. Try logging on")
      next(err)
    } else {
      // return unauthorized
    //   var err= new Error("you are currently not authorized to be here. Try logging on")
    //   next(err)
        // return unauthorized
        next();
    }
  };