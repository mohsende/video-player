import React, { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/sidebar.scss';

function Sidebar({ setShowVideoList, setShowInputSection }) {
  const [active, setActive] = useState(false);

  const ulRef = useRef(null);

  function handleNavClick(key, event) {
    ulRef.current.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
    event.target.closest("li").classList.add("active");
    if (key === 'add') {
      setShowInputSection(true);
      setShowVideoList(false)
    } else {
      setShowInputSection(false)
      setShowVideoList(true)
    }
  }

  // function handleLinkClick(event) {  }

  return (<>
      <aside className="sidebar">
        <nav>
          <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active link" : 'link'}>
                <span className="material-symbols-rounded icon">home</span>
                <span className="title">Home</span>
              </NavLink>
            </li>
            <li>
            <NavLink to="/trending" className={({ isActive }) => isActive ? "active link" : 'link'}>
                <span className="material-symbols-rounded icon">tv</span>
                <span className="title">Trend</span>
              </NavLink>
            </li>
            <li>
            <NavLink to="/add" className={({ isActive }) => isActive ? "active link" : 'link'}>
                <span className="material-symbols-rounded icon">add_circle</span>
                <span className="title">Add</span>
              </NavLink>
            </li>
            <li>
            <NavLink to="/details" className={({ isActive }) => isActive ? "active link" : 'link'}>
                <span className="material-symbols-rounded icon">search</span>
                <span className="title">Details</span>
              </NavLink>
            </li>
            <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active link" : 'link'}>
                <span className="material-symbols-rounded icon">account_circle</span>
                <span className="title">Me</span>
              </NavLink>
            </li>
          </ul>
        </nav>
    </aside>
      </>
  )
}

export default Sidebar