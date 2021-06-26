module.exports = function (io, passport, LocalStrategy) {
    var express = require('express');
    var router = express.Router();
    var config = require('../../config/utils');
    var bcrypt = require('bcryptjs');
    var User = require('../models/DB_users');
    var khachsanController = require('../controllers/khachsan');
    var adminController = require('../controllers/admin');
    //============Index==============
    router.route('/')
        .get(khachsanController.home)
    router.route('/index')
        .get(khachsanController.home)
    router.route('/rooms')
        .get(khachsanController.rooms)
    router.route('/datphong/:id')
        .get(khachsanController.setRoom)
        .post(khachsanController.setRoomPost)
    router.route('/about')
        .get(khachsanController.about)
    router.route('/contact')
        .get(khachsanController.contact)
    router.route('/phongcaocap')
        .get(khachsanController.roomVip)
    router.route('/events')
        .get(khachsanController.event)
    router.route('/register')
        .get(khachsanController.getRegister)
        .post(khachsanController.postRegister)
    router.route('/phongdoi')
        .get(khachsanController.doubleRoom)
    router.route('/phongdon')
        .get(khachsanController.singleRoom)
    router.route('/login')
        .get(khachsanController.getLogin)
        .post(khachsanController.postLogin)
    router.route('/logoutpagemain')
        .get(khachsanController.logOut)
    router.route('/dsphongdat')
        .get(khachsanController.listRoomSelected)
    router.route('/deletebill/:id')
        .get(khachsanController.deleteRoomSelected)
    router.route('/service')
        .get(khachsanController.service)

    //==============API===============
    router.route('/checkemail') //check email
        .post(khachsanController.checkEmail)
    router.route('/getUser')
        .get(khachsanController.getUser)// lấy ds tài khoản
    router.post('/createroom', khachsanController.createRoom) // tạo phòng
    router.route('/getsingleroom') // lấy ds phòng đơn
        .get(khachsanController.getSingleRoom)
    router.route('/getdoubleroom') // lấy ds phòng đôi
        .get(khachsanController.getDoubleRoom)
    router.route('/getviproom') // lấy ds phòng vip
        .get(khachsanController.getVipRoom)
    router.route('/getroomselected') // lấy ds phòng đã đặt
        .get(khachsanController.getRoomSelected)
    router.route('/sendfeedback/:id_room') // gui phan hoi`
        .post(khachsanController.sendFeedBack);
    router.route('/getallbill')
        .get(khachsanController.getBill)
    router.route('/selectedRoom')
        .get(khachsanController.getSelectedRoom)
    router.route('/canSelectRoom')
        .get(khachsanController.getEmptyRoom)

    //===========admin=================
    router.route('/admin')
        .get(adminController.home)
    router.route('/admin/hoadon')
        .get(adminController.getAdminBill)
    router.route('/admin/dichvu')
        .get(adminController.getAdminService)
    router.route('/admin/singleRoom')
        .get(adminController.getAdminSingleRoom)
    router.route('/admin/doubleRoom')
        .get(adminController.getAdminDoubleRoom)
    router.route('/admin/DeluxeRoom')
        .get(adminController.getAdminVipRoom)
    router.route('/admin/event')
        .get(adminController.getAdminEvent)
    router.route('/admin/login')
        .get(adminController.getAdminLogin)
        .post(adminController.postAdminLogin)
    router.route('/admin/register')
        .get(adminController.getAdminRegister)
        .post(adminController.postAdminRegister)
    router.route('/admin/forgotpassword')
        .get(adminController.getAdminForgetpass)
    router.route('/admin/forgotpassword')
        .get(adminController.getAdminForgetpass)
    router.route('/admin/404')
        .get(adminController.getAdmin404)
    router.route('/admin/blank')
        .get(adminController.getAdminBlank)
    router.route('/admin/khachhang')
        .get(adminController.getAdminUser)
    router.route('/admin/dsphongdat')
        .get(adminController.dsphongdat)
    router.route('/admin/dsphongtrong')
        .get(adminController.dsphongtrong)
    router.route('/admin/createroom')
        .get(adminController.addRoom)
        .post(adminController.createRoom)
    router.route('/admin/uploadimage')
        .get(adminController.uploadFile)
        .post(adminController.postUploadFile)
    router.route('/admin/deleteAdminbill/:id')
        .get(adminController.deleteBill)
    router.route('/admin/deleteRoom/:id')
        .get(adminController.deleteRoom)
    router.route('/admin/deleteRoomDouble/:id')
        .get(adminController.deleteRoomDouble)
    router.route('/admin/deleteRoomVip/:id')
        .get(adminController.deleteRoomVip)
    router.route('/admin/deleteRoomSelected/:id')
        .get(adminController.deleteRoomSelected)
    router.route('/admin/deleteRoomEmpty/:id')
        .get(adminController.deleteRoomEmpty)
    router.route('/admin/logout')
        .get(adminController.logOutAdmin)
    return router;
}