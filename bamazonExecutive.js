
var prompt = require('prompt');
var Table = require('cli-table2');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "password", //Your password
    database: "BamazonDB"
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
					{ [res[i].ItemID] : [res[i].ProductName, res[i].Price, res[i].StockQuantity] }
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
		DepartmentName: dpt
	}, function(err, res) {
		if(err) throw err;
		for(var i = 0; i < res.length; i++) {
			var profit = (res[i].TotalSales - res[i].OverHeadCosts).toFixed(2);
			table.push(
				{ [res[i].DepartmentID] : [res[i].DepartmentName, res[i].OverHeadCosts, res[i].TotalSales, profit] }
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
		DepartmentName: nDpt,
		OverheadCosts: 10000,
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
			var schrema = {
			    properties: {
			        dpt: {
			            description: 'Which department? Home, Pets or Young Adult?',
			            required: true,
			      }
			    }
			  }
			prompt.get(schrema, function(err, rep) {
				thisDpt = rep.dpt;
				viewByDpt(thisDpt);
			})
		} else if(manage == 'create new department') {
			var schrema = {
				properties: {
					newDpt: {
						description: 'What department do you want to create?',
						required: true,
					}
				}
			}
		 
			  prompt.get(schrema, function(err, reply) {
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


