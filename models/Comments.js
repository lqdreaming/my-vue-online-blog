/**
 * Created by 毅 on 2016/8/28.
 */

var mongoose = require('mongoose');
var commentsSchema = require('../schemas/comments');

module.exports = mongoose.model('Comments', commentsSchema);