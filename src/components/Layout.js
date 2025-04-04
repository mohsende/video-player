import React from "react";
import Sidebar from "./Sidebar";
import "../styles/Layout.scss";

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">🎬 Movie Platform</header>
      <div className="main-container">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
      <footer className="footer">© 2024 Movie Platform</footer>
    </div>
  );
}

export default Layout;