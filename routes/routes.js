const express=require('express');
const router=express.Router();
const product=require('../controllers/postroute.js');


router.post('/postproduct',product.addproduct);
router.get('/getproduct',product.getproducts);
router.delete('/deleteproduct/:id',product.deleteproduct);


module.exports=router;
