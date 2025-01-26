import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const StockReplenishment = ({ user }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [managerAddress, setManagerAddress] = useState("");
  const [managerMobile, setManagerMobile] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/suppliers`, {
          credentials: "include",
        });
        const suppliers = await res.json();
        setSuppliers(suppliers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuppliers();
    const fetchProducts = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/stock-replenishment/products`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, quantity) => {
    if (quantity <= 0 || quantity > product.quantity) {
      toast.warn("Please enter a valid quantity.");
      return;
    }

    setCart([...cart, { ...product, quantity }]);
    toast.success(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    toast.info("Item removed from the cart.");
  };

  const isInCart = (id) => cart.some((item) => item.id === id);

  const handlePlaceOrder = async () => {
    if (!managerAddress || !managerMobile) {
      toast.warn("Please fill out both the address and mobile number.");
      return;
    }
    if(cart.length === 0) {
      toast.warn("Please add items to the cart.");
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/replenishment-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          inventory_manager_id: user.id,
          supplier_id: parseInt(selectedSupplier),
          address: managerAddress,
          mobile_number: managerMobile,
          items: cart.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            weight: item.weight,
            price: item.price,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCart([]);
        toast.success(data.message);
        document.getElementById('closeCartModal').click();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const filteredProducts = selectedSupplier
    ? products.filter(
        (product) => product.supplier_id === parseInt(selectedSupplier)
      )
    : [];

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h1>Stock Replenishment</h1>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="managerAddress" className="form-label">
              Manager's Address
            </label>
            <input
              type="text"
              className="form-control"
              id="managerAddress"
              placeholder="Enter manager's address"
              value={managerAddress}
              onChange={(e) => setManagerAddress(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="managerMobile" className="form-label">
              Manager's Mobile Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="managerMobile"
              placeholder="Enter mobile number"
              value={managerMobile}
              onChange={(e) => setManagerMobile(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#cartModal"
        >
          <i className="fa-solid fa-cart-shopping"></i> ({cart.length})
        </button>
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          aria-label="Default select example"
          value={selectedSupplier}
          onChange={(e) => {
            setSelectedSupplier(e.target.value);
            setCart([]);
          }}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center">No products available for this supplier.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Available Quantity</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    placeholder="Quantity"
                    className="form-control"
                    id={`quantity-${product.id}`}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    disabled={isInCart(product.id)}
                    onClick={() =>
                      handleAddToCart(
                        product,
                        parseInt(
                          document.getElementById(`quantity-${product.id}`)
                            .value
                        ) || 0
                      )
                    }
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Cart Modal */}
      <div
        className="modal fade modal-lg"
        id="cartModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Cart
              </h1>
              <button
                type="button"
                id='closeCartModal'
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p>No items in the cart yet.</p>
              ) : (
                <table className="table table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReplenishment;
