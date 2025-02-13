import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddStock = ({ user, setUser }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [alert, setalert] = useState({ type: "success", msg: "Default", status: false });


    const addStock = async (event) => {
        event.preventDefault();
        const res = await fetch(`${BACKEND_URL}/api/stocks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                inventory_manager_id: user.id,
                name,
                price,
                quantity,
                weight
            })
        })

        const data = await res.json();
        if(res.ok){
            setUser((prev) => {
                const newStock = [...prev.stocks, data.stock];
                return { ...prev, stocks: newStock };
            });
            toast.success(data.message);
            navigate('/dashboard/stock-management');
        }
        else {
            setalert({
                type: "danger",
                msg: data.message,
                status: true
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setalert({ status: false })
        }, 3000)
    }, [alert.status]);

    return (
        <div className='container my-5'>
            <h2 className='my-3' align="center" style={{ "textDecoration": "underline" }}>Add Stock</h2>
            {alert.status && <Alert type={alert.type} msg={alert.msg} />}
            <form onSubmit={addStock}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label"><strong>Stock Name</strong></label>
                    <input type="text" name='name' className="form-control" id="name" value={name} onChange={(event) => { setName(event.target.value) }} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label"><strong>Stock Price ($)</strong></label>
                    <input type="number" min={0} step="0.01" name='price' className="form-control" id="price" value={price} onChange={(event) => { setPrice(event.target.value) }} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label"><strong>Stock Quantity</strong></label>
                    <input type="number" name="quantity" min={0} className="form-control" id="quantity" value={quantity} onChange={(event) => { setQuantity(event.target.value) }} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="weight" className="form-label"><strong>Stock Weight (kg)</strong></label>
                    <input type="number" name='weight' min={0} step="0.01" className="form-control" id="weight" value={weight} onChange={(event) => { setWeight(event.target.value) }} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddStock;
