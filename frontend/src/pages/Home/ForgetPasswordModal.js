import React, { useState } from 'react';
import styles from './Home.module.css';
import { toast } from "react-toastify";

const ForgetPasswordModal = (props) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);

    function closeModal() {
        props.enableForgetPasswordModal(false);
    }

    function switchtoLogin() {
        props.enableLoginModal(true);
        props.enableForgetPasswordModal(false);
    }

    const sendResetLink = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                closeModal();
            }
            else {
                toast.error(data.error);
                setSending(false);
            }
        }
        catch (err) {
            console.log(err);
            setSending(false);
        }

    }
    return (
        <div>
            <div className={styles.modal} id="modal">
                <div className={styles.modal_content} id="modalContent">
                    <h3>Forget Password ?</h3>
                    <form onSubmit={sendResetLink}>
                        <div className={styles.input_box}>
                            <input type="text" placeholder="Enter your email" onChange={(event) => { setEmail(event.target.value) }} required />
                        </div>
                        <button type="submit" className={styles.manualbtn} disabled={sending}>{sending ? "Sending..." : "Send reset link"}</button>
                        <div className={styles.register_link}>
                            <button onClick={switchtoLogin} id="switchToRegister" className={styles.switchToLogin}>Back to login</button>
                        </div>
                    </form>
                </div>
                <span className={styles.close} onClick={closeModal} id="closeModal">&times;</span>
            </div>
        </div>
    );
}

export default ForgetPasswordModal;
