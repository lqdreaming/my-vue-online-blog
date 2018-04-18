/**
 * Created by 毅 on 2016/8/28.
 */

var mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({
    //评论人用户名
    commentUserName: String,
    //回复人人姓名
    replyUserName: String,
    //回复时间
    replyTime: {
        type: Date,
        default: new Date()
    },
    //对应文章id
    id: Number,
    //回复举报
    informBad: {
        type: Number,
        default: 0
    },
    //回复index
    replyIndex: {
        type: Number
    },

    //回复内容
    replyContent: {
        type: String
    },
    //回复人头像路径
    replyUserPath:{type:'string'},
    //评论人头像路径
    commentfilePath:{type:'string'}
});
