var inquirer = require("inquirer");
var mysql = require('mysql');
var fs = require("fs");
var moment = require('moment');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function promptForLoginCredentials() {
    inquirer.prompt([{
        name: "username",
        type: "input",
        message: "Enter your username"
    }, {
        name: "password",
        type: "password",
        message: "Enter your password"
    }]).then(function(data) {
        authenticate(data.username, data.password)
    }) //end then(function)
}

function authenticate(username, password) {
    var query = connection.query("SELECT id, username, password, IFNULL(role, 'customer') as role from vwauth WHERE ?", {
        username
    }, function(err, res) {
      var role = res[0].role;
      // console.log(res);
        if (res.length === 0) {
            console.log("User not found, please register.");
            createUser(username, password);
        } else if (res[0].password !== password) {
            console.log("Incorrect password, please try again.")
            return promptForLoginCredentials();
        } else {
            return browse(res[0].id, 0);
        }
    })
};

function createUser(username, password) {
    var query = connection.query('INSERT INTO customers set ?', {
        username: username,
        password: password
    }, function(err, res) {
        console.log('Successfully created a user 💁') // ctrl + cmd + space on mac to bring up the emoji pallette
        return authenticate(username, password);
    })
}

function history(userId) {

}

function browse(buyerId, orderNumber) {
    // var buyerId = buyerId;
    // var idSearch = 0;
    inquirer.prompt([{
        name: 'searchType',
        type: 'rawlist',
        message: 'Please choose product search type: ',
        choices: ['Product Id', 'Product Name']
    }]).then(function(rawlist) {
        var sType = rawlist.searchType;
        if (sType === 'Product Id') {
            inquirer.prompt([{
                name: 'id',
                type: 'input',
                message: 'Please enter the product id you want to buy: '
            }]).then(function(input) {

                var query = connection.query('SELECT * FROM products WHERE quantityInStock >0 AND ?', {
                    id: input.id
                }, function(err, results) {
                    var productId = input.id;
                    if (results.length > 0) {
                        console.log(
                            "Product ID: " + results[0].id + "\n" +
                            "Product Name: " + results[0].productName + "\n" +
                            "Price: " + results[0].buyPrice + "\n" +
                            "Available Quantity: " + results[0].quantityInStock
                          );
                        buy(productId, buyerId, orderNumber);
                    } else {
                        console.log("ID not or product not in stock! Please start over, note you can search by partial product name.");
                        return browse(buyerId, orderNumber);
                    }
                });
            })
        } else {
            inquirer.prompt([{
                name: 'productName',
                type: 'input',
                message: 'Please enter the product name you want to buy: (partial name is fine) '
            }]).then(function(input) {
                var arrProducts = [];
                var query = connection.query("SELECT * FROM products WHERE quantityInStock>0 AND productName like '%" + input.productName + "%'", function(err, results) {
                    if (!results.length) {
                        console.log("Product name not found, please try again.")
                        return browse(buyerId)
                    } else {
                        results.forEach(function(element) {
                            arrProducts.push(element.id + '::' + element.productName);
                        });
                        inquirer.prompt([{
                            name: 'productName',
                            type: 'rawlist',
                            message: 'List of products in stock. Please choose the product name you want to buy: ',
                            choices: arrProducts
                        }]).then(function(rawlist) {
                            var derivedName = rawlist.productName;
                            var derivedIdx = derivedName.indexOf('::');
                            var derivedId = parseInt(derivedName.substring(0, derivedIdx))
                            console.log("Name found, preparing to buy");
                            buy(derivedId, buyerId, orderNumber);
                        });
                    }

                });
            }) //end then(function)
        }
    }) //end then(function)
}

