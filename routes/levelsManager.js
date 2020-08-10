var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();

var Grades = require('../models/levels')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
// serve up all the levels
const isLoggedOn = require("../middlewares/isLoggedOn");
router.get('/',isLoggedOn,  function (req, res, next) {
      // the render ui data
    
  // get data about all the levels
  Grades.findall(req.session.userEmail, function (error, grade) {
    if (error || !grade) {
      //err.status = 401;
      return next(error);
    } else {
 
      

      res.render('company/exams/showLevels', {
        data: grade,
        pageparams: {
          title: 'Employee Level manager',
          empId: req.session.userEmail
        }
      })
    }
   // console.log(ui)
  });
    

})
//add a moderated new level
router.post('/add', isLoggedOn, async (req, res, next) => {
  var gradesData = {
    caption: req.body.level_caption,
    name:req.body.levelId,
    type:req.body.levelType
  }
  //console.log(gradesData)
  Grades.create(gradesData, function (error, grade) {
    if (error) {
      return next(error);
    } else {
      
      return res.redirect('/levels');
    }
  });
    
  });
  //display a form for adding new level
router.get('/add', isLoggedOn, async (req, res, next) => {
  

  var pageparams = {
    title: 'Employee Level creator',
    empId: req.session.userEmail
  }
res.render('company/exams/createLevels', pageparams)
});

// display all in that level
router.get('/turn/:identifier', async (req, res, next) => {

Grades.findOne({_identifier: req.param.id},
      function(err, grade) {
        // return a page to show the level data and link to create a subject
        res.render('company/exams/selectLevel', {
          data: grade,
          pageparams: {
            title: 'Level being used',
            empId: req.session.userEmail
          }
        })
      });
});
  
// load in the details of the // grade to be edited
router.get('/edit/:id', async (req, res, next) => {
  Grades.findOne({_id: req.params.id},
    function(err, grade) {
      // return a page to show the level data and link to create a subject
      //console.log(grade)
      res.render('company/exams/editLevel', {
        data: grade,
        pageparams: {
          title: 'Level data being edited',
          empId: req.session.userEmail
        }
      })
    });
});
 
router.post('/edit/:id', async (req, res, next) => {
  // get the updated Grade data
  var gradesData = {
    caption: req.body.updated_level_caption,
    name:req.body.updated_levelId,
    type:req.body.updated_levelType
  }
  Grades.findByIdAndUpdate({_id: req.params.id},gradesData,
    function(err, grade) {
      // return a page to show the level data and link to create a subject
      if (err || !grade) {
        return next(err);
      } else {
        
        return res.redirect('/levels');
      }
    });
});
//CURRENTLY UNUSED
// router.post('/purge/:id', async (req, res, next) => {
//   const { id } = req.params;
//   await Task.update({_id: id}, req.body);
//   res.redirect('/');
// });
  
module.exports = router;