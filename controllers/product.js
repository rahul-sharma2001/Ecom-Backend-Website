const productService = require('../services/product');
const productServiceInstance = new productService();

const createProduct = async(req,res)=>{
    const product =req.body;
    try {
        const addProduct = await productServiceInstance.CreateProduct(product);
        res.status(200).json({status: true, message: 'product created successfully!' , product: addProduct });
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

const getAllProduct = async(req,res)=>{
    try {
        const allProduct = await productServiceInstance.GetAllProduct(req.query);
        // console.log(allProduct.filterProducts);
        if(allProduct){
            return res.status(200).json({msg : 'getting all product', count:allProduct.totalProducts, products: allProduct.filterProducts});
        }else{
            return res.status(400).json({msg : " no product found"});
        }
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

const getOneProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const findOneProduct = await  productServiceInstance.GetOneProduct(productId);
        res.status(200).json({status: true, message: 'get one product successfully!', product : findOneProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

const updateProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const updateProduct = await  productServiceInstance.UpdateProduct(productId,req.body);
        res.status(200).json({status: true, message: 'product updated successfully!', product: updateProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

const deleteProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const deleteProduct = await  productServiceInstance.DeleteProduct(productId);
        res.status(200).json({status: true, message: 'product deleted successfully!',product : deleteProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

const deleteVariant=async(req,res)=>{
    const {id:variantId}= req.params;
    const {id: productId}= req.body;
    try {
        const deleteVariant = await  productServiceInstance.DeleteVariant(productId,variantId);
        res.status(200).json({status: true, message: 'product deleted successfully!',product : deleteVariant});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
    }
}

module.exports= {
    createProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    deleteVariant,
    getAllProduct
}