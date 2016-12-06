//access node module resources
var prompt = require('prompt');
var Table = require('cli-table2');
var mysql = require('mysql');

//connect to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //db username
    password: "root", //db password
    database: "bamazon_db"
});

connection.connect(function (error) {
    if (error) throw error;
});


//collects and prepares data for table display
function viewProducts() {
    var table = new Table({
        head: ["Item ID", "Products", "Price", "Quantity"]
    });
    connection.query('SELECT * FROM Products', function (error, response) {
        if (error) throw error;
        for (var i = 0; i < response.length; i++) {
            table.push({
                [response[i].product_id]: [response[i].product_name, response[i].price, response[i].stock_quantity]
            });
        }
        console.log(table.toString());
        prompter(response);
        table = new Table({
            head: ["Item ID", "Products", "Price", "Quantity"]
        });

    });

}
//identifies and displays table data meeting < 10 criterion
function lowInventory() {
    var inv = new Table({
        head: ["Item ID", "Products", "Price", "Quantity"]
    });
    connection.query('SELECT * FROM Products WHERE stock_quantity < 10', function (error, response) {
        if (error) throw error;
        if (response.length > 0) {
            console.log("Here are your low inventory items: ");
            for (var i = 0; i < response.length; i++) {
                inv.push({
                    [response[i].product_id]: [response[i].product_name, response[i].price, response[i].stock_quantity]
                });
            }
            console.log(inv.toString());
            prompter();

        }

    });
}

//updates/adds to db inventory (display occurs via next function)
function addInventory(newQuant, currentProduct) {
    var updatedQuant = 0;
    connection.query('UPDATE Products SET ? WHERE ?', [{
    product_name: currentProduct
	}], function (error, response) {
        if (error) throw error;
        else {
            updatedQuant = parseInt(newQuant) + response[0].stock_quantity;
            executeChange(updatedQuant, currentProduct);
            viewProducts();
            prompter();
        }
    });
    
    //takes result from addInventory and displays new product quantity
    function executeChange(updatedQuant, currentProduct) {
        console.log("Thanks. There are now " + updatedQuant + " " + currentProduct + "'s in stock.");
        connection.query('UPDATE Products SET ? WHERE ?', [{
            stock_quantity: updatedQuant
		}, {
            product_name: currentProduct
		}], function (error, response) {});
    }

}
// adds new a product (row) to db of inventory
function addNew(newProduct, newDpt, newPrice, newStock) {
    connection.query('INSERT INTO Products SET ?', {
            product_name: newProduct,
            department_name: newDpt,
            price: newPrice,
            stock_quantity: newStock
        },

        function (error, response) {
            if (error) throw error;
        });
    viewProducts();
}
//begin big ass function
function prompter() {

    console.log("LOAD MANAGER ACCESS PANEL");

    var schema = {
        properties: {
            action: {
                description: 'Would you like to "view products", "view low inventory", "add inventory", "add new product" or "exit"?',
                required: true
            }
        }
    };

    //
    prompt.get(schema, function (error, reply) {
        var manage = reply.action.toLowerCase();
        if (manage === 'view products') {
            viewProducts();
        } else if (manage === 'view low inventory') {
            lowInventory();
        } else if (manage === 'add inventory') {
            var schema = {
                properties: {
                    item: {
                        description: 'Which item would you like to restock? (select item id#)',
                        required: true,
                    },
                    quantity: {
                        description: 'How many would you like to add?',
                        required: true
                    }
                }
            };
            prompt.get(schema, function (error, reply) {
                var arr = reply.item.split(" ");
                var thing = [];
                for (var i = 0; i < arr.length; i++) {
                    thing.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1));
                }
                var something = thing.join(" ");
                var numThing = reply.quantity;
                addInventory(numThing, something);
            });

        } else if (manage === 'add new product') {
            var schema2 = {
                properties: {
                    product: {
                        description: 'What do you want to add to the store?',
                        required: true,
                    },
                    dpt: {
                        description: 'What department is it in?',
                        required: true
                    },
                    price: {
                        description: 'How much does it cost?',
                        required: true
                    },
                    stock: {
                        description: 'How many would you like to add?'
                    }
                }
            };
            prompt.get(schema2, function (error, reply) {
                newProduct = reply.product;
                newDpt = reply.dpt;
                newPrice = reply.price;
                newStock = reply.stock;

                addNew(newProduct, newDpt, newPrice, newStock);
            });

        } else if (manage === 'exit') {
            process.exit();
        } else {
            console.log("You did not type that correctly.");
            prompter();
        }

    });

//close big ass function -- i.e., prompter() -- begun on line 117 
}

//call prompter
prompter();