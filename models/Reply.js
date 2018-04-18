/**
 * Created by 琦 on 2016/8/28.
 */

var mongoose = require('mongoose');
var replySchema = require('../schemas/reply');

module.exports = mongoose.model('Reply', replySchema);