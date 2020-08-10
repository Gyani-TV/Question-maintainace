
var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();

var Subject= require('../models/subjects')
var Question = require('../models/questionModel')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


const isLoggedOn = require("../middlewares/isLoggedOn");
const isAccessValid = require('../middlewares/rbac')
// serve up index
router.get('/turn',isLoggedOn,  function (req, res) {
    let ui = {
        data: [],
        refrain:'no subject is available or there is an error', 
        subject: req.query.subject,
        pageparams : {
        title: 'Employee question controller',
        empId: req.session.userEmail
      }
    }
    //get all the question for the specified subject id
    Subject.findOne({_id: req.query.subject},(error, doc) => {
        if(error|| !doc) console.error('this doc data cannot be recovered')
        else{
            doc.questions.forEach(subject => {
                Question.findById(subject.question_ref,(err, quest)=> {
                    if(err || !quest) console.error('the question cannot be recovered :', subject.subject_ref)
                    else {
                        ui.data.push(quest);
                    }
                })
            });
        }
    })
    
    res.render('company/exams/showQuestions', ui)
})
router.get('/create/:subjectId',isLoggedOn,  function (req, res) {
    //console.log('subject parameter received :subject id -> ', req.query.subject) 
    // reset ui data
    let ui = {
        data: [],
        refrain:'no subject is available or there is an error', 
        subject: req.params.subjectId,
        pageparams : {
        title: 'Employee question controller',
        empId: req.session.userEmail
      }
    }
    res.render('company/exams/createQuestions', ui)
})

// 1. Add Question
router.post('/create', isLoggedOn, function (req, res) {

    //check if the question type is 0/1
    var questionType;
    if(req.body.Question_type ==="objective"){
        questionType = 0;
    }else
        questionType=1;
    var options = [];
    var correctAnswer ;

    if (req.body.correct1 =='on'){
        console.log('option1')
        correctAnswer = 1
    }else     if (req.body.correct2 == "on"){
        console.log('option2')
        correctAnswer = 2
    }else     if (req.body.correct3 == "on"){
        console.log('option3')
        correctAnswer =3 
    }else     if (req.body.correct4 == "on"){
        console.log('option4')
        correctAnswer= 4
    }
    else{

        correctAnswer= 0
    }
    options.push(req.body.answer1)
    options.push(req.body.answer2)
    options.push(req.body.answer3)
    options.push(req.body.answer4)
    // setup data in the model
    // need to add both files to answers and questions
    var questionModel = Question({
        style: questionType,
        question:{
            caption: req.body.question,
            options: options  // this is the array of the input answerss
        },
        answer:{
            caption: correctAnswer, //onlly one correct answerr
            uri:req.body.uri
        },
        score: req.body.score,
    })

    console.log(questionModel);
 
    // ui.data[ui.menuitem] = {
    //     status: '',
    //     action: '',
    //     data: ''
    // }

    questionModel.save(function (err) {
        if (err) {
            console.error('question cannot be added contact dev')
        } else {
            Subject.findByIdAndUpdate({_id: req.body.subjectId},
                {$push:
                {
                    "questions": {question_ref: questionModel._id}
                }}
                ,(err,updated) =>{
                if(err || !updated) console.error('question added but subject cannot be updated')
                else console.log('the updated question is added')

            })
        }

        res.redirect(200,'/questions/turn?subject='+req.body.subjectId)
    })

})

// 2. List questions
router.get('/all', isLoggedOn, function (req, res) {

    Question.find({}, function (err, questions) {

        ui.menuitem = 2
        ui.data[ui.menuitem] = {
            status: '',
            action: '',
            data: ''
        }

        if (err) {
            ui.data[ui.menuitem].status = '500'
            ui.data[ui.menuitem].data = err
        } else {
            ui.data[ui.menuitem].status = '200'
            ui.data[ui.menuitem].data = questions
        }

        ui.data[ui.menuitem].action = 'read'
        res.render('exams/questions', {
            ui: ui
        })
    })
})



// 3. Update the question
router.post('/update', isLoggedOn, function (req, res) {

    if (!mongoose.Types.ObjectId.isValid(req.body.mongoid)) {
        res.status(500)
        res.render('./confirm_person_update', {
            "_id": "ERROR Invalid Mongo ID"
        })
    }
    console.log(req.body);
    // setup update data in the model
    // get date time of modification of the question from the server 
    var date =  Date.now();
    var modQuestion = {
        score: req.body.score_mod,
        answer: {
            uri: req.body.uri_mod
        },
        lastModifed: date,
        difficulty: req.body.difficulty_mod
    }

    Question.findByIdAndUpdate(req.body.mongoid, modQuestion, function (err, question) {

        ui.menuitem = 3
        ui.data[ui.menuitem] = {
            status: '',
            action: '',
            data: ''
        }

        if (err) {
            ui.data[ui.menuitem].status = '500'
        } else {
            ui.data[ui.menuitem].status = '200'
            ui.data[ui.menuitem].data = {
                oldEntry: question,
                newEntry: modQuestion
            }
        }

        ui.data[ui.menuitem].action = 'update'
        res.render('exams/questions', {
            ui: ui
        })
    })
})


// 4. Delete Question
router.post('/delete', isLoggedOn, function (req, res) {

    ui.menuitem = 4
    ui.data[ui.menuitem] = {
        status: '',
        action: '',
        data: ''
    }

    // is id valid?
    if (!mongoose.Types.ObjectId.isValid(req.body.mongoid)) {
        res.status(500)
        ui.data[ui.menuitem].status = '500'
        ui.data[ui.menuitem].data = ui.data[ui.menuitem].status = '500'
        ui.data[ui.menuitem].data = req.body.mongoid + ' is not a valid mongo ID'
    }

    Question.findByIdAndRemove(req.body.mongoid, function (err, question) {

        if (err) {
            ui.data[ui.menuitem].status = '500'
            ui.data[ui.menuitem].data = err
        } else {
            if (question == null) {
                ui.data[ui.menuitem].status = '404'
                ui.data[ui.menuitem].data = 'person id ' + req.body.mongoid + ' not found'
            } else {
                ui.data[ui.menuitem].status = '200'
                ui.data[ui.menuitem].data = question
            }
        }

        ui.data[ui.menuitem].action = 'update'
        res.render('exams/questions', {
            ui: ui
        })

    })
})

module.exports = router;