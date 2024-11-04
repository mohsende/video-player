import React, { useEffect, useState } from 'react';
import './InputSection.css';
import { type } from '@testing-library/user-event/dist/type';

function InputSection({ WORKER_URL, videoUrl, setVideoUrl, subtitleFile, setSubtitleFile, videoList, setVideoList, setShowInputSection, handleClearList }) {
  const apiUrl = 'https://www.omdbapi.com/?apikey=c3327b94&';
  const fileName = videoUrl.split('/').pop();
  const movieNameSuggestion = fileName.split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newVideo, setNewVideo] = useState({
    url: undefined,
    filename: '',
    title: '',
    year: '',
    poster: ''
  });

  if (fileName !== '' && newName === '') {
    for (let i = 0; i < (movieNameSuggestion.length > 3 ? 3 : movieNameSuggestion.length); i++) {
      i === 0 ? suggestions.push(movieNameSuggestion[i]) : suggestions.push(suggestions[i - 1] + ' ' + movieNameSuggestion[i])
    }
  } else if (newName !== '') {
    suggestions[0] = newName;
  }

  function handleNameClick(name) {
    setSelectedName(name);
    searchMovie('s', name);
  }

  async function searchMovie(typeOfSearch, name) {
    const type = typeOfSearch === 't' ? 't=' : 's=';
    const apiUrlMovie = apiUrl + type + name;
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      setFindMovies(data.Search);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  function setMovieData(url, filename, title, year, poster, imdbID) {
    setNewVideo({
      url: url,
      filename: filename,
      title: title,
      year: year,
      poster: poster
    })
    // console.log(newVideo);
    setSelectedMovie(imdbID);
  }

  const handleAddVideo = async (url, filename, title, year, poster) => {
    if (newVideo.url && !videoList.some(video => video.url === url)) {

      const formData = new FormData();
      formData.append('videoData', JSON.stringify(newVideo));
      if (subtitleFile) {
        formData.append('subtitle', subtitleFile);
      }
      try {
        await fetch(WORKER_URL, {
          method: 'POST',
          body: formData,
        });

        const updatedList = [...videoList, newVideo];
        setVideoList(updatedList);
        setVideoUrl('');
        setSubtitleFile(null);
        setShowInputSection(false);
      } catch (error) {
        console.error('Error saving links:', error);
      }
    }
  };

  return (
    <>
      <div className='inputSection'>
        <div className='input'>
          <input
            type="text"
            className='videoUrl'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
          />
          <input
            type="file"
            id='fileUpload'
            accept=".vtt"
            onChange={(e) => setSubtitleFile(e.target.files[0])}
          />
        </div>
        <button className='addBtn' onClick={handleAddVideo}>+</button>
        <button className='clearBtn' onClick={handleClearList}>-</button>
      </div>
      <div className='movie'>
        <p>
          Movie name
        </p>
        <input 
          type='text'
          className='newName'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='Movie name'
          />
        {fileName !== '' &&
          <ul className='movieNameGuesses'>
            {suggestions.map((name, index) =>
              <li
                key={index}>
                <button
                  style={{ backgroundColor: selectedName === name ? '#d19172' : '' }}
                  onClick={() => handleNameClick(name)}>
                  {name}
                </button>
              </li>)}
          </ul>
        }
        <h3 className={findMovies ? 'inactive' : undefined}>No movie found</h3>
        {findMovies &&
          <ul>
            {findMovies.map(movie =>
                <li key={movie.imdbID}>
                  {/* <button onClick={() => findMovieHandleClick(movie.Title)} className='movieName'>{movie.Title}</button> */}
                  <div
                    className='poster'
                  onClick={() => setMovieData(videoUrl, newName !== '' ? movie.Title : fileName, movie.Title, movie.Year, movie.Poster, movie.imdbID)}
                  style={{
                      outline: selectedMovie === movie.imdbID ? '2px solid green' : '',
                      backgroundImage: `url(${movie.Poster})`,
                      width: '150px',
                      height: '200px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      position: 'relative'
                    }}>
                    <h4>{movie.Title} {movie.Year}</h4>
                    <h2
                      className='selectedMovie'
                      style={{
                        display: selectedMovie === movie.imdbID ? 'block' : 'none'
                      }}>&#10004;</h2>
                  </div>
              </li>)}
          </ul>}
      </div>

    </>
  );
}

export default InputSection;
