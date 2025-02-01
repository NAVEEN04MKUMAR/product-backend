const express=require('express');
const router=express.Router();
const product=require('../controllers/postroute.js');
const {common, getdata, updatecommon}=require('../controllers/common-Insurance.js');
const {BuildingInsurance, BuildingGetInsurance, UpdateBuildingInsurance}=require('../controllers/Building-insurance.js');
const {PackageInsurance, PackageGetInsurance, UpdatePackageInsurance}=require('../controllers/Package.js');






// router.post('/postproduct',product.addproduct);
// router.get('/getproduct',product.getproducts);
// router.delete('/deleteproduct/:id',product.deleteproduct);

router.post('/common', common);
router.get('/get-data/:customerreferenceno', getdata);
router.put('/update-common', updatecommon);

router.post('/building',BuildingInsurance);
router.get('/get-building-data/:customerreferenceno',  BuildingGetInsurance);
router.put('/update-building-data',UpdateBuildingInsurance);

router.post('/package',PackageInsurance);
router.get('/get-package-data/:customerreferenceno',  PackageGetInsurance);
router.put('/update-package-data',UpdatePackageInsurance);
console.log("This is my local version of the file");

console.log("This is my local version of the file");
console.log("This is the version from the remote repository");

router.post('/postproduct',product.addproduct);
router.get('/getproduct',product.getproducts);
router.delete('/deleteproduct/:id',product.deleteproduct);
console.log("This is the version from the remote repository");


module.exports=router;
