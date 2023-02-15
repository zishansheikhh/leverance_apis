const { SortSellerOrders } = require("../../helper-function/helper-functions");
const {
  createAdminAccount,
  loginInAdmin,
  createSellerAccount,
  getAllSellers,
  addNewProduct,
  getAllProducts,
  getSellerById,
  getProductById,
  updateSellerOrderStatus,
  deleteProductById,
  deleteSellerById,
  getAllSellersOrders,
  getAllCustomers,
  createSellerOrder,
  sellerOrderDelivered,
  updateSellerReturnOrderStatus,
  sellerReturnOrderReceived,
  getAllSellerReturnOrders,
  getSellerOrdersBySellerId,
  getSellerTransactionsBySellerId,
} = require("../../models/admin.model");

async function httpCreateAdminAccount(req, res) {
  await createAdminAccount(req.body, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpLoginAdmin(req, res) {
  await loginInAdmin(req.body, function (err, data) {
    if (err) {
      res.status(404).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpCreateSellerAccount(req, res) {
  await createSellerAccount(req.body, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpGetAllSellers(req, res) {
  await getAllSellers(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetSellerById(req, res) {
  await getSellerById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpDeleteSellerById(req, res) {
  await deleteSellerById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpCreateSellerOrder (req, res) {
  let sellerId = req.params.id
  await createSellerOrder(sellerId, req.body, async function(err, data) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })
}

//Products

async function httpAddNewProduct(req, res) {
  await addNewProduct(req.body, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetAllProducts(req, res) {
  await getAllProducts(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetProductById(req, res) {
  await getProductById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpDeleteProductById(req, res) {
  await deleteProductById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetAllSellersOrders(req, res) {
  await getAllSellersOrders(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      if (data.length === 0) {
        res.status(200).json([]);
      } else {
        let newArr = SortSellerOrders(data)
        res.status(200).json(newArr);
      }
    }
  });
}

async function httpGetSellerOrdersBySellerId(req, res) {
  let Id = req.params.id;
  await getSellerOrdersBySellerId(Id, function(err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      if (data.length === 0) {
        res.status(200).json([]);
      } else {
        let newArr = SortSellerOrders(data)
        res.status(200).json(newArr);
      }
    }
  })
}

async function httpUpdateSellerOrderStatus(req, res) {
  let Id = req.params.id;
  let Status = req.body.Status;
  if (Status === 'Delivered') {
    await sellerOrderDelivered(Id, Status, function(err, data) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.status(200).json(data)
      }
    })
  } else {
    await updateSellerOrderStatus(Id, Status, function (err, data) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(data);
      }
    });
  }
}

async function httpUpdateSellerReturnOrder(req, res) {
  const ReturnOrderId = req.params.id
  const {Status, Cylinders} = req.body
  if (Status === 'Received') {
    await sellerReturnOrderReceived(ReturnOrderId, Status, Cylinders, function(err, data) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.status(200).json(data)
      }
    })
  } else {
    await updateSellerReturnOrderStatus(ReturnOrderId, Status, function(err, data) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.status(200).json(data)
      }
    })
  }
}

async function httpGetAllSellerReturnOrders (req, res) {
  await getAllSellerReturnOrders(function(err, data) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })
}

//customers

async function httpGetAllCustomers (req, res) {
  await getAllCustomers(function(err, data) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })
}

//seller transactions

async function httpGetSellerTransactionsBySellerId (req, res) {
  let Id = req.params.id;
  await getSellerTransactionsBySellerId(Id, function(err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data)
    }
  })
}



module.exports = {
  httpCreateAdminAccount,
  httpLoginAdmin,
  httpCreateSellerAccount,
  httpGetAllSellers,
  httpGetSellerById,
  httpDeleteSellerById,
  httpCreateSellerOrder,
  httpAddNewProduct,
  httpGetAllProducts,
  httpGetProductById,
  httpDeleteProductById,
  httpGetAllSellersOrders,
  httpGetSellerOrdersBySellerId,
  httpUpdateSellerOrderStatus,
  httpUpdateSellerReturnOrder,
  httpGetAllSellerReturnOrders,
  httpGetAllCustomers,
  httpGetSellerTransactionsBySellerId,
};
