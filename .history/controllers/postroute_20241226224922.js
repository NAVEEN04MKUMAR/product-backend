const Product = require("../model/product.js");


let products=[
    {
        id:"1",
        productname:"product1",
        productcode:"p001",
        category:"Electrical",
        manufacturer:"manufacturar1",
        manufacturingdate:"01-05-2022"
    },{
        id:"2",
        productname:"product2",
        productcode:"p002",
        category:"Electronics",
        manufacturer:"manufacturar2",
        manufacturingdate:"01-05-2023"
    },{
        id:"3",
        productname:"product3",
        productcode:"p003",
        category:"civil",
        manufacturer:"manufacturar3",
        manufacturingdate:"01-05-2024"
    }
];

//application.post('/products',
const addproduct=async(req,res)=>{
    const product=req.body;

    if(!product.id||!product.productname||!product.productcode||!product.category||!product.manufacturer||!product.manufacturingdate){
        return res.status(400).send({message:'some-field-are-missing'});
    }
    try {
        const newProduct = new Product(product);
        await newProduct.save(); // Save product to MongoDB
        return res.status(201).send({ message: "product-added-successfully" });
    } catch (error) {
        return res.status(500).send({ message: "Failed to add product", error });
    }
        // return res.status(201).send({message:'product-added-successfully'});
};

//application.post('/products',
const getproducts=(req,res)=>{
    return res.status(200).json(products);
};

module.exports={
addproduct,getproducts
};