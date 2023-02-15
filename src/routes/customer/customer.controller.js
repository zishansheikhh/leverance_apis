const { createCustomerAccount, logInCustomer, addCustomerAddress, getAllSellersForCustomers, getAllCustomerAddressesById, deleteCustomerAddressById } = require("../../models/customer.model");


async function httpCreateCustomerAccount (req, res) {
    await createCustomerAccount(req.body, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpLoginCustomer (req, res) {
    await logInCustomer(req.body, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpAddCustomerAddress (req, res) {
    let CustomerId = req.customer.Id
    await addCustomerAddress(req.body, CustomerId, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpGetAllCustomerAddressesById (req, res) {
    let CustomerId = req.customer.Id
    await getAllCustomerAddressesById(CustomerId, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpDeleteCustomerAddressById (req, res) {
    let AddressId = req.params.id
    let CustomerId = req.customer.Id
    await deleteCustomerAddressById(AddressId,CustomerId, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

//Get All Sellers For Customers

async function httpGetAllSellersForCustomers (req, res) {
    await getAllSellersForCustomers(function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}


module.exports = {
    httpCreateCustomerAccount,
    httpLoginCustomer,
    httpAddCustomerAddress,
    httpGetAllCustomerAddressesById,
    httpDeleteCustomerAddressById,
    httpGetAllSellersForCustomers,
}