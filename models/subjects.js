var mongoose = require('mongoose')
// data 
var Schema = mongoose.Schema

var SubjectSchema = new Schema({
    name:{
        type:Number,    // this is set using autoincrementor module
        required:true,
        default:1
    },
    levelsReference: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'levels',
        index: true,
        require: true
    }], 
    description:{
        caption:{
            type: String,
            required: true
        }
    },
    questions:[{
        question_ref: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Questions'
        },
      }],//levels can have recursive sublevels
    lastModified: { type: Date, default: Date.now }   // set automatic to the server date of question creation and modification
})

// person schema for mongo 
var Subjects = mongoose.model('subjects', SubjectSchema)

module.exports = Subjects