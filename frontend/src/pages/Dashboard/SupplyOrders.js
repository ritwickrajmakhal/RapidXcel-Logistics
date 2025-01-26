import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupplyOrders = ({ user }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [replenishmentOrders, setReplenishmentOrders] = useState(
    user.role === "Inventory Manager"
      ? [...user?.replenishment_orders].reverse()
      : [...user?.supply_orders].reverse()
  );

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [status, setStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Update order status or delivery date
  const handleUpdateOrder = async () => {
    if (!status && !deliveryDate) {
      toast.error("Please update at least one field (status or delivery date).");
      return;
    }

    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (deliveryDate) {
        const localDate = new Date(deliveryDate);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
        updatedFields.expected_delivery_time = utcDate;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/replenishment-orders/${selectedOrderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(updatedFields),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setReplenishmentOrders((orders) =>
          orders.map((order) =>
            order.id === selectedOrderId ? { ...order, ...data.order } : order
          )
        );
        toast.success(data.message);
        setStatus("");
        setDeliveryDate("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="my-5">
      {/* Modal for Updating Orders */}
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Order
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Update Status
                </label>
                <select
                  className="form-select"
                  id="status"
                  aria-label="Default select example"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Order Received">Order Received</option>
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="deliveryDate" className="form-label">
                  Update Delivery Date
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateOrder}
                data-bs-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Orders Table */}
      <h1 className="mb-4 text-primary">Supply Orders</h1>
      {replenishmentOrders.length === 0 ? (
        <p>No supply orders found.</p>
      ) : (
        <table className="table table-hover table-bordered table-responsive table-striped">
          <thead className="table-dark">
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Products</th>
              <th scope="col">Total Quantity</th>
              <th scope="col">Total Cost</th>
              <th scope="col">Address</th>
              <th scope="col">Mobile</th>
              <th scope="col">Status</th>
              <th scope="col">Expected Delivery</th>
              {user?.role === "Supplier" && <th scope="col">Action</th>}
            </tr>
          </thead>
          <tbody>
            {replenishmentOrders.map((supplyOrder) => {
              const totalCost = supplyOrder.order_items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );
              const totalQuantity = supplyOrder.order_items.reduce(
                (acc, item) => acc + item.quantity,
                0
              );

              return (
                <tr key={supplyOrder.id}>
                  <td>{supplyOrder.id}</td>
                  <td>
                    <ul className="list-unstyled">
                      {supplyOrder.order_items.map((item) => (
                        <li key={item.product_id}>
                          <strong>{item.product_name}</strong>: {item.quantity}{" "}
                          units @ ${item.price.toFixed(2)} each
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{totalQuantity}</td>
                  <td>${totalCost.toFixed(2)}</td>
                  <td>{supplyOrder.address}</td>
                  <td>{supplyOrder.mobile_number}</td>
                  <td>{supplyOrder.status}</td>
                  <td>
                    {supplyOrder?.expected_delivery_time ||
                      "Waiting for update"}
                  </td>
                  {user?.role === "Supplier" && (
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#updateModal"
                        onClick={() => {
                          setSelectedOrderId(supplyOrder.id);
                          setStatus(supplyOrder.status || "");
                          setDeliveryDate(
                            supplyOrder.expected_delivery_time || ""
                          );
                        }}
                      >
                        Update
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupplyOrders;
