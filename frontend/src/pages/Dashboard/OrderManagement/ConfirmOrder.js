import React from 'react'
import './css/confirm_order.css'
import { useNavigate, useLocation } from 'react-router-dom'

const ConfirmOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetails } = location.state;
    const { shipping_address, phone_number } = orderDetails;
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div className="confirmation-container">
                <h1>🎉 Order Placed Successfully! 🎉</h1>
                <p>Thank you for your order! Your items will be delivered to:</p>

                <div className="details">
                    <p><strong>Delivery Address:</strong> {shipping_address}</p>
                    <p><strong>Phone Number:</strong> {phone_number}</p>
                </div>

                <div className="actions">
                    <button onClick={() => navigate('/')}>Return to Home</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmOrder