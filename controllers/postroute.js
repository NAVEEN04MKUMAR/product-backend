const Products = require("../model/product.js");


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


const addproduct=async(req,res)=>{
    const product=req.body;

    if(!product._id||!product.productname||!product.productcode||!product.category||!product.manufacturer||!product.manufacturingdate){
        return res.status(400).send({message:'some-field-are-missing'});
    }
    try {
        const newProduct = new Products(product);
        await newProduct.save(); 
        return res.status(201).send({ message: "product-added-successfully" });
    } catch (error) {
        console.error("Error while adding product:", error); 
        return res.status(500).send({ message: "Failed to add product", error:error.message });
    }
        
};


const getproducts=async(req,res)=>{
    try {
        const products = await Products.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).send({ message: "Failed to fetch products", error });
    }};

 const deleteproduct=async(req, res) => {
        const productId = req.params.id;
      
        try {
         
          const result = await Products.findByIdAndDelete(productId);
      
          if (!result) {
            return res.status(404).send({ message: "Product not found" });
          }
      
          return res.status(200).send({ message: "Product deleted successfully" });
        } catch (error) {
          console.error("Error deleting product:", error);
          return res.status(500).send({ message: "Failed to delete product", error: error.message });
        }
      };



module.exports={
addproduct,getproducts,deleteproduct
};
