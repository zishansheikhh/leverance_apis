const express = require("express");
const fetchCustomer = require("../../middleware/fetchcustomer");
const {
  httpCreateCustomerAccount,
  httpLoginCustomer,
  httpAddCustomerAddress,
  httpGetAllSellersForCustomers,
  httpGetAllCustomerAddressesById,
  httpDeleteCustomerAddressById,
} = require("./customer.controller");

const customerRouter = express.Router();

//auth
customerRouter.post("/createaccount", httpCreateCustomerAccount);
customerRouter.post("/login", httpLoginCustomer);

//address
customerRouter.post("/address", fetchCustomer, httpAddCustomerAddress);
customerRouter.get("/address", fetchCustomer, httpGetAllCustomerAddressesById);
customerRouter.delete("/address/:id", fetchCustomer, httpDeleteCustomerAddressById)

//sellers
customerRouter.get("/sellers", fetchCustomer, httpGetAllSellersForCustomers);

module.exports = customerRouter;
