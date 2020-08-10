var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();

var Subjects = require('../models/subjects') // the subjects instance
var Grade = require('../models/levels') // level instance
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
// serve up all the levels
const isLoggedOn = require("../middlewares/isLoggedOn");
router.get('/turn/:levelId', isLoggedOn, function (req, res, next) {
  // the render ui data
  let ui = {
    data: []
  }
  console.log(`the levelid selected is:${req.params.levelId}`)
  ui.levelSelected=req.params.levelId;
  // get data about all subjects on this levels
  Grade.findOne({ _id: req.params.levelId }, function (error, grade) {
    if ( !grade || error) {
      //err.status = 401;
      ui.refrain = `there is no subject created at this level or this level might have a sub-level `
      return res.render('company/exams/showSubjects', ui);
    } else {
      // find the subjects for the corresponding subjects_ref tied to your level
      grade.subjects.forEach(subject => {
        console.log('subject found : reference', subject.subject_ref);
        Subjects.findOne({_id: subject.subject_ref}, (err, subject)=>{
          if(err || subject===undefined) console.error('a subject tied to this level cannot be found id::',err)
          else ui.data.push(subject);
        })
      });
      console.log(ui.data)

      ui.pageparams = {
        title: 'View a subject ',
        empId: req.session.userEmail
      }
      res.render('company/exams/showSubjects', ui)
    }
  });


})
//add a moderated new Subject
router.post('/add', isLoggedOn, async (req, res, next) => {
  var subjectsData = {
    caption: req.body.subject_caption,
    levelsReference: req.body.levelId,
    description: {
      caption: req.body.subject_descriptor
    }
  }
  console.log(subjectsData);
  //check if the  level has no sublevel within itself
  // for there has to be strong bonding between the level and the subject
  // Grades.create(gradesData, function (error, grade) {
  //   if (error) {
  //     return next(error);
  //   } else {

  //     return res.redirect('/levels');
  //   }
  // });
  Grade.findOne({_id: subjectsData.levelsReference},(error, grade) => {
    console.log('sublevel status:', grade.subLevel);
    if (error || !grade){
      console.error('this level cannot be traced:', error )
      console.trace()
    }
    else if(grade.subLevel === undefined || grade.subLevel === null ){
      // ther is no sublevel -- proceed to add a subject and link it to this level
      Subjects.create(subjectsData, function(err, subject){
        if(err || !subject){
          console.error('the subject cannot be created check your code:', err)
        }else{
          //chain the subject creation to update the level
          Grade.update({_id: subjectsData.levelsReference},
            {$push:
              {"subjects":{subject_ref: subject._id}
            }
          },issue => {
            if (issue) console.error('subject created but the backlink to level failed contact dev')
          })

        }// subject creation done
      })
    } else{
      // this grade contains sublevels
      console.error('try entry on a leaf level :')
    }
  });
  
});
//display a form for adding new subject to the level if there is no sublevel
router.get('/add/:levelId', isLoggedOn, async (req, res, next) => {
  let ui = {
    data: []
  }
  //pass the level id sent to it as a parameter
  ui.levelSelected =req.params.levelId;
  console.log(`the subject is to reference this level : ${ui.levelSelected}`)
  ui.pageparams = {
    title: 'Employee Level creator',
    empId: req.session.userEmail
  }
  res.render('company/exams/createSubjects', ui)
});

// display all in that level
// router.get('/turn/:id', async (req, res, next) => {
//   let { id } = req.params;
//   const task = await Task.findById(id);
//   task.status = !task.status;
//   await task.save();
//   res.redirect('/');
// });

// currently you can only update the description  or title of subjects 
router.get('/edit/:id', async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  console.log(task)
  res.render('edit', { task });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Task.update({ _id: id }, req.body);
  res.redirect('/');
});
// send a delete request to  affiliate centre for the deletion of the mistakenly created subject or cascaded questions 
router.post('/prune/:id', async (req, res, next) => {
  const { id } = req.params;
  await Task.update({ _id: id }, req.body);
  res.redirect('/');
});
module.exports = router;