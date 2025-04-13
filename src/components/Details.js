import React from 'react';

function Details() {
  return (
    <div style={{color: '#CCC'}}>
      <div className='poster'
        style={{ backgroundImage: `url('https://m.media-amazon.com/images/M/MV5BOTY4ZjBkZTEtNTA4YS00NGJmLWJkZTktYmI5NTkxNGRhYWUxXkEyXkFqcGc@._V1_SX300.jpg')`, width: '190px', height: '250px', backgroundSize: 'cover'}}
      >
      </div>
      <details>
        <h2>Movie name</h2>
        <h4>Movie type</h4>
        <h4>Movie url</h4>
      </details>
    </div>
  )
}

export default Details