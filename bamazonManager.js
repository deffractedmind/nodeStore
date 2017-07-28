var inquirer = require("inquirer");
var mysql = require('mysql');
var fs = require("fs");
var moment = require('moment');
var consoletab = require('console.table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

inquirer.prompt([{
    name: 'menuItem',
    type: 'rawlist',
    message: 'Choose an option.',
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]
}]).then(function(menu) {
    if (menu.menuItem === "View Products for Sale") {
      var queryProd = connection.query('SELECT id, productName, quantityInStock, buyPrice FROM products ORDER BY productName'// LIMIT 20'
      ,function(err, res) {
          console.table(res);
      })
    } else if (menu.menuItem === "View Low Inventory") {
      var queryLowStock = connection.query('SELECT id, productName, quantityInStock FROM products WHERE quantityInStock < 100 ORDER BY quantityInStock DESC'// LIMIT 20'
      ,function(err, res) {
          console.table(res);
      })
    }
    // else if (menu.menuItem === "Add to Inventory") {
    //
    //   inquirer.prompt([{
    //       name: 'productId',
    //       type: 'input',
    //       message: 'Enter product ID',
    //
    //     }, {
    //       name: 'quantity',
    //       type: 'input',
    //       message: 'Enter quantity'
    //   }]).then(function(productMaintenance) {
    //     // var productId = productMaintenance.productId;
    //     // var quantity = productMaintenance.quantity;
    //     // var queryAddStock = connection.query('UPDATE products SET ? WHERE ?' {
    //     //   quantityInStock: quantityInStock + quantity,
    //     //   id : productId
    //     // }
    //     // ,function(err, res) {
    //     //     console.log("quantity updated");
    //     })
    //   })



    // }
}); // end menu
