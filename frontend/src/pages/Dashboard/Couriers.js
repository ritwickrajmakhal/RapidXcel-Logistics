import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const Couriers = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const [couriers, setCouriers] = useState([]);
    useEffect(() => {
        const fetchCouriers = async () => {
            const response = await fetch(`${BACKEND_URL}/api/couriers`);
            const data = await response.json();
            setCouriers(data.couriers);
        };
        fetchCouriers();
    }, [BACKEND_URL]);

    return (
        <div>
            <h1>Couriers</h1>
            <Button variant="primary" className="mb-3">Create Courier</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {couriers.map((courier) => (
                        <tr key={courier.id}>
                            <td>{courier.id}</td>
                            <td>{courier.name}</td>
                            <td>{courier.status}</td>
                            <td>{new Date(courier.updated_at).toLocaleString()}</td>
                            <td>
                                <Button variant="info" size="sm">View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Couriers;