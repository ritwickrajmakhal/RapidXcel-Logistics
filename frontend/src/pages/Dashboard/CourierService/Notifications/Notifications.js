import "./style.css";

const Notifications = ({ notifications }) => {
    const reversedNotifications = [...notifications].reverse();

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
    };
    return (
        <section className="notifications-section">
            <h2>Notifications</h2>
            <div id="notificationList" className="notifications">
                {reversedNotifications.map((notification) => (
                    <div className={`notification ${notification.title.toLowerCase()}`} key={notification.id}>
                        <div className="details">
                            <div>
                                <h3>{notification.title}</h3>
                                <p>{notification.message}</p>
                            </div>
                            <span className="status">{formatDate(notification.created_at)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Notifications;
