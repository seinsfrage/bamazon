//acess node modules
var prompt = require('prompt');
var Table = require('cli-table2');
var mysql = require('mysql');

//connect to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "root", 
    database: "bamazon_db"
})

//use products table data to generate table to be displayed
var table = new Table({ head: ["Item ID", "Product", "Price", "Quantity"] });
connection.connect(function(error) {
    if (error) throw error;
});

//query + for loop + push = CLI table display
function begin() {
	connection.query('SELECT * FROM products', function(error, response) {
		if(error) throw error;
		for(var i = 0; i < response.length; i++) {
			table.push(
				{ [response[i].product_id] : [response[i].product_name, response[i].price, response[i].stock_quantity] }
				);
		}
		console.log(table.toString());
		prompter(response);
		table = new Table({ head: ["Item ID", "Products", "price", "Quantity"] });

	});
}

function addSales(total, dpt, id) {
	var transaction = total;
	var dept = dpt;

	connection.query('UPDATE Departments SET total_sales = total_sales + ' + transaction + 'WHERE ?', [{
		departmanet_name
        : dept
	}], function(error, response) {
	});	



}
//initiates purchase questions
function prompter(response) {

  var schema = {
    properties: {
      id: {
      	description: 'Please enter the ID of the item you wish to buy',
      	message: 'Silly. Thats NaN.',
        pattern: /^\d+$/,
        required: true
      },
      quantity: {
      	description: 'Please enter a quantity',
      	pattern: /^\d+$/,
      	message: 'Thats NaN, dude.',
      	required: true
      }
    }
  };

	prompt.start(); 

	prompt.get(schema, function(error, reply) {

		var id = reply.id -1;
		var widget = response[reply.id - 1].product_name.trim();
		var quantity = response[reply.id - 1].stock_quantity;
		var requesting = reply.quantity;
		var price = response[reply.id - 1].price;
		var total = (price * requesting).toFixed(2);
		var dpt = response[reply.id - 1].departmanet_name;

        //ES6 fat arrow in effect, boyeeee!
		if(requesting <= quantity) {
			purchase(widget, requesting, quantity, reply, total);
			addSales(total, dpt, id);
		} else {
			console.log("I'm sorry, we're out of stock on that item' :(");
		}

	});
}

// executes purchase (modifies inventory and communicates with user)
function purchase(widget, requesting, quantity, reply, total) {
	connection.query("UPDATE Products SET ? WHERE ?", [{
    stock_quantity: quantity - requesting
}, 
    {
    product_name: widget
}], function(error, response) {
	console.log("Your purchase, totaling $" + total + ", has been completed.");
	purchaseAgain();
});


}

// initiate prompt
function purchaseAgain() {
	
  var schemas = {
    properties: {
        confirm: {
            pattern: /^(yes|no|y|n)$/gi,
            description: 'Would you like to place another order?',
            message: 'Type yes/no',
            required: true,

      }
    }
  }

  prompt.get(schemas, function(error, reply) {
  	var answer = reply.confirm.toLowerCase();
		if(answer === 'yes' || answer === 'y') {
			begin();
		}
		else {
			console.log("GOODBYE")
			process.exit();
		}

	})	
}

begin();