function buy(productId, buyerId, orderNumber) {
    var query = connection.query('SELECT * FROM products WHERE ?', {
        id: productId
    }, function(err, results) {
        // var buyerId = buyerId; //{buyerId}
        // var productId = productId;
        var productName = results[0].productName;
        var quantityInStock = results[0].quantityInStock;
        var buyPrice = results[0].buyPrice;
        var buyMessage = 'Please enter quantity to buy: 1 to ' + quantityInStock
        // var quantityToBuy = 0;
        // var prepPay = 0;

        inquirer.prompt([{
            name: 'quantityToBuy',
            type: 'input',
            message: buyMessage
        }]).then(function(input) {
            var quantityToBuy = input.quantityToBuy;
            var purchaseDate = moment(Date.now()).format('YYYY-MM-DD');
            if (quantityToBuy > 0 && quantityToBuy <= quantityInStock) {
                var buyObj = {
                    "quantity": quantityToBuy,
                    "price": buyPrice,
                    "extPrice": quantityToBuy * buyPrice,
                    "buyTimestamp": Date.now(),
                    "buyDate": moment(Date.now()).format('l')
                };

                console.log(
                  "Product ID: " + productId + "\n" +
                  "Product Name: " + productName + "\n" +
                  "Price: " + buyPrice + "\n" +
                  "Purchase Quantity: " + quantityToBuy + "\n" +
                  "Extended Price: " + parseFloat(buyPrice * quantityToBuy) + "\n" +
                  "Purchase Date: " + purchaseDate// + "\n" +
                  // "Purchase Timestamp: " Date.now()
                );
                // console.log(buyObj);
                // fs.appendFile("log.txt", JSON.stringify(buyObj) + ",", function(err) {
                //     if (err) console.log(err);
                    inquirer.prompt([{
                        name: 'buyAnother',
                        type: 'rawlist',
                        message: 'Do you want to continue shopping?: ',
                        choices: ["Yes", "No, I'm ready to checkout."]
                    }]).then(function(rawlist) {
                      var buyMore = false;
                        if (rawlist.buyAnother === 'Yes') {
                          buyMore = true;
                          // console.log("buyerID: " + buyerId);
                          // console.log("productID: " + productId);
                          // console.log("purchaseQuantity: " + quantityToBuy);
                          // console.log("quantityInStock: " + quantityInStock);
                          // console.log("purchaseDate: " + purchaseDate);
                          // console.log("price: " + buyPrice);
                          // console.log("orderNumber: " + orderNumber);
                          console.log(buyMore);
                          return pay(buyerId, productId, quantityToBuy, quantityInStock, purchaseDate, buyPrice, orderNumber, buyMore);

                        }
                        console.log("Ok, checking out");
                          return pay(buyerId, productId, quantityToBuy, quantityInStock, purchaseDate, buyPrice, orderNumber, buyMore);
                    });
                // });
            } else if (isNaN(input.quantityToBuy)) {
                console.log("That was not a number. " + buyMessage);
                return buy(productId, buyerId, orderNumber);
            } else {
                console.log("Insufficient quantity, we have " + quantityInStock + " currently in stock.");
                return buy(productId, buyerId, orderNumber);
            }
            // connection.end();
        // pay(buyerId, productId, quantityToBuy, quantityInStock, purchaseDate, buyPrice, orderNumber);
        })
    });
    // connection.end();
} //end buy()

function pay (buyerId, productId, quantityToBuy, quantityInStock, purchaseDate, buyPrice, orderNumber, buyMore) {
  function orderDetail (orderId) {
    // insert order details here
    var queryInsOrdDet = connection.query('INSERT INTO orderDetails set ?', {
        orderid: orderId,
        productid: productId,
        quantityOrdered: quantityToBuy,
        priceEach: buyPrice
    }, function(err, res) {
        // console.log(queryInsOrdDet);
        console.log("order detail created");
      })
    var queryUpdProd = connection.query('UPDATE PRODUCTS set ?', {
        quantityInStock: quantityInStock - quantityToBuy
    }, function(err, res) {
        console.log("quantity in stock adjusted");

        if (buyMore) {
          return browse(buyerId, orderId);
        }
        else {
          console.log("Thank you for your business!")
          connection.end;
          return;
        }

      })
    // return browse(buyerId, orderId);

  };
  if (orderNumber >0) {
    var orderId = orderNumber;
    orderDetail(orderId);
    return browse(buyerId, orderId);
  }
    else if (orderNumber === 0) {
    var queryIns = connection.query('INSERT INTO orders set ?', {
        customerId: buyerId,
        orderDate: purchaseDate
    }, function(err, res) {
      // console.log(query);
      var queryUserId = connection.query('SELECT * FROM orders WHERE ? ORDER BY orderDate DESC LIMIT 1', {
          customerId: buyerId
      }, function(err, res) {
          var NewOrderId = res[0].id;
          orderDetail(NewOrderId);
        })
    })
  }


} // end pay
// browse(1);
promptForLoginCredentials();
