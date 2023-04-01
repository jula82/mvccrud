const { Product } = require('../models/product');
const mongoose = require('mongoose');

const getViewProductList = async (req,res) => {
     const productList = await Product.find();
     if (!productList) {
         res.status(500).json({
             success: false
         })
     }

    res.render('index', {data: productList})
}

const getAddProductView = async (req,res) => {
    res.render('add_product', {})
}

const getUpdateProductView = async (req,res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({success: false})
    }

    res.render('edit_product', {
        product: product
    })
}

const deleteProduct = async (req,res) => {
    Product.findByIdAndRemove(req.params.id).then((product) => {
        if(product) {
            res.redirect('/');
        } else {
            return res.status(404).json({success: true, message: 'the product not found'});
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err});
    })
}

const addProduct = async (req,res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image file in the request');
  
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        countInStock: req.body.countInStock,
    })
    
    product = await product.save();

    if (!product)
    return res.status(500).send('The product cannot be created;');

    const productList = await Product.find();

    res.render('index', {
        data: productList
    })
}


const updateProduct = async (req,res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id');
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid product');

    const file = req.file;
    let imagepath;
    
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            description: req.body.description,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            countInStock: req.body.countInStock,
        },
        {
            new: true 
        }
    )

    if (!updatedProduct)
    return res.status(404).send('the product cannot be updated');

    const productList = await Product.find(); 

    res.render('index', {
        data: productList
    })
}

module.exports = {
    getViewProductList,
    deleteProduct,
    addProduct,
    getAddProductView,
    getUpdateProductView,
    updateProduct
}