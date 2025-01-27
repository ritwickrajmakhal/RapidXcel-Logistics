import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Alert from './Alert';
import "./css/StockManagement.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DashboardMetrics from './DashboardMetrics';

const StockManagement = ({ user, setUser }) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [alert, setalert] = useState({ status: false, type: "success", msg: "Default Alert" });

    async function deleteStock(id) {
        try {
            const res = await fetch(`${BACKEND_URL}/api/stocks/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            })

            const data = await res.json();
            if(res.ok){
                setUser((prev) => {
                    const newStocks = prev.stocks.filter((stock) => stock.stock_id !== id);
                    return { ...prev, stocks: newStocks };
                });
                setalert({
                    status: true,
                    type: "success",
                    msg: data.message
                })
            }
            else {
                setalert({
                    status: true,
                    type: "danger",
                    msg: data.error
                })
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setalert({ status: false })
        }, 3000);
    }, [alert.status]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (user?.stocks.length <= 5) {
                setalert({
                    status: true,
                    type: "danger",
                    msg: "Low Stocks Level"
                })
            }
        }, 5000)

        return () => {
            clearInterval(interval)
            setalert({
                status: false
            })
        };
    }, [user?.stocks.length]);

    return (
        <div className='orders-table'>
            <div className='header'>
                <h2>Stock Management</h2>
                <Link className="btn btn-primary" to="/dashboard/stock-management/addStock">Add Stock</Link>
            </div>
            <DashboardMetrics />
            {alert.status && <Alert type={alert.type} msg={alert.msg} />}
            <div className='table-container'>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">Stock Id</th>
                            <th scope="col">Stock Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Weight</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user?.stocks.map((stock) => {
                            return (
                                <tr key={stock.stock_id}>
                                    <td>{stock.stock_id}</td>
                                    <td>{stock.stock_name}</td>
                                    <td>{stock.price}</td>
                                    <td>{stock.quantity}</td>
                                    <td>{stock.weight}</td>
                                    <td className='actions'>
                                        <button className='delete-btn' onClick={() => { deleteStock(stock.stock_id) }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button className='edit-btn'>
                                            <Link className='edit-btn' to={`/dashboard/stock-management/updateStock/${stock.stock_id}`} >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
            {!user?.stocks && <Loader />}
        </div>
    );
}

export default StockManagement;
