import React, { useState } from 'react';
import styles from './Home.module.css';
import { toast } from 'react-toastify';

const RegisterModal = (props) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function closeModal() {
        props.enableRegisterModal(false);
    }

    function switchtoLogin() {
        props.enableLoginModal(true);
        props.enableRegisterModal(false);
    }

    async function registerUser(event) {
        event.preventDefault();
        try {
            if (password === confirmPassword) {

                const response = await fetch(`${BACKEND_URL}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        role,
                        name,
                        email,
                        password
                    })
                })
                const data = await response.json();
                if (response.ok) {
                    toast.success("Registered Successfully");
                    closeModal();
                }
                else
                    toast.error(data.message);
            }
            else
                toast.error("Passwords do not match");
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={styles.modal} id="modal">
            <div className={styles.modal_content} id="modalContent">
                <h1>Register</h1>
                <form onSubmit={registerUser}>
                    <div className={styles.input_box}>
                        <select className='form-select' id="select your role" name="role" onChange={(e) => { setRole(e.target.value) }} required>
                            <option value="">select your role</option>
                            <option value="Inventory Manager">Inventory Manager</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Customer">Customer</option>
                            <option value="Courier Service">Courier Service</option>
                        </select>
                    </div>
                    <div className={styles.input_box}>
                        <input type="text" placeholder="Name" onChange={(e) => { setName(e.target.value) }} required />
                    </div>
                    <div className={styles.input_box}>
                        <input type="email" id="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} required />
                    </div>
                    <div className={styles.input_box}>
                        <input type="password" id="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} required />
                    </div>
                    <div className={styles.input_box}>
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" onChange={(e) => { setConfirmPassword(e.target.value) }} required />
                    </div>
                    <button type="submit" className={styles.manualbtn}>Register</button>
                    <div className={styles.register_link}>
                        <p>Already have an account? <button onClick={switchtoLogin} id="switchToLogin" className={styles.switchToRegister}>Login</button></p>
                    </div>
                </form>
                <span className={styles.close} onClick={closeModal} id="closeModal">&times;</span>
            </div>
        </div>
    );
}

export default RegisterModal;
