import "./style.css";
import { useState } from "react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "In Transit",
            description: "Your shipment is currently in transit.",
            created_at: "2021-09-01T12:00:00Z",
        },
        {
            id: 2,
            title: "In Transit",
            description: "Your shipment is currently in transit.",
            created_at: "2021-09-01T12:00:00Z",
        },
        {
            id: 3,
            title: "In Transit",
            description: "Your shipment is currently in transit.",
            created_at: "2021-09-01T12:00:00Z",
        },
    ]);

    return (
        <section className="notifications-section">
            <h2>Notifications</h2>
            <div id="notificationList" className="notifications">
                {notifications.map((notification) => (
                    <div className="notification transit" key={notification.id}>
                        <div className="details">
                            <div>
                                <h3>{notification.title}</h3>
                                <p>{notification.description}</p>
                            </div>
                            <span className="status">{notification.created_at}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Notifications;
