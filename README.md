# nodeStore

nodeStore is an online node/mysql store with inventory tracking and light weight sales performance metrics.

personas:
<br>1 customer (buyer) - person who performs a product purchase
<br>2 manager - person who can view and add inventory and measure sales performance
<br>3 supervisor - person who manages department (can add new department), view department sales performance

use cases:
customer - kicksoff a purchase and then presented by two inputs:
  <br>1 product id to purchase -- nodeStore checks inventory and if inventory = 0, then inform user the product is backorder
  <br>2 quantity to purchase (between 1 and inventory on hand)
    <br>2.1 If purchase quantity <= inventory, then finalize purchase; updates inventory and department product sales
    <br>2.2 If purchase quantity > intentory, then inform user there is insufficient quantity on hand and asks user to
      <br>2.2.1 adjust purchase quantity between 1 and inventory on hand; updates inventory and department product sales
      <br>2.2.2 begin a new purchase

manager - can perform the following:
  <br>1 View Products for Sale; overall and by department
  <br>2 View Low Inventory
  <br>3 Add to Inventory
  <br>4 Add New Product
  <br>5 Approve new department; if approved, new deparment status is set to active. if rejected, new department status is set to rejected
  
supervisor - can perform the following:
  <br>1 View Product Sales by Department
  <br>2 Create New Department; sets department status to pending and routes to manager for approval

screenshots: please see https://github.com/deffractedmind/nodeStore/blob/master/bamazonScreenShots.pdf
