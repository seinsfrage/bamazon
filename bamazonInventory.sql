CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE Products(


product_id INT NOT NULL AUTO_INCREMENT,

product_name VARCHAR(50) NOT NULL,

department_name VARCHAR(50) NOT NULL,

price INTEGER(255) NOT NULL,

stock_quantity INTEGER(150) NOT NULL,

PRIMARY KEY (product_id)

);

INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Web Fluid", "Accessories", 25, 12);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Red Cape", "Accessories", 39, 20);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Magic Lasso", "Accessories", 20, 4);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Eye of Agamotto", "Accessories", 100, 16);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Winged Helmet ", "Accessories", 70, 4);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Adamantium Claw Polish", "Essentials", 12, 20);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Purple Pants", "Essentials", 30, 60);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Vibranium Shield ", "Essentials", 100, 25);
INSERT INTO Products(product_name, department_name, price, stock_quantity) 
VALUE("SR-71 Blackbird", "Essentials", 999, 10);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE("Black Cape and Cowl", "Essentials", 50, 12);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Assorted Arrows Green", "Weapons", 100, 25);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Mystic Hammer", "Weapons", 400, 7);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Bat-Shaped Boomerangs","Weapons", 20, 40);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Hulk Buster Armor", "Weapons", 799, 10);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE ("Power Ring", "Weapons", 200, 25);
INSERT INTO Products (product_name, department_name, price, stock_quantity) 
VALUE("Witchblade", "Weapons", 179, 17);

SELECT * FROM Products;