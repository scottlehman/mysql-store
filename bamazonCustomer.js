var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "27.77.26.207",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        purchaseQuery();
    })
};

function purchaseQuery() {
     
        inquirer.prompt([
            {
                name: "products",
                type: "rawlist",
                choices: function() {
                    var productsArray = [];

                    for(var i = 0; i < results.length; i++) {
                        productsArray.push(results[1]);

                    }
                    return productsArray;

                },
                message: "Which item would like to purchase today?"
            },
            {
            name: "order",
            type: "input",
            message: "How many would you like to on your order?",
            }
        ])
        .then(function(answer) {
            var item;
            var quantity = 0;

        })
    })
}