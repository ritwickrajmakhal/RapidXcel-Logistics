import React, { useState } from "react";
import { toast } from "react-toastify";

const SupplyProducts = ({ user }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [products, setProducts] = useState(user?.products);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    weight: 0.0,
    quantity: 0,
  });

  const clearModal = () => {
    setProduct({
      name: "",
      price: 0,
      weight: 0.0,
      quantity: 0,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/stock-replenishment/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...product, supplier_id: user?.id }),
        }
      );
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Product added successfully");
        setProducts([...products, data]);        
        document.getElementById("closeBtn").click();
        clearModal();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container my-5">
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Product
              </h1>
              <button
                type="button"
                id="closeBtn"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearModal}
              ></button>
            </div>
            <form onSubmit={addProduct}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-control"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Weight
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="form-control"
                    value={product.weight}
                    onChange={(e) =>
                      setProduct({ ...product, weight: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={product.quantity}
                    onChange={(e) =>
                      setProduct({ ...product, quantity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={clearModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Products</h1>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody id="product-table">
            {products?.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.weight} kg</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplyProducts;
