const productService = require('../services/product');
const productServiceInstance = new productService();

const createProduct = async(req,res)=>{
    const product =req.body;
    try {
        const addProduct = await productServiceInstance.createProduct(product);
        console.log(addProduct);
        res.status(200).json({status: true, message: 'product created successfully!' , product: addProduct });
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const getAllProduct = async(req,res)=>{
    try {
        const allProduct = await productServiceInstance.getAllProduct(req.query);
        if(allProduct){
            return res.status(200).json({msg : 'getting all product', products: allProduct ,nbHits: allProduct.length});
        }else{
            return res.status(400).json({msg : " no product found"});
        }
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const getOneProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const findOneProduct = await  productServiceInstance.getOneProduct(productId);
        res.status(200).json({status: true, message: 'get one product successfully!', product : findOneProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const updateProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const updateProduct = await  productServiceInstance.updateProduct(productId,req.body);
        res.status(200).json({status: true, message: 'product updated successfully!', product: updateProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const deleteProduct = async(req,res)=>{
    const {id:productId}= req.params;
    try {
        const deleteProduct = await  productServiceInstance.deleteProduct(productId);
        res.status(200).json({status: true, message: 'product deleted successfully!',product : deleteProduct});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const deleteVariant=async(req,res)=>{
    const {id:variantId}= req.params;
    try {
        const deleteVariant = await  productServiceInstance.deleteVariant(variantId);
        res.status(200).json({status: true, message: 'product deleted successfully!',product : deleteVariant});
    } catch (error) {
        res.status(500).json({ status: false, message: `error == ${error}` });
        console.log(error);
    }
}

const filterProduct = (req,res)=>{

}
module.exports= {
    createProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    deleteVariant,
    filterProduct,
    getAllProduct
}