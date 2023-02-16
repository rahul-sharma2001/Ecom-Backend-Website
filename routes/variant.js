const express = require('express');

const router = express.Router();
const Variant = require('../model/variant')


// --> this is temparary apis to check all working well or not

router.post('/', async (req, res) => {
    console.log("variant data = ", req.body);
    const { productId, size, color, noOfProducts } = req.body;

    try {

        const variant = new Variant({
            productId,
            size,
            color,
            noOfProducts
        })

        const savedData = await variant.save()

        res.status(200).json({
            savedData
        })

    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const allVariants = await Variant.find();
        res.status(200).json(allVariants)
    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const allVariantsByProductId = await Variant.find({ productId: req.params.productId });
        res.status(200).json(allVariantsByProductId)
    } catch (e) {
        console.log("error = ", e);
        res.status(500).json({
            status: false,
            message: `Server Error, ${e.message}`
        })
    }
})

module.exports = router;
