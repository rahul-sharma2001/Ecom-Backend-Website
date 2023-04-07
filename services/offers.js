const offersModel = require('../model/offers')
const moment = require('moment')

class OffersService {
    async createOffers(offersInfo) {
        try {
            if (!offersInfo) {
                throw new Error('Offers details is required')
            }
            const { images, startDate, endDate } = offersInfo
            console.log(endDate)
            console.log(moment(endDate).valueOf())
            const newData = {
                images: images,
                startDate: startDate,
                endDate: moment(endDate).valueOf()
            }
            const saveOffers = await offersModel.create(newData)
            console.log(saveOffers.endDate + "==")
            if (saveOffers) {
                return saveOffers
            } else {
                throw new Error('Offers details not saved')
            }
        } catch (err) {
            throw err
        }
    }


    async updateOffers(obj, updatedObj, options) {
        try {
            if (!obj) {
                throw new Error('Offer id is required')
            }
            const updateOffers = await offersModel.findByIdAndUpdate(obj, updatedObj, options)

            if (updateOffers) {
                return updateOffers
            } else {
                throw new Error('Address details are not updated')
            }
        } catch (err) {
            throw err
        }
    }


    async deleteOffers({ _id: offersId }) {
        try {
            if (!{ _id: offersId }) {
                throw new Error('Address id is required')
            }
            const deleteOffers = await offersModel.findByIdAndDelete({ _id: offersId })
            if (deleteOffers) {
                return deleteOffers
            } else {
                throw new Error('offer not deleted')
            }
        } catch (err) {
            throw err
        }
    }


    async getOffers() {
        try {
            const validOffers = await offersModel.find({ endDate: { $gt: Date.now() } })
            const expiredOffers = await offersModel.find({ endDate: { $lt: Date.now() } })

            if (expiredOffers.length > 0) {
                await offersModel.deleteMany({ _id: { $in: expiredOffers.map(offer => offer._id) } })
                // console.log(`${expiredOffers.length} expired offers have been deleted`)/
            }
            if (validOffers.length > 0) {
                return validOffers
            } else {
                throw new Error('No valid offers found')
            }
        } catch (err) {
            throw err
        }
    }
}


module.exports = OffersService