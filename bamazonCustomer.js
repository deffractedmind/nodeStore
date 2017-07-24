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

function purchase(idBuy) {
  var query = connection.query('SELECT * FROM products WHERE ?', {
      id: idBuy
  }, function(err, results) {
      var productName = results[0].productName;
      var quantityInStock = results[0].quantityInStock;
      var buyPrice = results[0].buyPrice;
      var buyMessage = 'Please enter quantity to buy, (1 to ' + quantityInStock +'): '

      console.log("Product Name: " + results[0].productName);
      console.log("Available: " + results[0].quantityInStock);
      console.log("Price: " + results[0].buyPrice);
      connection.end();

  console.log(buyMessage);
  inquirer.prompt([{
      name: 'quantityToBuy',
      type: 'input',
      message: buyMessage
  }]).then(function(input) {
    console.log(input.quantityToBuy);
  })
  });
}

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
// inquirer.prompt([{
//     name: 'id',
//     type: 'input',
//     message: 'Please enter the product id you want to buy: '
// }]).then(function(input) {
//   ////
//     var query = connection.query('SELECT * FROM products WHERE ?', {
//         id: input.id
//     }, function(err, results) {
//         console.log("Product Name: " + results[0].productName);
//         console.log("Available: " + results[0].quantityInStock);
//         console.log("Price: " + results[0].buyPrice);
//         connection.end();
//     });
//   ////
// })

      }
      else {
        // console.log("product name");
        inquirer.prompt([{
            name: 'productName',
            type: 'input',
            message: 'Please enter the product name you want to buy: (partial name is fine) '
        }]).then(function(input) {
          ////
            var arrProducts = [];
            var query = connection.query("SELECT id, productName FROM products WHERE productName like '%" + input.productName + "%'"
              , function(err, results) {

                // for (var i=0; i<results.length; i++) {
                //   arrProducts[i] = results[i];
                // }
                // console.log(arrProducts[0].id, arrProducts[0].productName);

                results.forEach(function(element) {
                    // console.log(element.productName);
                    arrProducts.push(element.id +'::'+element.productName);

                });
                //     console.log(arrProducts);
                //
                    inquirer.prompt([{
                        name: 'productName',
                        type: 'rawlist',
                        message: 'Please choose the product name you want to buy: ',
                        choices: arrProducts
                    }]).then(function(rawlist) {
                      var derivedName = rawlist.productName;
                      var derivedIdx = derivedName.indexOf('::');
                      var derivedId = derivedName.substring(0,derivedIdx)
                      console.log(rawlist.productName);
                      console.log(derivedId); // this will feed into the productId search function
                    });
                //
                //
                // // console.log("Product Name: " + results[0].productName);
                // // console.log("Available: " + results[0].quantityInStock);
                // // console.log("Price: " + results[0].buyPrice);
                connection.end();
            });
          ////
        }) //end then(function)
      }
    }) //end then(function)

}
// start();
purchase(112);
