import React, { useEffect, useState } from 'react';
import './InputSection.css';
import { type } from '@testing-library/user-event/dist/type';

function InputSection({ WORKER_URL, videoUrl, setVideoUrl, subtitleFile, setSubtitleFile, videoList, setVideoList, setShowInputSection, handleClearList }) {
  const apiUrl = 'https://www.omdbapi.com/?apikey=c3327b94&';
  const fileName = videoUrl.split('/').pop();
  const movieNameSuggestion = fileName.split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newVideo, setNewVideo] = useState({
    url: undefined,
    filename: '',
    title: '',
    year: '',
    poster: ''
  });
  const [noMovieFound, setNoMovieFound] = useState('active');
  const [selectedName, setSelectedName] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  if (fileName !== '') {
    for (let i = 0; i < (movieNameSuggestion.length > 3 ? 3 : movieNameSuggestion.length); i++) {
      i === 0 ? suggestions.push(movieNameSuggestion[i]) : suggestions.push(suggestions[i - 1] + movieNameSuggestion[i])
      // console.log(suggestions);
    }
  }

  function handleNameClick(name) {
    setSelectedName(name);
    searchMovie('s', name);
  }

  function suggestionNames() {
    if (fileName !== '') {
      return (
        <ul className='movieNameGuesses'>
          {
            suggestions.map((name, index) =>
              <li
                key={index}>
                <button
                  style={{ backgroundColor: selectedName === name ? '#d19172' : '' }}
                  onClick={() => handleNameClick(name)}>
                  {name}
                </button>
              </li>)}
        </ul>
      )
    }
    else
      return null;
  }

  const suggestName = '';

  // Specify the API endpoint for user data

  // function searchMovie1(typeOfSearch, name) {
  //   const type = typeOfSearch === 't' ? 't=' : 's=';
  //   const apiUrlMovie = apiUrl + type + name;
  //   console.log(apiUrlMovie);
  //   fetch(apiUrlMovie)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(userData => {
  //       // Process the retrieved user data
  //       if (userData.Response) {
  //         setFindMovies(userData.Search);
  //       }
  //       console.log('User Data:', userData);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }
  // Make a GET request using the Fetch API

  async function searchMovie(typeOfSearch, name) {
    const type = typeOfSearch === 't' ? 't=' : 's=';
    const apiUrlMovie = apiUrl + type + name;
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      setFindMovies(data.Search)
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  function handleSuggestionClick(e, name) {
  }

  function findMovieHandleClick(name) {
    // const movie =  searchMovie('t', name);
  }

  function setMovieData(url, filename, title, year, poster, imdbID) {
    // console.log(newVideo);
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
        {suggestionNames()}
        <h3 className={findMovies ? 'inactive' : undefined}>No movie found</h3>
        {findMovies &&
          <ul>
            {
              findMovies.map(movie =>
                <li key={movie.imdbID}>
                  {/* <button onClick={() => findMovieHandleClick(movie.Title)} className='movieName'>{movie.Title}</button> */}
                  <div
                    className='poster'
                    onClick={() => setMovieData(videoUrl, fileName, movie.Title, movie.Year, movie.Poster, movie.imdbID)} style={{
                      border: selectedMovie === movie.imdbID ? '5px solid #d19172' : '',
                      backgroundImage: `url(${movie.Poster})`,
                      width: '150px',
                      height: '200px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover'
                    }}>
                    <h4>{movie.Title} {movie.Year}</h4>
                  </div>
                </li>)
            }
          </ul>}
      </div>

    </>
  );
}

export default InputSection;
