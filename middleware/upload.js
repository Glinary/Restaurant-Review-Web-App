const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./public/assets/')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

var upload = multer ({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(
            path.extname(file.originalname) == '.jpg' ||
            path.extname(file.originalname) == '.png'
        ){
            callback(null, true)
        } else {
            console.log('jpg and png only!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024  * 1024 * 5
    }
})

module.exports = upload