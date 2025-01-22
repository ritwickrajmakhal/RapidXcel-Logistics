import React, { useState } from 'react';
import styles from './Home.module.css';
import { toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const { resetToken } = useParams();

    const resetPassword = async (e) => {
        e.preventDefault();
        setResetting(true);
        if (password === confirmPassword) {
            try {
                const res = await fetch(`${BACKEND_URL}/auth/reset-password/${resetToken}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({ password })
                });
                const data = await res.json();
                res.ok ? toast.success(data.message) : toast.error(data.error);
            }
            catch (err) {
                console.log(err);
            }
        }
        else
            toast.error("Passwords do not match.");
        setResetting(false);
    }
    return (
        <div>
            <div className={styles.modal} id="modal">
                <div className={styles.modal_content} id="modalContent">
                    <h3>Reset Password</h3>
                    <form onSubmit={resetPassword}>
                        <div className={styles.input_box}>
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" placeholder="Enter a new password" value={password} onChange={(event) => { setPassword(event.target.value) }} required />
                        </div>
                        <div className={styles.input_box}>
                            <label htmlFor="newPassword">Confirm Password</label>
                            <input type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value) }} required />
                        </div>
                        <button type="submit" className={styles.manualbtn} disabled={resetting}>{resetting ? "Resetting..." : "Reset"}</button>
                        <div className={styles.register_link}>
                            <Link to="/" className={styles.switchToLogin}>Back to home</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
