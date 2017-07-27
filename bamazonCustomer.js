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
    // console.log("foo");
    var query = connection.query('SELECT id, username, password from vwauth WHERE ?', {
        username
    }, function(err, res) {
        if (res.length === 0) {
            console.log("user not found");
            createUser(username, password);
        } else if (res[0].password !== password) {
            return promptForLoginCredentials();
        } else {
            // console.log(res[0].id);
            // console.log(username);
            // console.log(password);
            return browse(res[0].id);
        }

        // }

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

function browse(browseId) {
    var userId = browseId;
    var idSearch = 0;
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
                    if (results.length > 0) {
                        console.log(
                            "ID found, " + "\n" +
                            "preparing to buy");
                        buy(input.id, userId);
                    } else {
                        console.log("ID not or product not in stock! Please start over, note you can search by partial product name.");
                        return browse(userId);
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
                        return browse(userId)
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
                            buy(derivedId, userId);
                        });
                    }

                });
            }) //end then(function)
        }
    }) //end then(function)
}

function buy(idBuy, userId) {
    var query = connection.query('SELECT * FROM products WHERE ?', {
        id: idBuy
    }, function(err, results) {
        var userId = userId; //{USERID}
        var buyId = idBuy;
        var productName = results[0].productName;
        var quantityInStock = results[0].quantityInStock;
        var buyPrice = results[0].buyPrice;
        var buyMessage = 'Please enter quantity to buy: 1 to ' + quantityInStock
        var quantityToBuy = 0;
        // var prepPay = 0;

        inquirer.prompt([{
            name: 'quantityToBuy',
            type: 'input',
            message: buyMessage
        }]).then(function(input) {
            quantityToBuy = input.quantityToBuy;
            if (quantityToBuy > 0 && quantityToBuy <= quantityInStock) {
                var buyObj = {
                    "quantity": quantityToBuy,
                    "price": buyPrice,
                    "extPrice": quantityToBuy * buyPrice,
                    "buyTimestamp": Date.now(),
                    "buyDate": moment(Date.now()).format('l')
                };
                // console.log("Quantity: " + quantityToBuy);
                // console.log("Price: " + buyPrice);
                // console.log("Ext Price: " + buyPrice * quantityToBuy);
                // console.log("Preparing for payment");
                console.log(buyObj);
                fs.appendFile("log.txt", JSON.stringify(buyObj) + ",", function(err) {
                    if (err) console.log(err);
                    inquirer.prompt([{
                        name: 'buyAnother',
                        type: 'rawlist',
                        message: 'Do you want to continue shopping?: ',
                        choices: ["Yes", "No, I'm ready to checkout."]
                    }]).then(function(rawlist) {
                        if (rawlist.buyAnother === 'Yes') {
                            return browse(userId);
                        }
                        console.log("Ok, checking out");
                    });
                });
            } else if (isNaN(input.quantityToBuy)) {
                console.log("That was not a number. " + buyMessage);
                return buy(buyId, userId);
            } else {
                console.log("Insufficient quantity, we have " + quantityInStock + " currently in stock.");
                return buy(buyId, userId);
            }
            // connection.end();
        })
    });
    //pay();
    // connection.end();
}

// browse(1);
promptForLoginCredentials();
