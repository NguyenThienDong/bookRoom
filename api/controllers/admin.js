const multer = require('multer');
var Room = require('../models/DB_room');
var Admin = require('../models/DB_admin');
var Admins = require('../models/DB_admin').Admins;
var bcrypt = require('bcryptjs');
var config = require('../../config/utils');
var Bill = require('../models/DB_bill');
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
// init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
}).single('image');
module.exports = {


    home: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/index', { name: req.session.adminUser });
        } else {
            res.render('admin/login');
        }

    },
    getAdminBill: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/hoadon', { name: req.session.adminUser });
        } else {
            res.render('admin/login');
        }

    },
    getAdminService: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/dichvu', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }

    },
    getAdminSingleRoom: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/singleRoom', { name: req.session.adminUser });
        } else {
            res.render('admin/login');
        }

    },
    getAdminDoubleRoom: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/doubleRoom', { name: req.session.adminUser });
        } else {
            res.render('admin/login');
        }

    },
    getAdminVipRoom: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/DeluxeRoom', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }

    },
    getAdminEvent: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/event', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }

    },
    getAdminLogin: (req, res) => {
        if (req.session.adminUser) {
            res.redirect('/admin');
        } else {
            res.render('admin/login');
        }
    },
    postAdminLogin: (req, res) => {
        let { username, password } = req.body
        Admins.findOne({ username }, (err, rs) => {
            if (rs) {
                bcrypt.compare(password, rs.password, (err, success) => {
                    if (success) {
                        req.session.adminUser = rs.username;
                        req.session.idAdminUser = rs._id;
                        res.redirect('/admin');
                    } else {
                        req.session.adminUser = undefined;
                        res.render('admin/login', { msg: 'username hoặc mật khẩu không đúng' })
                    }
                })
            } else {
                req.session.user = undefined;
                res.render('admin/login', { msg: 'username hoặc mật khẩu không đúng' })
            }
        })
    },
    getAdminRegister: (req, res) => {
        res.render('admin/register')
    },
    postAdminRegister: (req, res) => {
        let { username, password, confirmpassword } = req.body;
        if (password != confirmpassword) res.render('admin/register', { msg: 'Mật khẩu không trùng khớp' })
        else {
            Admins.findOne({ username }).exec((err, rs) => {
                if (rs)
                    res.render('admin/register', { msg: 'username đã tồn tại' });
                else {
                    bcrypt.hash(password, config.saltRounds, async (err, hash) => {
                        if (hash) {
                            let user = await Admin.createAdmin(username, hash);
                            if (user) res.render('admin/register', { msg: 'đăng ký thành công' });
                            else res.render('admin/register', { msg: 'đã xảy ra lỗi' });
                        }
                    })

                }
            })
        }


    },
    getAdminForgetpass: (req, res) => {
        res.render('admin/forgotpassword')
    },
    getAdmin404: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/404', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    getAdminBlank: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/blank', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    getAdminUser: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/khachhang', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    dsphongdat: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/dsphongdat', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    dsphongtrong: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/dsphongtrong', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    addRoom: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/themphong', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    uploadFile: (req, res) => {
        if (req.session.adminUser) {
            res.render('admin/uploadimage', { name: req.session.adminUser })
        } else {
            res.render('admin/login');
        }
    },
    postUploadFile: (req, res) => {
        upload(req, res, (err) => {
            if (!err) {
                if (req.file == undefined) {
                    res.render('admin/uploadimage', { msg: "Chưa chọn File !", name: req.session.adminUser });
                } else {
                    res.render('admin/uploadimage', { msg: "Thêm ảnh thành công !", name: req.session.adminUser });

                }
            }
        });
    },
    createRoom: (req, res) => {
        let room = req.body;
        Room.createRoom(room)
            .then(rs => {
                if (rs)
                    res.render('admin/themphong', { msg: "Thêm phòng thành công!", name: req.session.adminUser  });

            })
            .catch(err => {
                res.render('admin/themphong', { msg: "Đã xảy ra lỗi", name: req.session.adminUser  });
            })
    },
    deleteBill: (req, res) => {
        let idbill = req.params.id;
        Bill.deleteBillById(idbill)
            .then(rs => {
                res.redirect("/admin/hoadon");
            })
            .catch(err => {
                res.redirect("/admin/hoadon");
            })
    },
    deleteRoom: (req, res) => {
        let idroom = req.params.id;
        Room.deleteRoomById(idroom)
            .then(rs => {
                res.redirect("/admin/singleRoom");
            })
            .catch(err => {
                res.redirect("/admin/singleRoom");
            })
    },
    deleteRoomSelected:(req,res)=>{
        let idroom = req.params.id;
        Room.deleteRoomById(idroom)
            .then(rs => {
                res.redirect("/admin/dsphongdat");
            })
            .catch(err => {
                res.redirect("/admin/dsphongdat");
            })
    },
    deleteRoomDouble: (req, res) => {
        let idroom = req.params.id;
        Room.deleteRoomById(idroom)
            .then(rs => {
                res.redirect("/admin/doubleRoom");
            })
            .catch(err => {
                res.redirect("/admin/doubleRoom");
            })
    },
    deleteRoomEmpty:(req,res)=>{
        let idroom = req.params.id;
        Room.deleteRoomById(idroom)
            .then(rs => {
                res.redirect("/admin/dsphongtrong");
            })
            .catch(err => {
                res.redirect("/admin/dsphongtrong");
            })
    },
    deleteRoomVip: (req, res) => {
        let idroom = req.params.id;
        Room.deleteRoomById(idroom)
            .then(rs => {
                res.redirect("/admin/DeluxeRoom");
            })
            .catch(err => {
                res.redirect("/admin/DeluxeRoom");
            })
    },
    logOutAdmin: (req, res) => {
        req.session.adminUser = undefined;
        res.redirect('/admin/login');
    }
}