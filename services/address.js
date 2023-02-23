const addressModel = require('../model/address')

class AddressService {
    async createAddress(addressInfo){
        try{
            if(!addressInfo){
                throw new Error('Address details is required')
            }
            const saveAddress = await addressModel.create(addressInfo)

            if(saveAddress){
                return saveAddress
            }else{
                throw new Error('Address details not saved')
            }
        }catch(err){
            throw err
        }
    }


    async updateAddress(obj, updatedObj, options){
        try{
            if(!obj){
                throw new Error('Address id is required')
            }
            const updateAddress = await addressModel.findByIdAndUpdate(obj, updatedObj, options)
            console.log("updateAddress = ", updateAddress)

            if(updateAddress){
                console.log(updateAddress + " " + " service")
                return updateAddress
            }else{
                throw new Error('Address details are not updated')
            }
        }catch(err){
            throw err
        }
    }


    async deleteAddress({_id: addressId}){
        try{
            if(!{_id: addressId}){
                throw new Error('Address id is required')
            }
            const deleteAddress = await addressModel.findByIdAndDelete({_id: addressId})

            if(deleteAddress){
                return deleteAddress
            }else{
                throw new Error('Address not deleted')
            }
        }catch(err){
            throw err
        }
    }



    async findAddressByUserId(id){
        try{
            if(!id){
                throw new Error('User id is required')
            }
            const addresByUserId = await addressModel.find(id)
            console.log(addresByUserId + " "+ "address")

            if(addresByUserId){
                return addresByUserId
            }else{
                throw new Error('Address not found')
            }
        }catch(err){
            throw err
        }
    }
}

module.exports = AddressService