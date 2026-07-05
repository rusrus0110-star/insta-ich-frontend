import FeedPage from "../feed/FeedPage.jsx";
import postThumbnail from "../../assets/post-trees.png";

const mockNotifications = [
  {
    id: 1,
    username: "sashaa",
    firstLine: "liked your",
    secondLine: "photo.",
    time: "2 d",
    image: postThumbnail,
  },
  {
    id: 2,
    username: "sashaa",
    firstLine: "commented",
    secondLine: "your photo.",
    time: "2 wek",
    image: postThumbnail,
  },
  {
    id: 3,
    username: "sashaa",
    firstLine: "started",
    secondLine: "following.",
    time: "2 d",
    image: postThumbnail,
  },
];

function NotificationAvatar({ username }) {
  const firstLetter = username?.charAt(0).toUpperCase() || "U";

  return <div className="notification-avatar">{firstLetter}</div>;
}

function NotificationItem({ notification }) {
  return (
    <article className="notification-row">
      <NotificationAvatar username={notification.username} />

      <div className="notification-text">
        <p>
          <span>{notification.username}</span> {notification.firstLine}
          <br />
          {notification.secondLine} <small>{notification.time}</small>
        </p>
      </div>

      <img src={notification.image} alt="" className="notification-thumbnail" />
    </article>
  );
}

function NotificationsPage() {
  return (
    <section className="notification-page">
      <div className="notification-feed-background">
        <FeedPage />
      </div>

      <div className="notification-layer">
        <aside className="notification-panel">
          <h1>Notifications</h1>

          <div className="notification-section">
            <h2>New</h2>

            <div className="notification-list">
              {mockNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="notification-overlay" />
      </div>
    </section>
  );
}

export default NotificationsPage;
