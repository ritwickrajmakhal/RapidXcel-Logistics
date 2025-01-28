# RapidXcel Logistics: Inventory Management 

In logistics and supply chain management landscape, efficient tracking, inventory management, and seamless order fulfilment are key to business success. The Inventory Management System for RapidXcel logistics, a Third-Party Logistics (3PL) provider aims to streamline inventory management, order processing, shipment tracking, and reporting. This system will enhance the operational efficiency of logistics operations by automating inventory tracking, order fulfilment, and providing real-time updates to customers, suppliers, and internal staff.  
“Efficiency is doing things right; effectiveness is doing the right things”  
– Peter Drucker  

## Modules to Roll Out:
1.	User Authentication and Role Management:  Implement secure login, user roles, and permissions to ensure appropriate access control for customers, inventory manager, suppliers and courier service.
2.	Inventory Management: Manage stocks in the inventory and track stock levels.
3.	Order Management: Process orders placed by customers and calculate the shipping cost based on specified address and consignment weight.
4.	Courier Dashboard: Track and update the delivery status, ensuring the customers and admins are alerted in real time. 
5.	Supplier Management: Facilitate interaction with suppliers to manage stock replenishment and communicate on supply chain status.
6.	Reporting and Analytics: Provide data – driven insights to help inventory managers make informed decisions about inventory, sales and shipping performance.

### Module Breakdown:

#### 1. User Authentication and Role Management:
This module ensures secure access to the system by managing user authentication and defining different roles with tailored permissions.  
**Key Features:**
- **User Registration:**  New users (Inventory Manager, Customer, Supplier, Courier Service) should be able to create account with basic information such as email, password, name and role.
- **Secure Login:** Users should have secure access to their accounts. Implement a secure login system that authenticates users through their registered credentials.
- **Password Management:** Implement password recovery and reset features so that users can regain access to their account in case of forgotten credentials. (Frontend and Backend)
- **Role Based Access Control:** Differentiated access based on user roles:
  1. Inventory Manager: Full access to inventory, details of orders, details of suppliers and performance reports
  2. Customers: Limited access to place orders and track order status.
  3. Supplier: Limited access to monitor orders placed for supply and update the status.
  4. Courier Service: Limited access to track shipments, update delivery status, log delivery issues and alert the inventory manager regarding the same.

#### 2. Inventory Management
This module helps inventory managers track the inventory of products and including the ability to update stock levels.  
**Key Features:**
- **Stock Management:** Create and maintain stocks in the inventory which should include essential details such as stock ID, stock name, price, quantity, weight. Provide functionalities for inventory managers to add, update and delete details of the stock.
- **Stock Level Tracking:** Monitor inventory levels and alert the inventory managers in case of low stock to prevent stock-outs.

#### 3. Order Management
This module allows customers to place orders. It also calculates shipping cost based on delivery location and consignment weight.  
**Key Features:**
- **Product Overview:**  
  - Allows customers to view the available products and quantities. (Frontend)
  - Customers can select the required products and quantity. Then, place orders by entering delivery details such as delivery address along with pin code and phone number. (Frontend)
  - Displays a preview of the order placed by the customer which includes details such as selected products, total cost and shipping cost. (Frontend)
- **Pin code Validation:** Validates entered pin codes to ensure they are serviceable areas for delivery, enhancing the accuracy of shipping calculations.
- **Shipping Cost Calculation:** Automatically, calculates the shipping cost for each order based on delivery location and weight.

#### 4. Courier Dashboard
This module tracks the delivery status of orders and provides real-time updates for both customers and inventory managers.  
**Key Features:**
- **Orders Overview:** Enables the courier service and inventory managers to view all the orders that has been placed for delivery. The order details consist of Order ID, order date, delivery address, weight, items being delivered, shipping cost, expected delivery date and order status
- **Update Status:** Enables the courier service to update the status of the orders in real time(e.g., "In Transit", "Processing", "Delivered") .
- **Delivery Tracking:** Provides timely notification to the customers about the updated delivery status (Frontend)

