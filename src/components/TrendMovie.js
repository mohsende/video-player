import React, { useState, useEffect } from 'react'
import '../styles/TrendMovie.scss';

function TrendMovie() {

  const [movies, setMovies] = useState([]);
  const poster_path = "https://image.tmdb.org/t/p/w185";

  useEffect(() => {
    if (!movies.length > 0)
    findMovie();
  }, [movies])

  async function findMovie() {
    const apiUrl = `https://api.themoviedb.org/3/trending/movie/week?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjdjYjk4MGZhZjE2ZmQ3MGU2MDhkZWMwMzVjM2YyYiIsIm5iZiI6MTczMDIwNDk0OC41ODUsInN1YiI6IjY3MjBkNTE0YjNkNWNiYjg0MmY0Y2VlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IIscuRn6KXOyC2xyS4nUy5BF3Fo3iL8DN8xv7LwhpEc'
      }
    };
    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      if (data) {
        console.log(data.results);
        setMovies(data.results);
      }
    } catch (error) {
      console.error('Error fetching TMDB:', error);
    }

  }

  return (
    <div>
      <h1>Trend Movies</h1>
      <div className='card-container'>
      {movies.length > 0 &&
        movies.map((movie, index) => {
          const full_poster_path = poster_path + movie.poster_path;
          return (
            <div className='card' key={index} style={{ backgroundImage: `url(${full_poster_path})`}}>
              <p className='title'>{movie.title}</p>
              <p className='type'>{movie.media_type}</p>
              <p className='year'>{movie.release_date}</p>
            </div>
            )
          })
      }
      </div>
    </div>
  )
}

export default TrendMovie