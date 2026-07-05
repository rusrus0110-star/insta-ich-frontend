import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        {children}
        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;
