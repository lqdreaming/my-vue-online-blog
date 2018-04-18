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
router.post('/headerTitle', (req, res) => {
    username = req.body.username;
    password = req.body.password;
    // isAdmin = req.body.isAdmin;
    User.findOne({ username: username, password: password},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else if (doc) {
            if (doc.isAdmin){
                console.log('管理员登陆成功');
                res.send(doc);
            } else{
                console.log('用户登陆成功');
                res.send(doc);
            }
        } else {
            console.log('用户名或密码错误');
            res.send(404)
        }
    });
});

//查询访客
router.get('/headerTitle/user', (req, res) => {
    isAdmin = false;
    User.find({ isAdmin: isAdmin},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else{
            res.send(doc);
        }
    });
});

router.get('/headerTitle', (req, res) => {
    Content.find({},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else{
            res.send(doc);
        }
    });
});

//获取前端学习的文章
router.post('/headerTitle/webstudy', (req, res) => {
    var name = req.body.formData
    if (name == '前端学习') {
        Content.find({ $or : [ //多条件，数组
                {name: 'html+CSS' },
                {name:'JavaScript'},
                {name: '图像处理'},
                {name: '其它'},
                {name: '前端学习'}
            ]},function(err, doc){
            if (err) {
                // user not found
                return res.send(401);
            } else {
                res.send(doc);
            }
        });
    } else {
        Content.find({name: name},function(err, doc){
            if (err) {
                // user not found
                return res.send(401);
            } else{
                res.send(doc);
            }
        });
    }
});

router.post('/headerTitle/register', (req, res) => {
    var uploadDir = './static/images/';
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
    //fields上传的string类型的信息
    //files为上传的文件
        var username = fields.username;
        var password = fields.password;
        console.log(files.photo);
        if (!files.photo) {
            files.photo = [{path: 'static\\images\\defalut-user-login.png',name: 'defalut-user-login.png'},
            {path: 'static\\images\\leaveMessage.jpg',name: 'leaveMessage.jpg'},
            {path: 'static\\images\\那人，那事.jpg',name: '那人，那事.jpg'},
            {path: 'static\\images\\心灵旅途.jpg',name: '心灵旅途.jpg'},
            {path: 'static\\images\\defalut-user-login.png',name: 'defalut-user-login.png'},
            {path: 'static\\images\\leaveMessage.jpg',name: 'leaveMessage.jpg'},
            {path: 'static\\images\\那人，那事.jpg',name: '那人，那事.jpg'},
            {path: 'static\\images\\心灵旅途.jpg',name: '心灵旅途.jpg'},
            {path: 'static\\images\\leaveMessage.jpg',name: 'leaveMessage.jpg'},
            {path: 'static\\images\\心灵旅途.jpg',name: '心灵旅途.jpg'}];
            var i =  Math.floor(Math.random()*10);
        	var oldpath = path.normalize(files.photo[i].path);
        	// file.path = './../../static/defalut-user-login.png';
        	var newfilename = files.photo[i].name;
        } else {
	        var file = files.photo;
	        var oldpath = path.normalize(file.path); // 返回正确格式的路径
	        var newfilename = username + file.name;
    	}
        var newpath = uploadDir + newfilename;
        User.findOne({ username: username },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else if (doc) {
            // incorrect username
            return res.send(500);
        }else{
            //将老的图片路径改为新的图片路径
            fs.rename(oldpath,newpath, function(err) {
                if(err){
                    console.error("注册失败"+err);
                } else {
                    User.create({                           // 创建一组user对象置入model
                        username: username,
                        password: password,
                        filePath: newpath,
                        isAdmin: false
                    });
                    res.send(200);
                }
            });
            }
        });
    })
});

