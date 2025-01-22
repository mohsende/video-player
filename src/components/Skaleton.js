import React from 'react';
import '../styles/skaleton.scss'

function Skaleton() {
  return (
    <div className="movie-card">
      <div className="skeleton w100 h100">
        <div className="square flex col h100">
          <div className="">
            <div className="line h25 w40 m20"></div>
            <div className="flex">
              <div className="line h15 w25"></div>
              <div className="line h15 w25"></div>
            </div>
            <div className="line h15 w40"></div>
            <div className="line h15 w50"></div>
            <div className="line h55 w75"></div>
          </div>

          <div className="">
            <div className="line h25"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skaleton