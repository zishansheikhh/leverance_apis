const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../services/mysql");

const JWT_TOKEN = "breakthematrix";

async function createCustomerAccount(customerDetails, callback) {
  const { PhoneNumber, Password } = customerDetails;
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(Password, salt);
  let sql0 = `SELECT CustomerId FROM customers WHERE PhoneNumber = ${PhoneNumber}`;
  db.query(sql0, function (err0, result0) {
    if (err0) {
      callback(err0, null);
    } else {
      if (result0.length > 0) {
        callback("User with this phone number already exits", null);
      } else {
        let sql = "INSERT INTO customers SET ?";
        db.query(
          sql,
          { ...customerDetails, Password: hashPass },
          async (err, result) => {
            if (err) {
              callback(err);
            } else {
              let data = {
                customer: {
                  PhoneNumber,
                  Id: result.insertId,
                  isCustomer: true,
                },
              };
              const authToken = jwt.sign(data, JWT_TOKEN);
              let success = true;
              callback(null, { authToken, success });
            }
          }
        );
      }
    }
  });
}

async function logInCustomer(customerCred, callback) {
  const { PhoneNumber, Password } = customerCred;
  let sql = `SELECT * FROM customers WHERE PhoneNumber = ${PhoneNumber}`;
  db.query(sql, async function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result.length < 1) {
        callback("customer account not found", null);
      } else {
        let comparePassword = await bcrypt.compare(
          Password,
          result[0].Password
        );
        if (!comparePassword) {
          callback("password does not match", null);
        } else {
          let data = {
            customer: {
              PhoneNumber,
              Id: result[0].CustomerId,
              isCustomer: true,
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

async function addCustomerAddress(address, CustomerId, callback) {
  let sql = "INSERT INTO customer_addresses SET ?";
  db.query(sql, { ...address, CustomerId }, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      console.log(result);
      callback(null, {
        AddressId: result.insertId,
        ok: true,
      });
    }
  });
}

async function getAllCustomerAddressesById(CustomerId, callback) {
  let sql = `SELECT * FROM customer_addresses WHERE CustomerId = ${CustomerId}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

async function deleteCustomerAddressById(AddressId, CustomerId, callback) {
  //validation (is customer deleting their own address)
  let sql0 = `SELECT CustomerId FROM customer_addresses WHERE AddressId = ${AddressId}`;
  db.query(sql0, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      if (result[0].CustomerId === CustomerId) {
        let sql = `DELETE FROM customer_addresses WHERE AddressId = ${AddressId}`;
        db.query(sql, function (err, result) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {
              success: true,
            });
          }
        });
      } else {
        callback(`You Don't have access to delete this address`, null)
      }
    }
  });
}

//get nearest sellers

async function getAllSellersForCustomers(callback) {
  let sql = `SELECT SellerId, FirstName, Address, City, State FROM sellers
  WHERE IsOwner = 0`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = {
  createCustomerAccount,
  logInCustomer,
  addCustomerAddress,
  getAllCustomerAddressesById,
  deleteCustomerAddressById,
  getAllSellersForCustomers,
};
