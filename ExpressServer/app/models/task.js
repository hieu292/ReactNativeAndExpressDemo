var mongoose = require('mongoose');
var config = require('../../config');

var Schema = mongoose.Schema;


var taskSchema = new Schema({
    nameTask: {type: String,required: true}
});


module.exports = mongoose.model('Task', taskSchema);
