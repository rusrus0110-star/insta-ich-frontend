function Avatar({ src, username = "user", size = 32 }) {
  const initials = username.slice(0, 1).toUpperCase();

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(size / 2.5, 12),
      }}
    >
      {src ? <img src={src} alt={username} /> : <span>{initials}</span>}
    </div>
  );
}

export default Avatar;
