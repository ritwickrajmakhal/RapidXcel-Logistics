import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SupplierManagement = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [suppliers, setSuppliers] = useState([]);
    const [mode, setMode] = useState("add");
    const [supplier, setSupplier] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/suppliers`);
                const suppliers = await res.json();
                setSuppliers(suppliers);
            }
            catch (err) {
                console.error(err);
            }
        }
        fetchSuppliers();
    }, [BACKEND_URL]);

    const validateForm = () => {
        const newErrors = {};
        if (!supplier.name) newErrors.name = "Name is required";
        if (!supplier.email) newErrors.email = "Email is required";
        if (!supplier.phone_number) newErrors.phone_number = "Phone number is required";
        if (!supplier.address) newErrors.address = "Address is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddEditSupplier = async () => {
        if (!validateForm() && mode === "add") return;
        try {
            const method = mode === "add" ? "POST" : "PUT";
            const url = mode === "add" ? `${BACKEND_URL}/api/suppliers` : `${BACKEND_URL}/api/suppliers/${supplier.id}`;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(supplier)
            });
            const data = await res.json();
            if (mode === "add") {
                setSuppliers([...suppliers, data.supplier]);
                toast.success(data.message);
            } else {
                setSuppliers(suppliers.map(s => s.id === data.supplier.id ? data.supplier : s));
                toast.success(data.message);
            }
            setErrors({});
            document.getElementById('closeAddEditModalBtn').click(); // Close modal
        } catch (err) {
            toast.error(err);
        }
    };

    const handleDeleteSupplier = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/suppliers/${supplier.id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            setSuppliers(suppliers.filter(s => s.id !== supplier.id));
            document.getElementById('closeDeleteModalBtn').click(); // Close modal
            toast.success(data.message);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <AddEditModal mode={mode} supplier={supplier} setSupplier={setSupplier} handleAddEditSupplier={handleAddEditSupplier} errors={errors} />
            <DeleteModal supplier={supplier} handleDeleteSupplier={handleDeleteSupplier} />
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-3"><u>Suppliers</u></h1>
                <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setMode("add"); setSupplier({ name: "", email: "", phone_number: "", address: "" }) }}>Add Supplier</button>
            </div>
            <table className="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">Supplier ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Address</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.phone_number}</td>
                            <td>{supplier.address}</td>
                            <td>
                                <button type="button" className="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setMode("edit"); setSupplier(supplier) }}>
                                    <i className="fa-solid fa-user-pen"></i> Edit
                                </button>
                                <button type="button" className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setSupplier(supplier)}>
                                    <i className="fa-solid fa-user-xmark"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const AddEditModal = ({ mode, supplier, setSupplier, handleAddEditSupplier, errors }) => (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{mode === "add" ? "Add Supplier" : "Edit Supplier"}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} required />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={supplier.email} onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} required />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone_number" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="phone_number" value={supplier.phone_number} onChange={(e) => setSupplier({ ...supplier, phone_number: e.target.value })} required />
                            {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" value={supplier.address} onChange={(e) => setSupplier({ ...supplier, address: e.target.value })} required />
                            {errors.address && <div className="text-danger">{errors.address}</div>}
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" id="closeAddEditModalBtn" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddEditSupplier}>Save changes</button>
                </div>
            </div>
        </div>
    </div>
)

const DeleteModal = ({ supplier, handleDeleteSupplier }) => (
    <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="deleteModalLabel">Delete Supplier</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete {supplier.name}?
                </div>
                <div className="modal-footer">
                    <button type="button" id="closeDeleteModalBtn" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteSupplier}>Delete</button>
                </div>
            </div>
        </div>
    </div>
)

export default SupplierManagement