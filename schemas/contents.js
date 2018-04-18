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
    name: String,
    //内容标题
    title: String,

    //关联字段 - 用户id
    /* author: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        //ref: 'User'
    },*/
    author: String,
    //添加时间
    addTime: {
        type: String
    },

    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //文章序号-id
    id: Number,
    //简介
    abstract: {
        type: String,
        default: ''
    },

    //内容
    content: {
        type: String,
        default: ''
    },

    //评论
    comments: {
        type: Array,
        default: []
    },
    
    filePath:{type:'string'}
});
