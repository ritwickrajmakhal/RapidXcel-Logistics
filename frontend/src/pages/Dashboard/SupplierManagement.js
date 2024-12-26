import { useState } from "react";

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([
        {
            id: 1,
            name: "Supplier 1",
            email: "supplier@gmail.com",
            phone: "1234567890",
            address: "123 Supplier St"
        },
        {
            id: 2,
            name: "Supplier 2",
            email: "suppler@gmail.com",
            phone: "1234567890",
            address: "123 Supplier St"
        }
    ]);
    const [mode, setMode] = useState("add");
    const [supplier, setSupplier] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    return (
        <div>
            <AddEditModal mode={mode} supplier={supplier} setSupplier={setSupplier} />
            <DeleteModal supplier={supplier} />
            <div className="d-flex justify-content-between align-items-center">
                <h1><u>Suppliers</u></h1>
                <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Supplier</button>
            </div>
            <table className="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">Supplier ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
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
                            <td>{supplier.phone}</td>
                            <td>{supplier.address}</td>
                            <td>
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setMode("edit"); setSupplier(supplier) }}>Edit</button>
                                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setSupplier(supplier)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const AddEditModal = ({ mode, supplier, setSupplier }) => (
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
                            <input type="text" className="form-control" id="name" value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={supplier.email} onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="tel" className="form-control" id="phone" value={supplier.phone} onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" value={supplier.address} onChange={(e) => setSupplier({ ...supplier, address: e.target.value })} />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => console.log(supplier)}>Save changes</button>
                </div>
            </div>
        </div>
    </div>
)

const DeleteModal = ({ supplier }) => (
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
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => console.log("Delete")}>Delete</button>
                </div>
            </div>
        </div>
    </div>
)
export default SupplierManagement