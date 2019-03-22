var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require("cli-table3");

var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "27.77.26.207",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    //Calling for Table to be displayed in CLI terminal
    InventoryTable();
});

function InventoryTable() {

    //Defining Table with Headers for relevant table information
    var table = new Table({
        head: ['ID', "Product", "Price", "Stock"],
        colWidths: [10, 30, 30, 30]
    });

    //calling Inventory function below
    inventory();

    //Pulling MySQL table rows and setting them to vars for pushing to CLI table
    function inventory() {

        connection.query("SELECT * FROM products", function (err, results) {

            for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);
                var itemId = results[i].item_id;
                var product = results[i].product_name;
                var price = results[i].price;
                var stock = results[i].stock_quantity;

                // console.log(itemId);
                // console.log(product);
                // console.log(price);
                // console.log(stock);

                //Pushing infor to table for display
                table.push(
                    [itemId, product, price, stock]
                );
            }

            //Displaying table in terminal
            console.log(table.toString());
            purchaseItem();
        });
    }
}

function purchaseItem() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Enter the item ID of the product you would like to purchase."
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the quantity for the item you wish to purchase.",
            // validate: function validateNumb (answer) {
            //     if (isNaN(answer)) {
            //         console.log("Please enter a number.")
            //         return false;
            //     }
            // }
        }
    ])
    .then(function(answer) {

        connection.query("SELECT * FROM products WHERE item_id=?", answer.itemId, function(err, results) {
            for (var i = 0; i < results.length; i++) {
                if (answer.quantity > results[i].stock_quantity) {

                    console.log("Unable to complete request: NOT ENOUGH STOCK, please try again.");
                    purchaseItem();
                }else {
                    console.log(`Your order has been fulfilled.\nYour order:\n---------------------\nItem: ${results[i].product_name}\nQuantity: ${answer.quantity}`)
                    var newStock = (results[i].stock_quantity - answer.quantity);
                    var purchasedProduct = answer.itemId;
                }
            }

            

            updateProduct(newStock, purchasedProduct);
        })
    })

}


function updateProduct(newStock, purchasedProduct) {  
    var query = connection.query("UPDATE products SET ? WHERE ?", 
    [
        {
          stock_quantity: newStock
        },
  
        {
          item_id: purchasedProduct
        }
      ],
  
    );

    // console.log(query.sql);
  }
  