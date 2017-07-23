# nodeStore

nodeStore is an online node/mysql store with inventory tracking and light weight sales performance metrics.

personas:
<br>(I)   customer (buyer) - person who performs a product purchase
<br>(II)  manager - person who can view and add inventory and measure sales performance
<br>III) supervisor - person who manages department (can add new department), view department sales performance

use cases:
customer - kicksoff a purchase and then presented by two inputs:
  <ul>(1) product id to purchase -- nodeStore checks inventory and if inventory = 0, then inform user the product is backorder</ul>
  <ul>(2) quantity to purchase (between 1 and inventory on hand).</ul>
    <ul>(a) If purchase quantity <= inventory, then finalize purchase; updates inventory and department product sales</ul>
    <ul>(b) If purchase quantity > intentory, then inform user there is insufficient quantity on hand and asks user to </ul>
      <ul>(i) adjust purchase quantity between 1 and inventory on hand; updates inventory and department product sales</ul>
      <ul>(ii) begin a new purchase</ul>

manager - can perform the following:
  <ul>(1) View Products for Sale; overall and by department</ul>
  <ul>(2) View Low Inventory</ul>
  <ul>(3) Add to Inventory</ul>
  <ul>(4) Add New Product</ul>
  <ul>(5) approve new department; if approved, new deparment status is set to active. if rejected, new department status is set to rejected</ul>
  
supervisor - can perform the following:
  <ul>(1) View Product Sales by Department</ul>
  <ul>(2) Create New Department; sets department status to pending and routes to manager for approval</ul>