#### 5. Supplier Management
This module facilitates communication with suppliers to manage stock replenishment, track supply chain status, and ensure the timely delivery of stock.  
**Key Features:**
- **Supplier Management:** Maintains detailed supplier records, including Supplier ID, name, email, phone number and address. Allows the inventory manager, who oversees supplier information, to add, update, and delete supplier records as necessary to ensure the integrity and up-to-date status of the supplier database. 
- **Stock Replenishment:** Enables inventory manager to place orders for stock replenishment by selecting desired products and required quantity.
- **Supply Orders Overview:** Enables suppliers to view a comprehensive list of details of all the placed orders such as supply order ID, product name, quantity, total cost and status.
- **Update Order Status:** Enables supplier to update the status of the orders (e.g., ‘dispatched’, ‘delayed’, ‘processing’, ‘order received’) and expected delivery time.
- **Supply Chain Status Tracking:** Allows inventory managers to track the progress of orders with suppliers i.e. view the status of orders and their expected delivery timelines.  
(Backend)

#### 6. Reporting and Analytics
This module provides data-driven insights into inventory levels, order fulfilment, and sales, helping inventory managers make informed decisions.  
**Key Features:**
- **Inventory Reports:**
  - **Stock Levels & Replenishment Needs:** A visual dashboard displaying current stock levels, highlighting low stock items that need replenishment.
  - **Supplier Stock Distribution:** A stacked bar chart representing the various products supplied by each supplier.
- **Order Performance and Demand Analysis:**
  - **Order Fulfilment Rate:** A line or bar chart displaying the percentage of orders fulfilled on time versus delayed, helping track fulfilment efficiency.
  - **Order Volume Trends:** A line or bar chart displaying the total number of orders received over time (e.g., daily, weekly, monthly), helping track demand fluctuations and plan for inventory and staffing needs. 
- **Sales and Product Analytics:**
  - **Product Sales Trends:** A line or bar chart displaying the sales trends of individual products, identifying bestsellers, low performers, and seasonal fluctuations.
  - **Profit and Loss Reports:** A detailed breakdown of profits and losses over time, helping track revenue.  
Implement backend with real time data from database (Require to edit database schema, e.g: adding date time field to each order) and frontend.

#### Sample Figma Screens:
Note: The attached sample wireframes are provided for reference only, and not all screens are included. You are encouraged to incorporate your creativity and innovation into the design.

![Picture1](https://github.com/user-attachments/assets/e3830619-e912-427c-b044-d990fc43816a)
![Picture2](https://github.com/user-attachments/assets/eee2ce0b-b1de-4266-afae-aecae8b32a55)
![Picture3](https://github.com/user-attachments/assets/2fee623b-eef1-480e-92b4-3acd386c8420)
![Picture4](https://github.com/user-attachments/assets/b55d6537-db6a-406b-8522-00085026383a)
![Picture5](https://github.com/user-attachments/assets/b4f2f93e-6856-4cf1-9283-d60dc2074db7)

---

## Artifacts to be Done During the Project Phase:

### Project Launch Document:

- Objectives and Business Scope
- Project Team
- UI Design Mockups
- Database design
- Use case Diagrams
- Class Diagram
- Test Cases

---

### Technology Stack:

- **Framework:** Flask
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python
- **Visualization:** Matplotlib/Seaborn/Plotly 
- **Database:** SQLAlchemy for ORM with SQLite3
- **Testing:** Unittest/Pytest

---

### Milestones: 

| Week | Milestone                                   | Deliverables                                                                                 |
|------|---------------------------------------------|---------------------------------------------------------------------------------------------|
| 1    | Project Launch Document                    | Completed Project Launch Document                                                          |
| 2    | Flask Setup, Database Design, UI Design    | Application setup, database schema, wireframes/mockups                                      |
| 3    | User Authentication and role management    | Implemented user registration and secure login. Set up role-based access control            |
| 4    | Inventory Management                       | Stock management features. Stock level tracking and low stock alert implementation          |
| 5    | Order Management and Courier Dashboard     | Order placement, pin code validation, shipping cost, courier dashboard implementation        |
| 6    | Supplier Management                        | Stock replenishment orders, supplier dashboards, supply order tracking                      |
| 7    | Reporting and Analytics                    | Inventory reports, sales trends, and performance metrics implementation                     |
| 8    | Testing and Deployment                     | Unit testing, end-to-end testing, and application deployment                                |
