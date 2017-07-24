var inquirer = require("inquirer");
var mysql = require('mysql');
var command = process.argv[2];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// var consoletab = require('console.table');
// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);
//
// // prints
// name  age
// ----  ---
// foo   10
// bar   20

function start() {
  inquirer.prompt([{
      name: 'searchType',
      type: 'rawlist',
      message: 'Please choose product search type: ',
      choices: ['Product Id', 'Product Name']
  }]).then(function(rawlist) {
    ////
      var sType = rawlist.searchType;
      if (sType === 'Product Id') {
        // console.log("product id");
        inquirer.prompt([{
            name: 'id',
            type: 'input',
            message: 'Please enter the product id you want to buy: '
        }]).then(function(input) {
          ////
            var query = connection.query('SELECT * FROM products WHERE ?', {
                id: input.id
            }, function(err, results) {
                console.log("Product Name: " + results[0].productName);
                console.log("Available: " + results[0].quantityInStock);
                console.log("Price: " + results[0].buyPrice);
                connection.end();
            });
          ////
        })
      }
      else {
        // console.log("product name");
        inquirer.prompt([{
            name: 'productName',
            type: 'input',
            message: 'Please enter the product name you want to buy: '
        }]).then(function(input) {
          ////
            var arrProducts = [];
            var query = connection.query("SELECT * FROM products WHERE productName like '%" + input.productName + "%'"
              , function(err, results) {
                // console.log(results);

                // var a = ['a', 'b', 'c'];
                //
                results.forEach(function(element) {
                    // console.log(element.productName);
                    arrProducts.push(element.productName);

                });
                    console.log(arrProducts);

                    inquirer.prompt([{
                        name: 'productName',
                        type: 'rawlist',
                        message: 'Please choose the product name you want to buy: ',
                        choices: arrProducts
                    }]).then(function(rawlist) {
                      console.log(rawlist.productName);
                    });


                // console.log("Product Name: " + results[0].productName);
                // console.log("Available: " + results[0].quantityInStock);
                // console.log("Price: " + results[0].buyPrice);
                connection.end();
            });
          ////
        }) //end then(function)
      }
    }) //end then(function)

}
start();
