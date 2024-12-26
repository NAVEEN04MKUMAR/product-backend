const express=require('express');
const router=express.Router();
const product=require('../controllers/postroute.js');


router.post('/product',product.addproduct);
router.get('/getproduct',product.getproducts);

module.exports=router;