import React,{ useState,useEffect } from 'react';
import Alert from './Alert';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateStock = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const params = useParams();
    const [stock, setStock] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [alert, setalert] = useState({type:"success",msg:"Default",status:false});

    const updateStock = async (event) => {
        event.preventDefault();
        const res = await fetch(`${BACKEND_URL}/api/stocks/${params.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: 'include',
            body:JSON.stringify({
                name,
                price,
                quantity,
                weight
            })
        })
        
        const data = await res.json();
        if(res.ok) {
            setalert({
                type: "success",
                msg: data.message,
                status:true
            });
            setTimeout(() => {
                navigate("/dashboard/stock-management");
            },2000);
        }
        else {
            setalert({
                type: "danger",
                msg: data.error,
                status:true
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setalert({status:false})
        },2000)
    }, [alert.status]);

    useEffect(() => {
        const getStockbyID = async () => {
            const res = await fetch(`${BACKEND_URL}/api/stocks/${params.id}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setStock(data);
        }
        getStockbyID();
    }, [BACKEND_URL, params.id]);

    useEffect(() => {
      if(stock != null){       
        setName(stock.stock_name);
        setPrice(stock.price);
        setQuantity(stock.quantity);
        setWeight(stock.weight);
      }
    }, [stock]);

  return (
      <div className='container my-5'>
        <h2 className='my-3' align="center" style={{"textDecoration":"underline"}}>Update Stock</h2>
        {alert.status &&  <Alert type={alert.type} msg={alert.msg} />}
        <form onSubmit={updateStock}>

            <div className="mb-3">
                <label htmlFor="name" className="form-label">Stock Name</label>
                <input type="text" name='name' className="form-control" id="name" value={name} onChange={(event) => { setName(event.target.value) }} />
            </div>
            
            <div className="mb-3">
                <label htmlFor="price" className="form-label">Stock Price</label>
                <input type="number" step="0.01" min={0} name='price' className="form-control" id="price" value={price} onChange={(event) => { setPrice(event.target.value) }} />
            </div>
            
            <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Stock Quantity</label>
                <input type="number" min={0} name="quantity" className="form-control" id="quantity" value={quantity} onChange={(event) => { setQuantity(event.target.value) }} />
            </div>
            
            <div className="mb-3">
                <label htmlFor="weight" className="form-label">Stock Weight</label>
                <input type="number" min={0} name='weight' className="form-control" id="weight" value={weight} onChange={(event) => { setWeight(event.target.value) }} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
    </div>
  );
}

export default UpdateStock;
