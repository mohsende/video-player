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
    // console.log(key);
  }

  function handleLinkClick(event) {
    // console.log(event.target);
  }

  return (<>
      <aside className="sidebar">
        <nav>
          <ul>
            <li onClick={handleLinkClick}>
              <NavLink to="/" className='link' activeClassName="active">
                <span className="material-symbols-rounded icon">home</span>
                <span className="title">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/trending" className='link' activeClassName="active">
                <span className="material-symbols-rounded icon">tv</span>
                <span className="title">Trend</span>
              </NavLink>
            </li>
            <li>
             <Link to="/add" className='link'>
                <span className="material-symbols-rounded icon">add_circle</span>
                <span className="title">Add</span>
              </Link>
            </li>
            <li>
              <Link to="/search" className='link'>
                <span className="material-symbols-rounded icon">search</span>
                <span className="title">Search</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className='link'>
                <span className="material-symbols-rounded icon">account_circle</span>
                <span className="title">Me</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      {/* <nav className="sidebar">
        <ul ref={ulRef}>
          <li key="movies" onClick={(e) => handleNavClick('movies', e)}>
            <a href="#" >
              <span className="material-symbols-rounded icon">tv</span>
              <span className="title">Movies</span>
            </a>
          </li>
          <li key="series" onClick={(e) => handleNavClick('series', e)}>
            <a href="#">
              <span className="material-symbols-rounded icon">subscriptions</span>
              <span className="title">Series</span>
            </a>
          </li>
          <li key="add" onClick={(e) => handleNavClick('add', e)}>
            <a href="#">
              <span className="material-symbols-rounded icon">add_circle</span>
              <span className="title">Add</span>
            </a>
          </li>
          <li key="me" onClick={(e) => handleNavClick('me', e)}>
            <a href="#">
              <span className="material-symbols-rounded icon">account_circle</span>
              <span className="title">Me</span>
            </a>
          </li>
        </ul>
      </nav> */}
      </>
  )
}

export default Sidebar