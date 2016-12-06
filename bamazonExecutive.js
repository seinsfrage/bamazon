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

connection.connect(function(err) {
    if (err) throw err;
});

//creates table

function viewProducts() {
	var table = new Table({ head: ["Item ID", "Products", "Price", "Quantity"] });
	connection.query('SELECT * FROM Products', function(err, res) {
			if(err) throw err;
			for(var i = 0; i < res.length; i++) {
				table.push(
					{ [res[i].product_id] : [res[i].product_name, res[i].price, res[i].stock_quantity] }
					)
			}
			console.log(table.toString());
			prompter(res)
			table = new Table({ head: ["Item ID", "Products", "Price", "Quantity"] });

		})
}

//creates a table alias and shows info about department 
function viewByDpt(dpt) {
	var table = new Table({ head: ["Item ID", "DepartmentName", "OverHeadCosts", "TotalSales", "TotalProfit"] });
	connection.query('SELECT * FROM Departments AS alias WHERE ?', {
		department_name: dpt
	}, function(err, res) {
		if(err) throw err;
		for(var i = 0; i < res.length; i++) {
			var profit = (res[i].total_sales - res[i].overhead_costs).toFixed(2);
			table.push(
				{ [res[i].department_id] : [res[i].department_name, res[i].overhead_costs, res[i].total_sales, profit] }
				)
		}
			console.log(table.toString());
			prompter();
	})
}
//creates new department
function newDpt(nDpt) {
	var nDpt = nDpt;
	connection.query('INSERT INTO Departments SET ?', {
		department_name: nDpt,
		overhead_costs: 10000,
	}, function(err, res) {});
	prompter();
}

//begins asking questions
function prompter() {

console.log("LOAD EXECUTIVE ACCESS PANEL");

  var schema = {
    properties: {
      action: {
      	description: 'Would you like to view sales by department, create new department or exit?',
        required: true
      }
    }
  }

	prompt.get(schema, function(err, reply) {
		var manage = reply.action.toLowerCase();
		if(manage == 'sales') {
			var schema2 = {
			    properties: {
			        dpt: {
			            description: 'Which department? Home, Pets or Young Adult?',
			            required: true,
			      }
			    }
			  }
			prompt.get(schema2, function(err, rep) {
				thisDpt = rep.dpt;
				viewByDpt(thisDpt);
			})
		} else if(manage == 'create new department') {
			var schema2 = {
				properties: {
					newDpt: {
						description: 'What department do you want to create?',
						required: true,
					}
				}
			}
		 
			  prompt.get(schema2, function(err, reply) {
			  	var name = reply.newDpt;
			  	newDpt(name);
				})	
			} else if(manage == 'exit') {
				process.exit();
			}
			
		}) 
};

//starts questions
prompter();


