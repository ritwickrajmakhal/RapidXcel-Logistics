import { useState } from "react";

const SupplyOrders = () => {
    const [supplyOrders, setSupplyOrders] = useState([
        {
            id: 1,
            product_name: "Intel core i9",
            quantity: 10,
            total_cost: 1000000,
            status: "Dispatched",
            delivery_date: "2021-09-01"
        },
        {
            id: 2,
            product_name: "Intel core i9",
            quantity: 10,
            total_cost: 1000000,
            status: "Dispatched",
            delivery_date: "2021-09-01"
        }
    ]);
    return (
        <div>
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Update Order</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Update status</label>
                                <select className="form-select" id="status" aria-label="Default select example">
                                    <option defaultValue>Open this select menu</option>
                                    <option value="1">Order received</option>
                                    <option value="2">Processing</option>
                                    <option value="3">Dispatched</option>
                                    <option value="3">Delayed</option>
                                    <option value="3">Delivered</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deliveryDate" className="form-label">Update delivery date</label>
                                <input type="date" className="form-control" id="deliveryDate" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="mb-3"><u>Orders Overview</u></h1>
            <table className="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total Cost</th>
                        <th scope="col">Status</th>
                        <th scope="col">Delivery Date</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {supplyOrders.map((supplyOrder) =>
                        <tr key={supplyOrder.id}>
                            <td>{supplyOrder.id}</td>
                            <td>{supplyOrder.product_name}</td>
                            <td>{supplyOrder.quantity}</td>
                            <td>{supplyOrder.total_cost}</td>
                            <td>{supplyOrder.status}</td>
                            <td>{supplyOrder.delivery_date}</td>
                            <td>
                                <button type="button" className="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateModal">
                                    Update
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default SupplyOrders