import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { toast } from "react-toastify";

const LoginModal = (props) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function closeModal() {
        props.enableLoginModal(false);
    }

    function switchtoRegister() {
        props.enableLoginModal(false);
        props.enableRegisterModal(true);

    }

    async function loginUser(event) {
        event.preventDefault();
        try {

            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            })

            if (response.ok) {
                toast.success("Logged in Successfully");
                navigate('/dashboard');
            }
            else
                toast.error("Invalid email or password");

        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <div className={styles.modal} id="modal">
                <div className={styles.modal_content} id="modalContent">
                    <h1>Login</h1>
                    <form onSubmit={loginUser}>
                        <div className={styles.input_box}>
                            <input type="text" placeholder="Email" onChange={(event) => { setEmail(event.target.value) }} required />
                        </div>
                        <div className={styles.input_box}>
                            <input type="password" placeholder="Password" onChange={(event) => { setPassword(event.target.value) }} required />
                        </div>
                        <button type="submit" className={styles.manualbtn}>Login</button>
                        <div className={styles.register_link}>
                            <p>Don't have an account? <button onClick={switchtoRegister} id="switchToRegister" className={styles.switchToLogin}>Register</button></p>
                        </div>
                    </form>
                </div>
                <span className={styles.close} onClick={closeModal} id="closeModal">&times;</span>
            </div>
        </div>
    );
}

export default LoginModal;
