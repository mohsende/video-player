import React, { useEffect, useState } from 'react';
import './InputSection.css';
import { type } from '@testing-library/user-event/dist/type';
import SubtitleSection from './SubtitleSection';

const OMDB_API_URL = 'https://www.omdbapi.com/?apikey=c3327b94&';
// const HAJI_LICENSE = 'aNxVui2gLkJwqJEAadpiOtUXw44zoHR8rop9crfmXSc';
const HAJI_LICENSE = 'Os0vxtpXI1RyggywxkJBrufpSYat3aAZn3w6H2qUgaqJu14znW7t1';


function InputSection({ WORKER_URL, videoUrl, setVideoUrl, subtitleFile, setSubtitleFile, videoList, setVideoList, setShowInputSection, handleClearList }) {
  const fileName = videoUrl.split('/').pop();
  const movieNameSuggestion = fileName.split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newName, setNewName] = useState('');
  const [subFileAddress, setSubFileAddress] = useState('');
  const [subFileAddress2, setSubFileAddress2] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  
  const [subSearchList, setSubSearchList] = useState([]);
  const [subFileList, setFileList] = useState([]);
  // const [subSearchList2, setSubSearchList2] = useState([]);
  // const [subSearchList, setSubSearchList] = useState([]);
  
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

  // const handleSearchSubtitle = async (name) => {
  //   const subtitles = await fetchSubtitles(name);
  //   console.log("Subtitles:", subtitles);
  //   console.log("Subtitles:", name);
  //   // در اینجا می‌توانید زیرنویس‌ها را به کاربر نمایش دهید یا پردازش‌های بعدی را انجام دهید
  // };

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

    // const subtitleSearchResult = await searchSubtitle(newTitle, HAJI_LICENSE);
    // const subtitleSearchResult2 = await searchSubtitle2(newTitle, HAJI_LICENSE);
    // if (subtitleSearchResult) {
    //   // console.log((subtitleSearchResult && subtitleSearchResult.length > 0) ? subtitleSearchResult : '');
    //   const link = subtitleSearchResult.map(result => result.link);
    //   console.log('result1 : ', link);
    //   // const subFile = await searchSubtitleFile(link, HAJI_LICENSE);
    //   // setSubFileAddress(subFile);
    //   // console.log('SubtitleFile = ', subFile);
    // }
    // if (subtitleSearchResult2) {
    //   // console.log((subtitleSearchResult2 && subtitleSearchResult2.length > 0) ? subtitleSearchResult2 : '');
    //   const link = subtitleSearchResult2.map(result => result.url);
    //   console.log('result2 : ', link);
    //   const subFile = await searchSubtitleFile2(link);
    //   // setSubFileAddress2(subFile);
    //   console.log('SubtitleFile = ', subFile);
    // }
  }

  // async function searchSubtitle(title, license) {
  //   const apiUrl = `https://haji-api.ir/zirnevis/search.php?text=${title}&license=${license}`;
  //   // await alert(apiUrl);
  //   try {
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();
  //     if (data.success)
  //       return data.result;
  //     else {
  //       console.log('Subtitle Not Found.', data.success);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async function searchSubtitleFile(link, license) {
  //   const apiUrl = `https://haji-api.ir/zirnevis/?url=${link}&license=${license}`;

  //   try {
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();
  //     if (data.download_link)
  //       setSubtitleFile(data.download_link);
  //     else {
  //       console.log('Subtitle file Not Found.', data.download_link);
  //       setSubFileAddress('');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function searchSubtitleApi3(title) {
    const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/search?s=${title}&license=${HAJI_LICENSE}`;
    // await alert(apiUrl);
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

  async function searchSubtitleFileApi3(downloadAPI) {
    // const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/download?url=${link}&license=${license}`;

    try {
      const response = await fetch(downloadAPI);
      const data = await response.json();
      if (data.result)
        setSubSearchList(data.result);
      else {
        console.log('Subtitle file Not Found.', data.result);
        setSubSearchList([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddVideo = async () => {
    if (newVideo.url && !videoList.some(video => video.url === newVideo.url)) {

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
            accept=".vtt"
            onChange={(e) => setSubtitleFile(e.target.files[0])}
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
        {!findMovies && <h3>No movie found</h3>}
        <a className={!subFileAddress ? 'inactive' : undefined} href={subFileAddress}>{subFileAddress}</a>
        {
          <div className="SubSection">
            <h3>Search for {selectedMovie.title}</h3>
            <ul>
              {
                (subSearchList && subSearchList.length) > 0 &&
                subSearchList.map((result, index) =>
                  // console.log(result)
                  <li key={index} onClick={() => searchSubtitleFileApi3(result.downloadAPI)}>{!result.status ? result.title : result.url}</li>
                )

              }
            </ul>
          </div>
        }
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
                      outline: selectedMovie.imdbID === movie.imdbID ? '2px solid green' : '',
                    backgroundImage: `url(${movie.Poster})`,
                    }}>
                    <h4>{movie.Title} {movie.Year}</h4>
                    <h2
                      className='selectedMovie'
                      style={{
                        display: selectedMovie.imdbID === movie.imdbID ? 'block' : 'none'
                      }}>&#10004;</h2>
                  </div>
              </li>)}
          </ul>}

        <button className='addBtn' onClick={handleAddVideo}>Add to my Video List</button>
      </div>

    </div>
  );
}

export default InputSection;
