import { useState, useEffect, } from "react";
import "./css/styles.css";
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    customer_id: JSON.parse(localStorage.getItem('user')).id,
    shipping_address: "",
    pin_code: "",
    location_type: "",
    phone_number: "",
    items: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${BACKEND_URL}/api/stocks`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, [BACKEND_URL]);

  const handleInputChange = (e, product) => {
    const { value } = e.target;
    setOrderDetails((prevDetails) => {
      const items = prevDetails.items.filter((item) => item.product_id !== product.stock_id);
      if (value > 0) {
        items.push({ product_id: product.stock_id, product_name: product.stock_name, quantity: value, weight: product.weight, price: product.price });
      }
      return { ...prevDetails, items };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { shipping_address, pin_code, location_type, phone_number, items } = orderDetails;

    if (!shipping_address || !pin_code || !phone_number || items.length === 0 || !location_type) {
      alert("Please fill in all required fields and add at least one product.");
      return;
    }

    navigate("/dashboard/products/order-preview", { state: { orderDetails } });
  };

  return (
    <div className="products-container my-5">
      <h1 className="text-center mb-4">Product Overview</h1>
      <form onSubmit={handleSubmit}>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Weight</th>
                <th>Quantity Available</th>
                <th>Quantity to Order</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.stock_id}>
                  <td>{product.stock_name}</td>
                  <td>${product.price}</td>
                  <td>{product.weight}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max={product.quantity}
                      value={
                        orderDetails.items.find((item) => item.product_id === product.stock_id)?.quantity || 0
                      }
                      onChange={(e) => handleInputChange(e, product)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-3">
          <label htmlFor="delivery_address" className="form-label">
            Delivery Address:
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            className="form-control"
            rows="2"
            value={orderDetails.shipping_address}
            onChange={(e) => setOrderDetails({ ...orderDetails, shipping_address: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="pin_code" className="form-label">
            Pin Code:
          </label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            className="form-control"
            value={orderDetails.pin_code}
            onChange={(e) => setOrderDetails({ ...orderDetails, pin_code: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Location Type:
          </label>
          <select class="form-select" aria-label="Default select example" required onChange={(e) => setOrderDetails({ ...orderDetails, location_type: e.target.value })}>
            <option selected>Select Location Type</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Phone Number:
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            className="form-control"
            value={orderDetails.phone_number}
            onChange={(e) => setOrderDetails({ ...orderDetails, phone_number: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Products;