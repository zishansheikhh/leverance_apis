const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../services/mysql");

const JWT_TOKEN = "breakthematrix";

async function logInSeller(sellerCred, callback) {
  const { PhoneNumber, Password } = sellerCred;
  let sql = `SELECT * FROM sellers WHERE PhoneNumber = ${PhoneNumber}`;
  db.query(sql, async function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result.length < 1) {
        callback("seller account not found", null);
      } else {
        let comparePassword = await bcrypt.compare(
          Password,
          result[0].Password
        );
        if (!comparePassword) {
          callback("password does not match", null);
        } else {
          let data = {
            seller: {
              PhoneNumber,
              Id: result[0].SellerId,
              isSeller: true,
            },
          };
          const authToken = jwt.sign(data, JWT_TOKEN);
          let success = true;
          callback(null, { authToken, success });
        }
      }
    }
  });
}

// get current seller info

async function getCurrentSellerInfoById(Id, callback) {
  let sql = `SELECT SellerId, FirmName, FirstName, LastName, PhoneNumber, Address, City, State, Balance, Count, Demand FROM sellers WHERE SellerId = ${Id}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result[0]);
    }
  });
}

async function demandCylinders(Id, cylinders, callback) {
  let sql0 = `SELECT Demand FROM sellers WHERE SellerId = ${Id}`
  db.query(sql0, function(err0, result0) {
    if (err0) {
      callback(err0, null)
    } else {
      let newDemand = Number(result0[0].Demand) + Number(cylinders)
      let sql = `UPDATE sellers SET Demand = ${newDemand} WHERE SellerId = ${Id}`;
      db.query(sql, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, {
            success: true
          });
        }
      });
    }
  })
}

async function addBalanceToSellerAccount(Id, transaction, callback) {
  const { Process, Amount, Method, TransactionDate } = transaction;
  db.beginTransaction(function (err) {
    if (err) {
      callback(err, null);
    } else {
      let sql1 = `SELECT Balance FROM sellers WHERE SellerId = ${Id}`;
      db.query(sql1, function (err1, result1) {
        if (err1) {
          return db.rollback(function () {
            callback(err1, null);
          });
        } else {
          let NewAmount = Number(result1[0].Balance) + Number(Amount);
          let sql = `UPDATE sellers SET Balance = ${NewAmount} WHERE SellerId = ${Id}`;
          db.query(sql, function (err2, result) {
            if (err2) {
              return db.rollback(function () {
                callback(err2, null);
              });
            } else {
              let sql = "INSERT INTO seller_transactions SET ?";
              db.query(sql,{ SellerId: Id, Process, Amount, Method, TransactionDate },function (err4, result) {
                  if (err4) {
                    return db.rollback(function() {
                      callback(err4, null)
                    })
                  } else {
                    let TransactionId = result.insertId
                    db.commit(function (err3) {
                      if (err3) {
                        return db.rollback(function () {
                          callback(err3, null);
                        });
                      } else {
                        callback(null, {
                          TransactionId,
                          success: true,
                        });
                      }
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  });
}

//get all transactions of seller

async function getAllSellerTransaction(Id, callback) {
  let sql = `SELECT * FROM seller_transactions WHERE SellerId = ${Id} ORDER BY TransactionId DESC`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

// get product categories

async function getProductCategories(callback) {
  let sql = "SELECT * FROM product_categories";
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

// Creating Orders

async function createSellerOrder(orderDetails, callback) {
  // const {Manufacturer, Status, Payment, SellerId} = orderDetails
  // let sql = 'INSERT INTO seller_orders SET ?'
  // db.query(sql, {Manufacturer, Status, Payment, SellerId}, function(err, result) {
  //   if (err) {
  //     callback(err, null)
  //   } else {
  //     callback(null, {
  //       ok: true,
  //       OrderId: result.insertId
  //     })
  //   }
  // })
}

async function createOrderPayload(Payload, OrderId, callback) {
  let sql =
    "INSERT INTO seller_order_payload (OrderId, ProductId, Quantity) VALUES ?";
  db.query(
    sql,
    [Payload.map((item) => [OrderId, item.ProductId, item.Quantity])],
    function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, "order placed successfully");
      }
    }
  );
}

async function getAllSellerOrders(SellerId, callback) {
  let sql = `SELECT * FROM seller_orders 
      JOIN seller_order_payload ON seller_orders.OrderId = seller_order_payload.OrderId 
    WHERE SellerId = ${SellerId}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}


async function createSellerReturnOrder (SellerId, callback) {
  let date = new Date()
  let CreatedAt = date.toDateString();
  let sql = `INSERT INTO seller_return_orders SET ?`
  db.query(sql, {SellerId, CreatedAt, Status: 'Booked'}, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, {
        ReturnOrderId : result.insertId,
        success: true
      })
    }
  })
}

async function getSellerReturnOrder (SellerId, callback) {
  let sql = `SELECT * FROM seller_return_orders WHERE SellerId = ${SellerId} ORDER BY ReturnOrderId DESC`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, result)
    }
  })
}



async function getSellerInfoById(SellerId, callback) {
  let sql = `SELECT FirmName FROM sellers WHERE SellerId=${SellerId}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = {
  logInSeller,
  getCurrentSellerInfoById,
  demandCylinders,
  addBalanceToSellerAccount,
  getAllSellerTransaction,
  getProductCategories,
  createSellerOrder,
  createOrderPayload,
  getAllSellerOrders,
  createSellerReturnOrder,
  getSellerReturnOrder,
};
