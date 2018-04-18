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
    //关联字段 - 用户id
    /* author: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        //ref: 'User'
    },*/
    id: Number,
    num: Number,
    //简介
    like: {
        type: Number,
        default: 0
    },
    likeName: {
        type: Array,
        default: []
    },
    rejectName: {
        type: Array,
        default: []
    },
    reject: {
        type: Number,
        default: 0
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
        /*
        //评论人用户名
        commentUserName: {
            type: String,
            default: ''
        },
        //回复人人姓名
        replyUserName: {
            type: String,
            default: ''
        },
        //回复时间
        replyTime: {
            type: Date,
            default: new Date()
        },
        //对应文章id
        id: {
            type: Number,
            default: ''
        },
        //回复举报
        informBad: {
            type: Number,
            default: 0
        },
        //回复index
        replyIndex: {
            type: Number,
            default: ''
        },

        //回复内容
        replyContent: {
            type: String,
            default: ''
        },
        //回复人头像路径
        replyUserPath:{
            type: String,
            default: ''
        },
        //评论人头像路径
        commentfilePath:{
            type: String,
            default: ''
        },
        */
        type: Array,
        default: []
    },
    
    filePath:{type:'string'}
});