//搜索提示
router.post('/headerTitle/pageContent/input', (req, res) => {
    input1 = req.body.input1;
    Content.find({ $or : [ //多条件，数组
            {title: {$regex: input1, $options:'i' }},
            {content: {$regex: input1, $options:'i'}},
            {abstract: {$regex: input1, $options:'i'}},
            {author: {$regex: input1, $options:'i'}}
        ]},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

//搜索
router.post('/headerTitle/pageContent/search', (req, res) => {
    input1 = req.body.formData1;
    Content.find({ $or : [ //多条件，数组
            {title: {$regex: input1, $options:'i' }},
            {content: {$regex: input1, $options:'i'}},
            {abstract: {$regex: input1, $options:'i'}},
            {author: {$regex: input1, $options:'i'}}
        ]},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

//相关文章
router.post('/headerTitle/pageContent/name', (req, res) => {
    name = req.body.pageName;
    // isAdmin = req.body.isAdmin;
    Content.find({ name: name },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

//作者的文章
router.post('/headerTitle/pageContent/author', (req, res) => {
    author = req.body.author;
    views = req.body.views;
    // isAdmin = req.body.isAdmin;
    Content.find({ author: author },function(err, doc){
        var whereData = {id: id};
        var updateDat = {$set: {views:views}}; //如果不用$set，替换整条数据
        if (err) {
            // user not found
            return res.send(401);
        } else {
            Content.update(whereData, updateDat, function(err){
                if (err) {
                // user not found
                    return res.send(401);
                }
            });
            res.send(doc);
        }
    });
});

//该id的文章
router.post('/headerTitle/pageContent/id', (req, res) => {
    id = req.body.formData;
    // isAdmin = req.body.isAdmin;
    Content.find({ id: id },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

//最近的文章
router.get('/headerTitle/pageContent', (req, res) => {
    // isAdmin = req.body.isAdmin;
    Content.find({},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

//获取评论-热门
router.get('/headerTitle/pageContent/comments', function(req, res) {
    //获取评论信息
    Comments.find({},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

router.post('/headerTitle/pageContent/comments', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    username = req.body.commentData.username;
    time = req.body.commentData.time;
    content = req.body.commentData.content;
    reply = req.body.commentData.reply;
    id = req.body.commentData.id1;
    num = req.body.commentData.num;
    filePath = req.body.commentData.filePath;
    //获取要修改的文章信息
    Comments.find({
        id: id
    }).then(function(comments) {
        if (comments) {
            Comments.create({
                id: id,
                username: username,
                num: num,
                time: time,
                content: content,
                filePath: filePath,
                reply: reply
            }).then(function() {
                res.send(200);
            })
        } else {
            res.send('该文章不存在');
        }
    });
});

//文章点赞功能
router.post('/headerTitle/pageContent/comments/approval', function(req, res) {
    //获取要修改的评论的信息，并且用表单的形式展现出来
    var comment = req.body.commentsData.itemData;
    var approveName = req.body.commentsData.approveName;
    Comments.findOne({
        id: comment.id,
        num: comment.num
    }).then(function(comments) {
        if (comments) {
            var LikeName = comments.likeName;
            if (LikeName.indexOf(approveName) !=-1) {
                Comments.update({id: comment.id, num: comment.num}, {'$pull':{'likeName':approveName}} ,function(err, doc){
                    if (err) {
                        return res.send(401);
                    }else{
                        res.send('取消点赞成功');
                    }
                });
                } else {
                    Comments.update({id: comment.id, num: comment.num}, {'$push':{'likeName':approveName}} ,function(err, doc){
                        if (err) {
                            return res.send(401);
                        }else{
                            res.send('点赞成功');
                        }
                    });
                }
        } else {
            res.send('点赞失败');
        }
    });
});


router.post('/headerTitle/leaveMessage/reply/approve', function(req, res) {
    var index = req.body.messageData.itemData.index;
    var approveName = req.body.messageData.approveName;
    //获取要回复的留言信息
    leaveContents.findOne({
        index: index
    }).then(function(leavecontents) {
        if (leavecontents) {
            var LikeName = leavecontents.likeName;
            if (LikeName.indexOf(approveName) !=-1) {
                leaveContents.update({index:index}, {'$pull':{'likeName':approveName}} ,function(err, doc){
                    if (err) {
                        return res.send(401);
                    }else{
                        res.send('取消点赞成功');
                    }
                });
                } else {
                    leaveContents.update({index:index}, {'$push':{'likeName':approveName}} ,function(err, doc){
                        if (err) {
                            return res.send(401);
                        }else{
                            res.send('点赞成功');
                        }
                    });
                }
        } else {
            res.send('点赞失败');
        }
    });
});

//文章点拒功能
router.post('/headerTitle/pageContent/comments/reject', function(req, res) {
    //获取要修改的评论的信息，并且用表单的形式展现出来
    var comment = req.body.commentsData.itemData;
    var rejectName1 = req.body.commentsData.rejectName;
    Comments.findOne({
        id: comment.id,
        num: comment.num
    }).then(function(comments) {
        if (comments) {
            var rejectName = comments.rejectName;
            if (rejectName.indexOf(rejectName1) !=-1) {
                Comments.update({id: comment.id, num: comment.num}, {'$pull':{'rejectName':rejectName1}} ,function(err, doc){
                    if (err) {
                        return res.send(401);
                    }else{
                        res.send('取消点拒成功');
                    }
                });
                } else {
                    Comments.update({id: comment.id, num: comment.num}, {'$push':{'rejectName':rejectName1}} ,function(err, doc){
                        if (err) {
                            return res.send(401);
                        }else{
                            res.send('点拒成功');
                        }
                    });
                }
        } else {
            res.send('点拒失败');
        }
    });
});

router.post('/headerTitle/pageContent/comments/reject', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    comment = req.body.comments;
    //获取要修改的文章信息
    var whereData = {id:comment.id, num: comment.num}
    var updateDat = {$set: {reject: comment.reject}}; //如果不用$set，替换整条数据
    Comments.update({id:comment.id, num: comment.num}, {$set: {reject: comment.reject}}, function(err, doc){
        Comments.update({id:comment.id, num: comment.num}, {'$push':{'rejectName':{
                    username: comment.name}}} ,function(err, doc){
            if (err) {
                // user not found
                return res.send(401);
            }else{
                res.send(200);
            }
        });
    });
});

router.post('/headerTitle/pageContent/comments/inform', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    comment = req.body.comments;
    //获取要修改的文章信息
    var whereData = {id:comment.id, num: comment.num}
    var updateDat = {$set: {reject: comment.reject}}; //如果不用$set，替换整条数据
    Comments.update({id:comment.id, num: comment.num}, {'$push':{'informBad':{
                informInf: comment.informInf}}} ,function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else{
            res.send(200);
        }
    });
});

router.post('/headerTitle/pageContent/comments/id', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    id = req.body.formData;
    // isAdmin = req.body.isAdmin;
    Comments.find({ id: id },function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

router.post('/headerTitle/pageContent/reply', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    replyContent = req.body.replyData.commentContent;
    commentUserName = req.body.replyData.commentUserName;
    commentfilePath = req.body.replyData.commentfilePath;
    id = req.body.replyData.id;
    replyIndex = req.body.replyData.replyIndex;
    replyUserName = req.body.replyData.replyUserName;
    replyUserPath = req.body.replyData.replyUserPath;
    replyTime = req.body.replyData.replyTime;
    //获取要修改的文章信息
    Reply.find({
        id: id,
        replyIndex: replyIndex,
        replyContent: replyContent,
        commentUserName: commentUserName,
        replyUserName: replyUserName
    }).then(function(reply) {
        if (reply=='') {
            Reply.create({
                id: id,
                commentUserName: commentUserName,
                commentfilePath: commentfilePath,
                replyUserName: replyUserName,
                replyIndex: replyIndex,
                replyContent: replyContent,
                replyUserPath: replyUserPath,
                replyTime: replyTime
            }).then(function() {
                res.send(200);
            })
        } else {
            res.send('该评论已经存在');
        }
    });
});

router.post('/headerTitle/pageContent/reply/replyformData', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    id = req.body.replyformData.id;
    replyIndex = req.body.replyformData.replyIndex;
    // isAdmin = req.body.isAdmin;
    Reply.find({ id: id,  replyIndex: replyIndex},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc);
        }
    });
});

router.post('/headerTitle/pageContent1/reply/replyformData', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    id = req.body.replyformData.id;
    replyIndex = req.body.replyformData.replyIndex;
    // isAdmin = req.body.isAdmin;
    Comments.find({ id: id},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else {
            res.send(doc[replyIndex]);
        }
    });
});

router.post('/headerTitle/pageContent1/reply', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    replyContent = req.body.replyData.commentContent;
    commentUserName = req.body.replyData.commentUserName;
    commentfilePath = req.body.replyData.commentfilePath;
    id = req.body.replyData.id;
    replyIndex = req.body.replyData.replyIndex;
    replyUserName = req.body.replyData.replyUserName;
    replyUserPath = req.body.replyData.replyUserPath;
    replynum = req.body.replyData.num;
    replyTime = req.body.replyData.replyTime;
    //获取要修改的文章信息
    Comments.find({
        id: id,
        num: replynum
    }).then(function(comments) {
        console.log(comments);
        if (comments) {
            Comments.update({id: id, num: replynum}, {'$push':{'reply':{
                    id: id,
                    commentUserName: commentUserName,
                    commentfilePath: commentfilePath,
                    replyUserName: replyUserName,
                    replyIndex: replyIndex,
                    replyContent: replyContent,
                    replyTime: replyTime,
                    replyUserPath: replyUserPath,
                    num: replynum}},
            }).then(function() {
                res.send(200);
            })
            /*
            comments[replyIndex].reply.push({
                id: id,
                commentUserName: commentUserName,
                commentfilePath: commentfilePath,
                replyUserName: replyUserName,
                replyIndex: replyIndex,
                replyContent: replyContent,
                replyUserPath: replyUserPath
            }).then(function() {
                res.send(200);
            })
            */
        } else {
            res.send('该评论不存在');
        }
    });
});

//获取留言
router.get('/headerTitle/leaveMessage', (req, res) => {
    leaveContents.find({},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        } else{
            res.send(doc);
        }
    });
});

//提交留言
router.post('/headerTitle/leaveMessage', (req, res) => {
    username = req.body.messageData.username;
    time = req.body.messageData.time;
    content = req.body.messageData.content;
    reply = req.body.messageData.reply;
    index = req.body.messageData.index;
    filePath = req.body.messageData.filePath;
    leaveContents.find({
        index: index
    }).then(function(doc) {
        console.log(doc);
        if (doc == '') {
            leaveContents.create({
                index: index,
                username: username,
                time: time,
                content: content,
                filePath: filePath,
                reply: reply
            }).then(function() {
                res.send(200);
            })
        } else {
            res.send(404);
        }
    });
});

//回复留言
router.post('/headerTitle/leaveMessage/reply', function(req, res) {
    replyContent = req.body.replyData.commentContent;
    commentUserName = req.body.replyData.commentUserName;
    commentfilePath = req.body.replyData.commentfilePath;
    index = req.body.replyData.replyIndex;
    replyUserName = req.body.replyData.replyUserName;
    replyUserPath = req.body.replyData.replyUserPath;
    replyTime = req.body.replyData.replyTime;
    //获取要回复的留言信息
    leaveContents.findOne({
        index: index
    }).then(function(doc) {
        if (doc) {
            leaveContents.update({index: index}, {'$push':{'reply':{
                    commentUserName: commentUserName,
                    commentfilePath: commentfilePath,
                    replyUserName: replyUserName,
                    replyContent: replyContent,
                    replyTime: replyTime,
                    replyUserPath: replyUserPath,
                    index: index}},
            }).then(function() {
                res.send(200);
            })
        } else {
            res.send('回复留言失败');
        }
    });
});

//留言点赞功能
router.post('/headerTitle/leaveMessage/reply/approve', function(req, res) {
    var index = req.body.messageData.itemData.index;
    var approveName = req.body.messageData.approveName;
    //获取要回复的留言信息
    leaveContents.findOne({
        index: index
    }).then(function(leavecontents) {
        if (leavecontents) {
            var LikeName = leavecontents.likeName;
            console.log(LikeName);
            if (LikeName.indexOf(approveName) !=-1) {
                leaveContents.update({index:index}, {'$pull':{'likeName':approveName}} ,function(err, doc){
                    if (err) {
                        return res.send(401);
                    }else{
                        res.send('取消点赞成功');
                    }
                });
                } else {
                    leaveContents.update({index:index}, {'$push':{'likeName':approveName}} ,function(err, doc){
                        if (err) {
                            return res.send(401);
                        }else{
                            res.send('点赞成功');
                        }
                    });
                }
        } else {
            res.send('点赞失败');
        }
    });
});

//留言点拒功能
router.post('/headerTitle/leaveMessage/reply/reject', function(req, res) {
    var index = req.body.messageData.itemData.index;
    var refuseName = req.body.messageData.refuseName;
    //获取要回复的留言信息
    leaveContents.findOne({
        index: index
    }).then(function(leavecontents) {
        if (leavecontents) {
            var rejectName = leavecontents.rejectName;
            if (rejectName.indexOf(refuseName) !=-1) {
                leaveContents.update({index:index}, {'$pull':{'rejectName':refuseName}} ,function(err, doc){
                    if (err) {
                        return res.send(401);
                    }else{
                        res.send('取消点拒成功');
                    }
                });
                } else {
                    leaveContents.update({index:index}, {'$push':{'rejectName':refuseName}} ,function(err, doc){
                        if (err) {
                            return res.send(401);
                        }else{
                            res.send('点拒成功');
                        }
                    });
                }
        } else {
            res.send('点拒失败');
        }
    });
});

//留言举报
router.post('/headerTitle/leaveMessage/reply/inform', function(req, res) {
    //获取要修改的文章的信息，并且用表单的形式展现出来
    informData = req.body.informData;
    //获取要修改的文章信息
    leaveContents.update({index: informData.index}, {'$push':{'informBad':{
                informInf: informData.informInf}}},function(err, doc){
        if (err) {
            // user not found
            return res.send(401);
        }else{
            res.send(200);
        }
    });
});

module.exports = router;
