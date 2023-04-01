
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const productsController = require('../controllers/productsController');

const filesConsts = require('../consts/files');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = filesConsts.FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = filesConsts.FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
})
  
const uploadOption = multer({ storage: storage })


router.route(`/`)
.get(productsController.getViewProductList)

router.route(`/add`)
.get(productsController.getAddProductView)
.post(uploadOption.single('image'), productsController.addProduct)

router.route(`/edit/:id`)
.get(uploadOption.single('image'), productsController.getUpdateProductView)
.post(uploadOption.single('image'), productsController.updateProduct)

router.route(`/delete/:id`)
.get(productsController.deleteProduct)

module.exports = router;

