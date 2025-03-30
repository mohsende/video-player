import React from 'react';
import '../styles/sidebar.scss';

function Sidebar() {
  return (
      <nav className="sidebar">
        <ul>
          <li key="movies">
            <a href="#">
              <span class="material-symbols-rounded icon">tv</span>
              <span className="title">Movies</span>
            </a>
          </li>
          <li key="series">
            <a href="#">
              <span class="material-symbols-rounded icon">subscriptions</span>
              <span className="title">Series</span>
            </a>
          </li>
          <li key="add">
            <a href="#">
              <span class="material-symbols-rounded icon">add_circle</span>
              <span className="title">Add</span>
            </a>
          </li>
          {/* <li key="space" className="space"></li> */}
          <li key="me">
            <a href="#">
              <span class="material-symbols-rounded icon">account_circle</span>
              <span className="title">Me</span>
            </a>
          </li>
        </ul>
      </nav>
  )
}

export default Sidebar