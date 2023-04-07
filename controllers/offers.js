const OffersService = require('../services/offers');

let offersServiceInstance = new OffersService();


const createOffers = async (req, res) => {
    const offers = req.body;
    try {
        await offersServiceInstance.createOffers(offers);
        res.status(201)
            .send({ status: true, message: 'Successfully offers created' });
    } catch (err) {
        res.status(500).json({ status: false, message: `error == ${err}` });
    }
};

const updateOffers = async (req, res) => {
    try {
        const { id: offersId } = req.params;
        const updatedOffers = await offersServiceInstance.updateOffers({ _id: offersId },req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedOffers) {
            return res.status(404).json({ status: 'offer id not found' });
        }
        res
            .status(200)
            .send({ status: true, message: 'successfully offer updated' });
    } catch (err) {
        res.status(500).json({ status: false, message: `error == ${err}` });
    }
};

const deleteOffers = async (req, res) => {
    try {
        const { id: offersId } = req.params;
        const deletedOffers = await offersServiceInstance.deleteOffers({
            _id: offersId
        });

        if (!deletedOffers) {
            return res.status(404).json({ status: 'offer not delete' });
        }
        res
            .status(200)
            .json({ status: true, message: 'Successfully deleted offer' });
    } catch (err) {
        res.status(500).json({ status: false, message: `error == ${err}` });
    }
};


const getOffers = async (req,res) =>{
    try{
        const offers = await offersServiceInstance.getOffers(req.body)

        if(!offers){
            return res.status(404).json({status: "offers not found"})
        }
        // if()
        res.status(200).json({status: true, message: "Successfully get all offers", data: offers})
    } catch(err){
        res.status(500).json({ status: false, message: `error == ${err}` });
    }
}


module.exports = {
    createOffers,
    updateOffers,
    deleteOffers,
    getOffers
}