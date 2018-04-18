/**
 * Created by liuqi on 2016/8/28.
 */

var express = require('express');
var router = express.Router();
var formidable=require('formidable'); // 上传功能的插件
var path=require('path');
var fs=require('fs');

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Comments = require('../models/Comments');
var Reply = require('../models/Reply');
var leaveContents = require('../models/leaveContent');
//验证是否为管理员
/*
router.use(function(req, res, next) {
    console.log(req.body);
    if (req.params.isAdmin || req.body.isAdmin) {
        next();
    } else {
    //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
});
*/
router.post('/admin/account/search', function(req, res, next) {
    User.find({},function(err,data){
        res.send(data);
    });
});

router.post('/admin/account/add', function(req, res, next) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var isAdmin = req.body.isAdmin;
    if (username == '' || password == '') {
        res.send(404);
        return;
    }
    User.findOne({ username: username },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else if (doc) {
            // incorrect username
            return res.send(500);
            console.log( '该管理员已存在');
        }else{
            User.create({                           // 创建一组user对象置入model
                username: username,
                password: password,
                isAdmin: isAdmin
            });
                res.send(200);
            }
        });
});

router.post('/admin/account/revise', function(req, res, next) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var isAdmin = req.body.isAdmin;
    if (username == '' || password == '') {
        res.send(404);
        return;
    }
    var whereData = {username:username}
    var updateDat = {$set: {password:password}}; //如果不用$set，替换整条数据
    User.update(whereData, updateDat, function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else{
            res.send(200);
        }
     });
});

router.post('/admin/account/delete', function(req, res, next) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var isAdmin = req.body.isAdmin;
    User.remove({ username: username },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(200);
        }
    });
});

router.get('/admin', function(req, res, next) {
    res.render('admin');
});

/*
* 分类的保存
* */
router.post('/admin/category/search', function(req, res, next) {
    Category.find({},function(err,data){
        res.send(data);
    });
});

router.post('/admin/category/add', function(req, res) {
    var name = req.body.name;
    if (name == '') {
        res.send(404);
        return;
    }
    Category.findOne({ name: name },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else if (doc) {
            // incorrect username
            return res.send(500);
            console.log( '分类已存在');
        }else{
            Category.create({                           // 创建一组user对象置入model
                name: name
            });
                res.send(200);
            }
        });
});

router.post('/admin/category/delete', function(req, res, next) {
    var name = req.body.name;
    var isAdmin = req.body.isAdmin;
    Category.remove({ name: name },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(200);
        }
    });
});

/*文章列表*/
router.get('/admin/content/search', function(req, res, next) {
    Content.find({},function(err,data){
        res.send(data);
    });
});

//评论列表
router.post('/admin/comments/search', function(req, res, next) {
    var id = req.body.id;
    Comments.find({id: id},function(err,data){
        res.send(data);
    });
});

router.post('/admin/comments/delete', function(req, res, next) {
    var username = req.body.username;
    var id = req.body.id;
    var like = req.body.like;
    var reject = req.body.reject;
    var content = req.body.content;
    var filePath = req.body.filePath;
    var num = req.body.num;
    //var isAdmin = req.body.isAdmin;
    Comments.remove({username, id, like, reject, content, filePath, num}, function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(200);
        }
    });
});

