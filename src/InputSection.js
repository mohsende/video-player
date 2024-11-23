import React, { useEffect, useState } from 'react';
import './InputSection.css';
import { type } from '@testing-library/user-event/dist/type';

const OMDB_API_URL = 'https://www.omdbapi.com/?apikey=c3327b94&';
// const HAJI_LICENSE = 'aNxVui2gLkJwqJEAadpiOtUXw44zoHR8rop9crfmXSc';
const HAJI_LICENSE = 'Os0vxtpXI1RyggywxkJBrufpSYat3aAZn3w6H2qUgaqJu14znW7t1';


function InputSection({ WORKER_URL, videoUrl, setVideoUrl, subtitleFile, setSubtitleFile, videoList, setVideoList, setShowInputSection, handleClearList }) {
  const fileName = videoUrl.split('/').pop();
  const movieNameSuggestion = fileName.split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [subSearchList, setSubSearchList] = useState([]);
  const [subSearchFileList, setSubSearchFileList] = useState([]);
  
  const [newVideo, setNewVideo] = useState({
    url: undefined,
    filename: '',
    title: '',
    year: '',
    poster: ''
  });

  const [selectedMovie, setSelectedMovie] = useState({
    title: null,
    imdbID: null
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
    const apiUrlMovie = OMDB_API_URL + type + name;
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      if (data.Response) {
        setFindMovies(data.Search); 
      } else {
        setFindMovies([]);
      }
      setSelectedMovie({title: null, imdbID: null});
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  // // Send title to WORKER for searching subtitle
  // async function findSubtitle(title) {
  //   try {
  //     // ارسال درخواست به Worker برای جستجوی زیرنویس
  //     const response = await fetch(`https://videolinks.bugatichapi.workers.dev/searchSubtitle?query=${encodeURIComponent(title)}&languages=fa`);

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch subtitles');
  //     }

  //     // تبدیل پاسخ به فرمت JSON
  //     const data = await response.json();

  //     // بررسی و نمایش داده‌های زیرنویس
  //     if (data && data.data && data.data.length > 0) {
  //       console.log("Subtitles found:", data.data);
  //       // مثلا می‌توانید اولین زیرنویس را در لیست قرار دهید
  //       const firstSubtitle = data.data[0];
  //       // اینجا می‌توانید لینک زیرنویس را به داده ویدئو اضافه کنید
  //       // مثلا: videoData.subtitle = firstSubtitle.attributes.url;
  //     } else {
  //       console.log("No subtitles found for this title.");
  //     }

  //   } catch (error) {
  //     console.error("Error fetching subtitle:", error);
  //   }
  // }

  const setMovieData = async (url, filename, title, year, poster, imdbID) => {
    const newTitle = title.replaceAll(' ', '+');
    setNewVideo({
      url: url,
      filename: filename,
      title: newTitle,
      year: year,
      poster: poster,
    })
    setSelectedMovie({
      title: title, 
      imdbID: imdbID
    });

    searchSubtitleApi3(newTitle);

  }

  // API Search Subtitle from https://api3.haji-api.ir/
  async function searchSubtitleApi3(title) {
    const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/search?s=${title}&license=${HAJI_LICENSE}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.result)
        setSubSearchList(data.result);
      else {
        console.log('Subtitle Not Found.', data.result);
        setSubSearchList([]);;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // API Search SubtitleFile for download link from https://api3.haji-api.ir/
  async function searchSubtitleFileApi3(downloadAPI) {
    try {
      const response = await fetch(downloadAPI);
      const data = await response.json();
      if (data.result)
        setSubSearchFileList(data.result); 
      else {
        console.log('Subtitle file Not Found.', data.result);
        setSubSearchFileList([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubtitle = async (zipUrl) => {
    
  }

  // https://dls.bia-inja-film.click/DonyayeSerial/series/Unbelievable/Soft.Sub/S01/720p.Web-DL/Unbelievable.S01E06.720p.WEB-DL.SoftSub.DonyayeSerial.mkv

  const handleAddVideo = async () => {
    if (newVideo.url && !videoList.some(video => video.url === newVideo.url)) {

      const formData = new FormData();
      formData.append('videoData', JSON.stringify(newVideo));
      // If subtitle selected for uploading 
      if (subtitleFile) {
        subtitleFile.forEach((file, index) => {
          formData.append(`subtitle${index + 1}`, file);
        });
      };

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
      };
    };


  // function getBaseName(filename) {
  //   return filename.replace(/\.[^/.]+$/, "");
  // }

  function handleSubSelected(files) {
    // const selectedFile = [];
    // for (const [key, value] of Object.entries(files)){
    //   selectedFile.push(value);
    // }
    // setSubtitleFile(selectedFile);
    const chosenFiles = Array.prototype.slice.call(files)
    // console.log(chosenFiles);

    setSubtitleFile(chosenFiles);
  }

  // console.log(subtitleFile);
  // console.log('InputSection Reloaded');
  return (
    <div className='inputMovie'>
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
            multiple
            accept=".vtt"
            // onChange={(e) => setSubtitleFile(e.target.files[0])}
            onChange={(e) => handleSubSelected(e.target.files)}
          />
        </div>
        {/* <button className='clearBtn' onClick={handleClearList}>-</button> */}
      </div>
      <div className='movieSection'>
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
              <li className='movieName'
                key={index}>
                <button
                  style={{ backgroundColor: selectedName === name ? '#d19172' : '' }}
                  onClick={() => handleNameClick(name)}>
                  {name}
                </button>
              </li>)}
          </ul>
        }
        {!findMovies && <h3>No movie found</h3>}
        {/* <a className={!subFileAddress ? 'inactive' : undefined} href={subFileAddress}>{subFileAddress}</a> */}
        {/* Subtitle Search Section */}
        {selectedMovie.title &&
          <div className="SubSection">
            {subSearchList.length === 0 ?
              <h3>Searching for subtitle ... </h3> : <h3>Subtitle for {selectedMovie.title}</h3>}
            <ul className='subSearch'>
              {(subSearchList && subSearchList.length > 0) &&
                subSearchList.map((result) =>
                  // console.log(result)
                  <li className='subSearchItem' key={result.url} onClick={() => searchSubtitleFileApi3(result.downloadAPI)}>
                    <p>{result.title}</p>
                  </li>
                )}
            </ul>
            {subSearchFileList.length !== 0 && <h3>Download link</h3>}
            <ul className='subFileSearch'>
              {(subSearchFileList && subSearchFileList.length > 0) &&
                subSearchFileList.map((link) =>
                  <li key={link.title} onClick={() => handleSubtitle(link.url)}>
                    <p>{link.url}</p>
                    {/* <a href={link.url}>{link.url}</a> */}
                  </li>)}
            </ul>
          </div>
        }
        {/* Movie Search Section */}
        {findMovies &&
          <ul className='findMovieList'>
            {findMovies.map(movie =>
              <li
                className='findMovies' 
                key={movie.imdbID}>
                  {/* <button onClick={() => findMovieHandleClick(movie.Title)} className='movieName'>{movie.Title}</button> */}
                  <div
                    className='poster'
                  onClick={() => setMovieData(videoUrl, newName !== '' ? movie.Title : fileName, movie.Title, movie.Year, movie.Poster, movie.imdbID)}
                  style={{
                      backgroundImage: `url(${movie.Poster})`,
                    }}>
                    <h5>{movie.Title} {movie.Year}</h5>
                    <h2
                      className='selectedMovie'
                      style={{
                        display: selectedMovie.imdbID === movie.imdbID ? undefined : 'none'
                      }}>&#10003;</h2>
                  </div>
              </li>)}
          </ul>}

        <button className='addBtn' onClick={handleAddVideo}>Add to my Video List</button>
      </div>

    </div>
  );
}

export default InputSection;
