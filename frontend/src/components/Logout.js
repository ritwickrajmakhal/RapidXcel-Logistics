import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    useEffect(() => {
        const logout = async () => {
            const response = await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include',
            });
            if (response.ok) {
                localStorage.removeItem('user');
                navigate('/');
                const data = await response.json();
                toast.success(data.message);
            }
        }
        logout();
    });
}

export default Logout