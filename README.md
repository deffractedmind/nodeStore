# nodeStore

nodeStore is an online node/mysql store with inventory tracking and light weight sales performance metrics.

personas:
(I)   customer (buyer) - person who performs a product purchase
(II)  manager - person who can view and add inventory and measure sales performance
(III) supervisor - person who manages department (can add new department), view department sales performance

use cases:
customer - kicksoff a purchase and then presented by two inputs:
  (1) product id to purchase -- nodeStore checks inventory and if inventory = 0, then inform user the product is backorder
  (2) quantity to purchase (between 1 and inventory on hand).
    (a) If purchase quantity <= inventory, then finalize purchase; updates inventory and department product sales
    (b) If purchase quantity > intentory, then inform user there is insufficient quantity on hand and asks user to 
      (i) adjust purchase quantity between 1 and inventory on hand; updates inventory and department product sales
      (ii) begin a new purchase

manager - can perform the following:
  (1) View Products for Sale; overall and by department
  (2) View Low Inventory
  (3) Add to Inventory
  (4) Add New Product
  (5) approve new department; if approved, new deparment status is set to active. if rejected, new department status is set to rejected
  
supervisor - can perform the following:
  (1) View Product Sales by Department
  (2) Create New Department; sets department status to pending and routes to manager for approval
