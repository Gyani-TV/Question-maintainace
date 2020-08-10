var mongoose = require('mongoose')
// data 
var Schema = mongoose.Schema

var LevelSchema = new Schema({
    name: {
        type:String,
        required: true        
    },
    type: {
        type:String,
        required: true,
        enum: ["school", "college", "office"]        
    },
    caption:{
        type: String,
        default:'Question set version alpha',
    },// if there is no sublevel only then we can have subjects under this level
    subjects:[{
      subject_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects'
      },
    }],//levels can have recursive sublevels
    subLevel:{
      type: Schema.Types.ObjectId,
      ref: 'levels',
    },
    lastModified: { type: Date, default: Date.now }   // set automatic to the server date of question creation and modification
})

// get the data for all the levels 
LevelSchema.statics.findall = function (userEmail, runner) {
  let email= userEmail
    Levels.find()
      .exec(function (err, levels) {
        if (err) {
          return runner(err)
        } else if (!levels) {
          var err = new Error(' No levels created.');
          //err.status = 401;
          return runner(err);
        }
        // return all the levels to the caller
        return runner(null, levels)
      });

      // Levels.find().
      //   then(customers => {              
      //     //console.log(customers[0].name); // 'A'
      //     if (!customers){
      //       var err = new Error(' No levels created.');
      //       //err.status = 401;
      //       return runner(err);
      //     } 
      //     else  return runner(null,customers)
      //   })
  }
// person schema for mongo 
var Levels = mongoose.model('levels', LevelSchema)

module.exports = Levels