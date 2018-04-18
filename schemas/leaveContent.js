/**
 * Created by 毅 on 2016/8/28.
 */

var mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({

    //关联字段 - 内容分类的id
    /* name: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },*/
    username: String,
    //内容标题
    time: {
        type: String
    },
    index: Number,
    likeName: {
        type: Array,
        default: []
    },
    rejectName: {
        type: Array,
        default: []
    },
    //举报
    informBad: {
        type: Array,
        default: []
    },
    //内容
    content: {
        type: String,
        default: ''
    },
    //评论
    reply: {
        type: Array,
        default: []
    },
    
    filePath:{type:'string'}
});
