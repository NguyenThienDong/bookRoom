var User = require('../models/DB_users');
var moment = require('moment');
var Users = User.Users;
var Room = require('../models/DB_room');
var FeedBack = require('../models/DB_feedback');
var Bill = require('../models/DB_bill');
var bcrypt = require('bcryptjs');
var config = require('../../config/utils');
var name = '';
var login = `<li><a href="login">Đăng nhập</a></li>`;
var logout = `<li class="has-children" ><a href="#"></a><ul class="dropdown arrow-botton"> <li><a href="/dsphongdat">DS phòng đã đặt</a></li><li><a href="rooms">cài đặt</a></li><li><a href="logoutpagemain">đăng xuất</a></li></ul></li>`;
module.exports = {
    home: (req, res) => {
        if (req.session.user) {
            res.render('index', { auth: logout, name: req.session.name });
        } else {
            res.render('index', { auth: login });
        }

    },
    rooms: (req, res) => {
        if (req.session.user) {
            res.render('rooms', { auth: logout, name: req.session.name });
        } else {
            res.render('rooms', { auth: login });
        }
    },
    setRoom: (req, res) => {
        if (req.session.user) {
            let id = req.params.id;
            Room.getRoomById(id)
                .then(rs => {
                    res.render('datphong', { auth: logout, name: req.session.name, room: rs });
                })
                .catch(err => {
                    res.redirect('/index');
                })

        } else {
            res.redirect('/login')
        }
    },
    setRoomPost: async (req, res) => {
        let id_user = req.session.idUser;
        let id_room = req.params.id;
        let roomselected = await Room.getRoomById(id_room);
        let datestart = req.body.time_start.split('-');
        let datefinish = req.body.time_finish.split('-');
        let time_start = new Date(datestart[0], datestart[1] - 1, datestart[2]);
        let time_finish = new Date(datefinish[0], datefinish[1] - 1, datefinish[2]);
        let timeStampStart = time_start.getTime();
        let timeStampFinish = time_finish.getTime();
        let bill = {
            id_user,
            id_room,
            name_KH: req.body.name_KH,
            phonenumber: req.body.phonenumber,
            CMTND: req.body.CMTND,
            totalprice: roomselected.price,
            time_start: timeStampStart,
            time_finish: timeStampFinish
        }
        Bill.Bills.create({
            id_user,
            id_room,
            name_KH: bill.name_KH,
            phonenumber: bill.phonenumber,
            CMTND: bill.CMTND,
            totalprice: bill.totalprice,
            time_start: bill.time_start,
            time_finish: bill.time_finish,
            created_at: new Date().getTime()
        },async (err, rs) => {
            if (rs) {
                let changeStatus = await Room.setStatusFalse(id_room);
                if(changeStatus)
                res.render("datphong", { auth: logout, room: roomselected, name: req.session.name, msg: 'đặt phòng thành công' });
                
            }else res.render('datphong', { auth: logout, room: roomselected, name: req.session.name, msg: 'đã xảy ra lỗi' })
        })

    },
    about: (req, res) => {
        if (req.session.user) {
            res.render('about', { auth: logout, name: req.session.name });
        } else {
            res.render('about', { auth: login });
        }
    },
    contact: (req, res) => {
        if (req.session.user) {
            res.render('contact', { auth: logout, name: req.session.name });
        } else {
            res.render('contact', { auth: login });
        }
    },
    roomVip: (req, res) => {
        if (req.session.user) {
            res.render('phongcaocap', { auth: logout, name: req.session.name });
        } else {
            res.render('phongcaocap', { auth: login });
        }
    },
    event: (req, res) => {
        if (req.session.user) {
            res.render('events', { auth: logout, name: req.session.name });
        } else {
            res.render('events', { auth: login });
        }
    },
    getLogin: (req, res) => {
        if (req.session.user) {
            res.render('index', { auth: logout, name: req.session.name });
        } else
            res.render('dangnhap', { auth: login })
    },
    postLogin: (req, res) => {
        let { email, password} = req.body
        User.getOneUserByEmail(email, (err, rs) => {
            if (rs) {
                bcrypt.compare(password, rs.password, (err, success) => {
                    if (success) {
                        req.session.user = rs.email;
                        req.session.name = rs.fullname;
                        req.session.idUser = rs._id;
                        res.redirect('/index');
                    } else {
                        req.session.user = undefined;
                        res.render('dangnhap', { msg: 'email hoặc mật khẩu không đúng', auth: login })
                    }
                })
            } else {
                req.session.user = undefined;
                res.render('dangnhap', { msg: 'email hoặc mật khẩu không đúng', auth: login })
            }
        })
    },
    service: (req, res) => {
        if (req.session.user) {
            res.render('dichvu', { auth: logout, name: req.session.name });
        } else {
            res.render('dichvu', { auth: login });
        }
    },
    deleteRoomSelected: (req, res) => {
        let idbill = req.params.id;
        Bill.deleteBillById(idbill)
            .then(rs => {
                res.redirect("/dsphongdat");
            })
            .catch(err => {
                res.redirect("/dsphongdat");
            })
    },
    listRoomSelected: (req, res) => {
        if (req.session.user) {
            res.render('dsphongdat', { auth: logout, name: req.session.name });
        } else {
            res.redirect('/register');
        }
    },
    logOut: (req, res) => {
        req.session.user = undefined;
        res.redirect('/login');
    },
    getRegister: (req, res) => {
        if (req.session.user) {
            res.render('dangky', { auth: logout, name: req.session.name });
        } else {
            res.render('dangky', { auth: login });
        }
    },
    postRegister: (req, res) => {
        if (req.session.user) {
            let user = { fullname, phonenumber, email, password, confirmpassword } = req.body;
            User.createUser(user)
                .then(rs => {
                    res.render('dangky', { msg: rs, auth: logout, name: req.session.name });
                })
                .catch(err => {
                    res.render('dangky', { msg: err, auth: logout, name: req.session.name });
                })
        } else {
            let user = { fullname, phonenumber, email, password, confirmpassword } = req.body;
            User.createUser(user)
                .then(rs => {
                    res.render('dangky', { msg: rs, auth: login });
                })
                .catch(err => {
                    res.render('dangky', { msg: err, auth: login });
                })
        }

    },
    doubleRoom: (req, res) => {
        if (req.session.user) {
            res.render('phongdoi', { auth: logout, name: req.session.name });
        } else {
            res.render('phongdoi', { auth: login });
        }
    },
    singleRoom: (req, res) => {
        if (req.session.user) {
            res.render('phongdon', { auth: logout, name: req.session.name });
        } else {
            res.render('phongdon', { auth: login });
        }
    },
    //=================API===============
    getUser:(req,res)=>{
        User.getAllUser()
            .then(rs=>{
                let dateTime = [];
                let n = rs.length;
                for (let index = 0; index < n; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    status:200,
                    data:rs,
                    date:dateTime
                })
            })
            .catch(err=>{
                req.json({
                    status:404,
                    msg:'not found'
                })
            })
    },
    sendFeedBack: (req, res) => {
        if (req.session.user) {
            let id_room = req.params.id_room;
            let id_user = req.session.idUser;
            let content = req.body.content;
            FeedBack.createFeedBack(id_room, id_user, content)
                .then(rs => {
                    if (rs == 404) {
                        res.json({
                            status: 404,
                            msg: 'Vui lòng nhập feedback'
                        })
                    } else {
                        res.json({
                            status: 200,
                            msg: 'create feed back success'
                        })
                    }

                })
                .catch(err => {
                    res.json({
                        status: 409,
                        msg: 'create feed back fail'
                    })
                })
        } else {
            res.redirect('/login');
        }
    },
    getSelectedRoom:(req,res)=>{
        Room.selectedRoom()
            .then(rs=>{
                res.json({
                    status:200,
                    data:rs
                })
            })
            .catch(err=>{
                res.json({
                    status:404,
                    msg:err
                })
            })
    },
    getEmptyRoom:(req,res)=>{
        Room.emptyRoom()
            .then(rs=>{
                res.json({
                    status:200,
                    data:rs
                })
            })
            .catch(err=>{
                res.json({
                    status:404,
                    msg:err
                })
            })
    },
    getBill:(req,res)=>{
        Bill.getBill()
            .then(rs=>{
                let dateTime = [];
                for (let index = 0; index < rs.length; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    status: 200,
                    listRoomSelected: rs,
                    date: dateTime
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    err
                })
            })
    },
    getRoomSelected: (req, res) => {
        Bill.getBillByIdUser(req.session.idUser)
            .then(async rs => {
                let dateTime = [];
                for (let index = 0; index < rs.length; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    status: 200,
                    listRoomSelected: rs,
                    date: dateTime
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    err
                })
            })
    },
    getVipRoom: (req, res) => {
        Room.getVipRoom()
            .then(async rs => {
                let dateTime = [];
                let n = rs.length;
                for (let index = 0; index < n; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    data: rs,
                    date: dateTime,
                    status: 200
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    err
                })
            })
    },
    getDoubleRoom: (req, res) => {
        Room.getDoubleRoom()
            .then(async rs => {
                let dateTime = [];
                let n = rs.length;
                for (let index = 0; index < n; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    data: rs,
                    date: dateTime,
                    status: 200
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    err
                })
            })
    },
    getSingleRoom: (req, res) => {
        Room.getSingleRoom()
            .then(async rs => {
                let dateTime = [];
                let n = rs.length;
                for (let index = 0; index < n; index++) {
                    dateTime.push(moment.unix(rs[index].created_at / 1000).format('hh:mm:ss A DD/MM/YYYY '));
                }
                res.json({
                    data: rs,
                    date: dateTime,
                    status: 200
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    err
                })
            })
    },
    createRoom: (req, res) => {
        let room = req.body;
        Room.createRoom(room)
            .then(rs => {
                res.json({
                    status: 200,
                    data: rs,
                    msg: 'create room success'
                })
            })
            .catch(err => {
                res.json({
                    status: 409,
                    err
                })
            })
    },
    checkEmail: (req, res) => {
        let email = req.body.email;
        User.getUserByEmail(email)
            .then(rs => {
                res.json({
                    status: 200,
                    msg: rs
                })
            })
            .catch(err => {
                res.json({
                    status: 404,
                    msg: err
                })
            })
    }
}