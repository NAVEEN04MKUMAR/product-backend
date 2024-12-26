


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
const addproduct=(req,res)=>{
    const product=req.body;

    if(product.id,product.productname,product.productcode,product.category,product.manufacturer,product.manufacturingdate){
        return res.status(400).send({message:'some-field-are-missing'});
    }
    products.push(product);
    return res.status(201).send({message:'product-added-successfully'});
};

//application.post('/products',
const getproducts=(req,res)=>{
    return res.status(200).json(products);
};

module.export={
addproduct,getproducts
};