router.post('/admin/content/add', function(req, res) {
    var uploadDir = './static/content-images/';
    var form = new formidable.IncomingForm ();
    //文件的编码格式
    form.encoding = 'utf-8';
    //文件的上传路径
    form.uploadDir = uploadDir;
    //文件的后缀名
    form.extensions=true;
    //文件的大小限制
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {
        var name = fields.name || '';
        var title = fields.title || '';
        var author = fields.author || '';
        var views = fields.views || '';
        var abstract = fields.abstract || '';
        var content = fields.content || '';
        var id = fields.id || '';
        var time = fields.time || '';
        console.log(id)
        if (!files.photo) {
                var oldpath = path.normalize('./static/images/content-defalut.jpg');
                // file.path = './../../static/defalut-user-login.png';
                var newfilename = title + 'content-defalut.jpg';
            } else {
                var file = files.photo;
                console.log(file);
                var oldpath = path.normalize(file.path); // 返回正确格式的路径
                var newfilename = title + file.name;
            }
            var newpath = uploadDir + newfilename;
        if (name == '' || title == '' || author == '' || views == '' || abstract == '' || content == '') {
            res.sendStatus(404);
            return;
        }
        Content.findOne({ name: name, addTime: time, title: title, author: author, views: views, abstract: abstract, content: content, filePath: newpath, id: id },function(err, doc){
            if (err) {
                // user not found
                return res.sendStatus(401);
            }else if (doc) {
                // incorrect username
                return res.sendStatus(500);
                console.log( '文章已存在');
            }else{
                fs.rename(oldpath,newpath, function(err) {
                    if(err){
                        res.send(401);
                        console.error("文章修改失败"+err);
                    } else {
                        Content.create({                           // 创建一组user对象置入model
                            name: name,
                            title: title,
                            author: author,
                            abstract: abstract,
                            content: content,
                            filePath: newpath,
                            id: id
                        });
                        res.sendStatus(200);
                    }
                });
            }
        });
    });
});

router.post('/admin/content/delete', function(req, res, next) {
    var name = req.body.name;
    var title = req.body.title;
    var author = req.body.author;
    var views = req.body.views;
    var abstract = req.body.abstract;
    var content = req.body.content;
    var addTime = req.body.addTime;
    var id = req.body.id;
    console.log(addTime);
    //var isAdmin = req.body.isAdmin;
    Content.remove({addTime},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(200);
        }
    });
});

/*
* 文章的修改保存
* */
router.post('/admin/content/revise', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    var uploadDir = './static/content-images/';
    var form = new formidable.IncomingForm ();
    //文件的编码格式
    form.encoding = 'utf-8';
    //文件的上传路径
    form.uploadDir = uploadDir;
    //文件的后缀名
    form.extensions=true;
    //文件的大小限制
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function (err, fields, files) {
        var name = fields.name;
        var title = fields.title;
        var author = fields.author;
        var views = fields.views;
        var abstract = fields.abstract;
        var content = fields.content;
        var addTime = fields.addTime;
        var id = fields.id;
        console.log(id)
        if (!files.photo) {
                var oldpath = path.normalize('./static/images/content-defalut.jpg');
                // file.path = './../../static/defalut-user-login.png';
                var newfilename = title + 'content-defalut.jpg';
            } else {
                var file = files.photo;
                var oldpath = path.normalize(file.path); // 返回正确格式的路径
                var newfilename = title + file.name;
            }
            var newpath = uploadDir + newfilename;
        if (name == '' || title == '' || author == '' || views == '' || abstract == '' || content == '') {
            res.sendStatus(404);
            return;
        }
        //获取要修改的文章信息
        Content.findOne({
            title: title,
            id: id
        }).then(function(content) {
            if (!content) {
                res.send('没有找到相关文章');
            }
        }).then(function(sameContent) {
            if (sameContent) {
                res.send("数据库里面已经有相同的文章了")
            } else {
                fs.rename(oldpath,newpath, function(err) {
                    if(err){
                        console.error("文章修改失败"+err);
                        res.send(401);
                    } else {
                        Content.update({ 
                            title: title,
                            id: id
                        }, {
                            name: name,
                            addTime: addTime,
                            views: views,
                            abstract: abstract,
                            content: content,
                            author: author,
                            filePath: newpath
                        }).then(function() {
                            res.send(200);
                        })
                    }
                });
            }
        });
    });
});

//获取留言板
router.get('/admin/message/search', function(req, res, next) {
    leaveContents.find({},function(err,data){
        res.send(data);
    });
});

//删除留言
router.post('/admin/message/delete', function(req, res, next) {
    var index = req.body.index;
    leaveContents.remove({index},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(200);
        }
    });
});

//
router.post('/admin/message/reply/delete', function(req, res, next) {
    var index = req.body.index;
    var index1 = req.body.index1;
    var replyTime = req.body.replyTime;
    var replyContent = req.body.replyContent;
    leaveContents.update({index: index}, {'$pull':{'reply':{
                replyTime: replyTime, replyContent: replyContent}}} ,function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else{
            res.send(200);
        }
    });
});

module.exports = router;
