import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderPreview = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetails } = location.state;
    const { shipping_address, pin_code, location_type, phone_number, items } = orderDetails;

    const base_cost = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const total_weight = items.reduce((total, item) => total + item.weight * item.quantity, 0);
    const [shipping_cost, setShipping_cost] = useState(0);
    const [totalCost, setTotalCost] = useState(base_cost);

    useEffect(() => {
        const fetchShippingCost = async () => {
            const res = await fetch(`${BACKEND_URL}/api/orders/get-shipping-cost?total_weight=${total_weight}&location_type=${location_type}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setShipping_cost(data.shipping_cost);
            setTotalCost(base_cost + data.shipping_cost);
        };
        fetchShippingCost();
    }, [total_weight, base_cost, pin_code, BACKEND_URL, location_type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderDetails),
        });
        const data = await res.json();
        console.log(data);

        if (res.ok) {
            navigate('/dashboard/products/confirm-order', { state: { orderDetails } });
        } else {
            alert(data.error);
        }
    }
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Order Preview</h1>

            <div className="mb-3">
                <p><strong>Delivery Address:</strong> {shipping_address}</p>
                <p><strong>Pin Code:</strong> {pin_code}</p>
                <p><strong>Phone Number:</strong> {phone_number}</p>
                <p><strong>Location Type:</strong> {location_type}</p>
                <p><strong>Total Weight:</strong> {total_weight} kg</p>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Product</th>
                            <th>Quantity Ordered</th>
                            <th>Weight</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.quantity} X {item.weight} kg = {item.quantity * item.weight} kg</td>
                                <td>{item.quantity} X ${item.price} = ${item.quantity * item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-3">
                <h3>Total Cost: ${base_cost?.toFixed(2)}</h3>
                <h3>Shipping Cost: ${shipping_cost.toFixed(2)}</h3>
                <h2>Grand Total: ${totalCost.toFixed(2)}</h2>
            </div>

            <form className="text-center" onSubmit={handleSubmit}>
                <input type="hidden" name="shipping_address" value={shipping_address} />
                <input type="hidden" name="pin_code" value={pin_code} />
                <input type="hidden" name="phone_number" value={phone_number} />
                <input type="hidden" name="location_type" value={location_type} />
                <input type="hidden" name="total_weight" value={total_weight} />
                <button type="submit" className="btn btn-success">Confirm Order</button>
            </form>
        </div>
    );
};

export default OrderPreview;