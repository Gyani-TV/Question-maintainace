var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim:true,
    required: true
  },
  lastName: {
    type: String,
    trim:true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    unique: true,
    required: [true, 'Why no contact number'],
    trim: true
  },
  group: {
    type: String,
    enum: ['entry', 'admin','examiner'],   // the database can have only these three roles validated by RBAC
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Number,
    default: Date.now()
  }
});

//authenticate input against database
EmployeeSchema.statics.authenticate = function (email, password, callback) {
  Employee.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        //err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
EmployeeSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;

