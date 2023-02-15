const express = require("express");
const fetchAdmin = require("../../middleware/fetchadmin");
const {
  httpCreateAdminAccount,
  httpLoginAdmin,
  httpCreateSellerAccount,
  httpGetAllSellers,
  httpAddNewProduct,
  httpGetAllProducts,
  httpGetSellerById,
  httpGetProductById,
  httpUpdateSellerOrderStatus,
  httpDeleteProductById,
  httpDeleteSellerById,
  httpGetAllSellersOrders,
  httpGetAllCustomers,
  httpCreateSellerOrder,
  httpUpdateSellerReturnOrder,
  httpGetAllSellerReturnOrders,
  httpGetSellerOrdersBySellerId,
  httpGetSellerTransactionsBySellerId,
} = require("./admin.controller");

const adminRouter = express.Router();

adminRouter.post("/createadmin", httpCreateAdminAccount);
adminRouter.post("/login", httpLoginAdmin);

//sellers
adminRouter.post("/createseller", fetchAdmin, httpCreateSellerAccount);
adminRouter.get("/sellers", fetchAdmin, httpGetAllSellers);
adminRouter.get("/sellers/:id", fetchAdmin, httpGetSellerById)
adminRouter.delete("/seller/:id", fetchAdmin, httpDeleteSellerById)

//seller orders
adminRouter.post("/createsellerorder/:id", fetchAdmin, httpCreateSellerOrder)
adminRouter.get("/sellerorders", fetchAdmin, httpGetAllSellersOrders)
adminRouter.put("/sellerorder/:id", fetchAdmin, httpUpdateSellerOrderStatus);
adminRouter.get("/seller/sellerorders/:id", fetchAdmin, httpGetSellerOrdersBySellerId)

//seller transactions
adminRouter.get("/seller/sellertransactions/:id", fetchAdmin, httpGetSellerTransactionsBySellerId)

//seller return orders
adminRouter.put("/sellerreturnorder/:id", fetchAdmin, httpUpdateSellerReturnOrder)
adminRouter.get("/sellerreturnorder", fetchAdmin, httpGetAllSellerReturnOrders)

//products
adminRouter.post("/addnewproduct", fetchAdmin, httpAddNewProduct);
adminRouter.get("/products", fetchAdmin, httpGetAllProducts);
adminRouter.get("/products/:id", fetchAdmin, httpGetProductById);
adminRouter.delete("/product/:id", fetchAdmin, httpDeleteProductById)

//customers 

adminRouter.get("/customers", fetchAdmin, httpGetAllCustomers)


module.exports = adminRouter;
