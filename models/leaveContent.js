/**
 * Created by 毅 on 2016/8/28.
 */

var mongoose = require('mongoose');
var leaveContentSchema = require('../schemas/leaveContent');

module.exports = mongoose.model('leaveContents', leaveContentSchema);