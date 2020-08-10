var mongoose = require('mongoose')
// data 
var Schema = mongoose.Schema

var QuestionSchema = new Schema({
    difficulty:{
        type:Number,    // this is set using autoincrementor module
        required:true,
        default:1
    },
    style: {
        type:Number,
        required: true        
    },  // 0 => for objective, 1 for descriptive // descriptive questions might not have a complete answer
    question:{
        caption:{
            type: String,
            required: true
        },
        file_id: Schema.Types.ObjectId,  // optional
        options:[String]
    },
    answer:{
        caption:{
            type:Number,  // the numerical count for the correct answer to the question
            required:true
        },
        file_id: {
            type: Schema.Types.ObjectId,  // optional
        },
        uri: { type: String, trim: true }   // optional
    } ,
    score: {
        type: Number,  // the marks that shall be alloted for solving this question
        required: true
    },
    subjectReference: {
        type: Schema.Types.ObjectId, 
        ref: 'subjects',
        require:true, 
    },
    lastModified: { type: Date, default: Date.now }   // set automatic to the server date of question creation and modification
})

// person schema for mongo 
var Question = mongoose.model('Questions', QuestionSchema)

module.exports = Question