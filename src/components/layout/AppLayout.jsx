import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-main">{children}</main>

      <Footer />
    </div>
  );
}

export default AppLayout;
