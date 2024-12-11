import React, { useEffect, useState } from 'react';
import './InputSection.css';
import { type } from '@testing-library/user-event/dist/type';

const OMDB_API_URL = 'https://www.omdbapi.com/?apikey=c3327b94&';
// const HAJI_LICENSE = 'aNxVui2gLkJwqJEAadpiOtUXw44zoHR8rop9crfmXSc';
const HAJI_LICENSE = 'Os0vxtpXI1RyggywxkJBrufpSYat3aAZn3w6H2qUgaqJu14znW7t1';
const SUBDL_API_URL = 'https://api.subdl.com/api/v1/subtitles?api_key=h11PHJkLrVYI9ha6crzlKtt-UDAD_2OF&languages=fa&';


function InputSection({ WORKER_URL, videoUrl, setVideoUrl, subtitleFile, setSubtitleFile, videoList, setVideoList, setShowInputSection, handleClearList }) {
  const fileName = videoUrl.split('/').pop();
  const movieNameSuggestion = fileName.split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [subSearchList, setSubSearchList] = useState([]);
  const [subSearchFileList, setSubSearchFileList] = useState([]);
  const [typeOfSearch, setTypeOfSearch] = useState('t');
  const [api, setApi] = useState('subdl');
  const [subtitleFileUrl, setSubtitleFileUrl] = useState('');
  const [openSubtitleFileUrl, setOpenSubtitleFileUrl] = useState('Nothing');
  const [byIMDB, setByIMDB] = useState(true);
  const [resultsPages, setResultsPages] = useState([]);
  
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

  function reset(){

  }

  function handleNameClick(name) {
    setSelectedName(name);
    searchMovie(name);
  };

  // find movie data by OMDB API
  async function searchMovie(name, page=1) {
    const apiUrlMovie = `${OMDB_API_URL}${typeOfSearch}=${name}&page=${page}`;
    
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      // console.log('data.response', data);
      if (data.Response) {
        if (typeOfSearch === 't') {
          setResultsPages([]);
          setFindMovies(new Array(data)); 
          // console.log(data);
        } else {
          const totalPages = parseInt(data.totalResults / 10)
          const pages = new Array();
          for (let i = 0; i < totalPages; i++) {
            pages.push(i + 1);
          }
          setResultsPages(pages);
          setFindMovies(data.Search); 
          // console.log('pages:',pages);
        }
      } else {
        setFindMovies([]);
      }
      setSelectedMovie({title: null, imdbID: null});
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  function handlePosterClick(url, filename, title, year, poster, imdbID) {
    setSubtitleFileUrl('');
    setSelectedMovie({
      title: title,
      imdbID: imdbID
    });
    setFindMovies(findMovies.filter(movie => movie.Title === title)); // Show just selected movie when selected
    const newTitle = title.replaceAll(' ', '+');
    setNewVideo({
      url: url,
      filename: filename,
      title: newTitle,
      year: year,
      poster: poster,
    })

    setSubSearchList([]); // clear search list for filling new results.
    searchSubtitle(byIMDB ? imdbID.split('tt').pop() : newTitle)
  }

  // set movieData and search subtitle for it when click on movie card
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

    setSubSearchList([]); // clear search list for filling new results.
    searchSubtitle(byIMDB ? imdbID.split('tt').pop() : newTitle)
  }

  //#region Subtitle Methods

/*   ****** SUB API *******
  // **********************
  // ****** HAJI-API ******
  // **********************
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
      
  // ***************************
  // ****** SUBDL.COM API ******
  // ***************************
  // API Search Subtitle from https://api.subdl.com/api/v1/subtitles by cloudflare proxy
  async function searchSubdl(movie) {
    var url = `${WORKER_URL}searchSubtitle?api=subdl&movie=${movie}`;
    if (parseInt(movie)) {
      const imdb_id = parseInt(movie);
      url = `${WORKER_URL}searchSubtitle?api=subdl&imdb_id=${imdb_id}`;
      }

    // console.log('url is: ', url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log('data is',data);
      if (data.status){
        // console.log('name: ', data.results[0].name);
        // console.log('imdb_id: ', data.results[0].imdb_id);
        // console.log('movie: ', movie.toLowerCase());
        // console.log('subtitles_count: ', data.subtitles.length);
        data.subtitles.map(sub => {
          // const movieName = item.attributes.feature_details.parent_title ?? '';
          // if (movieName.toLowerCase() === movie.toLowerCase())
          { console.log(sub.name, sub.url); }
        });
        // setSubSearchList(data.data)
        // return (data.data);
      }
    } catch (error) {
      console.error(error);
      return ([error]);
    }
  }

  // *******************************
  // ****** OPENSUBTITLES API ******
  // *******************************
  // API Search Subtitle from https://api.opensubtitles.com/api/v1/subtitles by cloudflare proxy
  async function searchOpenSubtitles(movie) {
    var url = `${WORKER_URL}searchSubtitle?movie=${movie}`;
    if (parseInt(movie)) {
      const imdb_id = parseInt(movie);
      url = `${WORKER_URL}searchSubtitle?imdb_id=${imdb_id}`;
    }

    // console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data.total_pages: ', data.total_pages);
      console.log('data.total_count: ', data.total_count);
      console.log('movie: ', movie.toLowerCase());
      data.data.map(item => {
        // const movieName = item.attributes.feature_details.parent_title ?? '';
        // if (movieName.toLowerCase() === movie.toLowerCase())
        { console.log(item); }
      });
      setSubSearchList(data.data)
      // return (data.data);
    } catch (error) {
      console.error(error);
      return ([error]);
    }
  }
  
  */

  async function downloadOpenSubtitles(file_id) {
    var url = `${WORKER_URL}downloadSubtitle?file_id=${file_id}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'POST',
      });
      const data = await response.json();
      // console.log(data);
      // return (data.link);
      setOpenSubtitleFileUrl(data.link);
    } catch (error) {
      console.error('download error', error);
      setOpenSubtitleFileUrl('Not Found!!!');
      return ([error]);
    }

  }


// *************************************  
// ****** General Subtitle Search ******
// *************************************  
  async function searchSubtitle(movieOrImdbID) {
    var url = `${WORKER_URL}searchSubtitle?api=${api}&${byIMDB ? `imdb_id` : `movie`}=${movieOrImdbID}`;
    // console.log(url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(`data ${api} is`, data, api === 'subdl' ? data.subtitles || [] : data.data);
      setSubSearchList(api === 'subdl' ? data.subtitles || [] : data.data)
      // if (api === 'subdl') {
        // setSubSearchList(data.subtitles)
        // console.log('name: ', data.results[0].name);
        // console.log('imdb_id: ', data.results[0].imdb_id);
        // console.log('movie: ', movie.toLowerCase());
        // console.log('subtitles_count: ', data.subtitles.length);
        // data.subtitles.map(sub => {
          // const movieName = item.attributes.feature_details.parent_title ?? '';
          // if (movieName.toLowerCase() === movie.toLowerCase())
          // { console.log(sub.name, sub.url); }
        // });
        // return (data.data);
      // }
    } catch (error) {
      console.error(error);
      return ([error]);
    }

  } 

  function handleSubSrcChange(check){
    setSubSearchList([]); // clear search list for filling new results.
    setSelectedMovie({ title: null, imdbID: null });
    setApi(check ? 'subdl' : 'open');
  }
  
  // store selected subtitle files into setSubtitleFile useState
  function handleSubSelected(files) {
    const chosenFiles = Array.prototype.slice.call(files);
    setSubtitleFile(chosenFiles);
  }
  
  const handleSubtitle = async (zipUrl) => {
    
  }

  // Show subtitle file link when select a subtitle
  async function handleSubSelectChange(event) {
    setSubtitleFileUrl('');
    setOpenSubtitleFileUrl('')
    console.log(event.target.value);
    if (event.target.value !== 'Please select a subtitle') {
      var url = ``;
      if (api === 'subdl') {
        url = `https://dl.subdl.com${event.target.value}`;
        setSubtitleFileUrl(url);
      } else if (api === 'open') {
        url = `${event.target.value}`;
        await downloadOpenSubtitles(url);
        // setSubtitleFileUrl(openSubtitleFileUrl);
      }
    } else {
      // setSubtitleFileUrl('');
      // setOpenSubtitleFileUrl('')
    }
    console.log('open ......', openSubtitleFileUrl);
  }

  async function handleSubtileDownload() {

    // if (api === 'subdl') {

    // } else if (api === 'open') {
    //   const srtLink = await downloadOpenSubtitles(subtitleFileUrl);
    //   console.log('srtLink: ', srtLink.link);
    // }
  }
  
  //#endregion

  // https://dls.bia-inja-film.click/DonyayeSerial/series/Unbelievable/Soft.Sub/S01/720p.Web-DL/Unbelievable.S01E06.720p.WEB-DL.SoftSub.DonyayeSerial.mkv
  

  // Add videoData and subtitle if selected into formData and send it to WORKER for saving 
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
      };
    };
  };

  
  function handlePageSelected(page) {
    searchMovie(selectedName, page)
  }

  

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
        <div className='typeOfSearch'>
          <div>
            <input id='typeOfSearch' type='checkbox' checked={typeOfSearch === 's'} onChange={(e) => setTypeOfSearch(e.target.checked ? 's' : 't')} />
            <label htmlFor='typeOfSearch'>Search all Movies</label>
          </div>
          <div>
            <input id='byIMDB' type='checkbox' checked={byIMDB} onChange={(e) => setByIMDB(e.target.checked)} />
            <label htmlFor='byIMDB'>Search Subtitle by IMDB ID</label>
          </div>
          <div>
            <input id='subSrc' type='checkbox' checked={api === 'subdl'} onChange={(e) => handleSubSrcChange(e.target.checked)} />
            <label htmlFor='subSrc'>{api === 'subdl' ? 'Subdl' : 'OpenSubtitles'}</label>
          </div>
        </div>
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
        {/* Movie Search Section */}
        {findMovies &&
          <ul className='findMovieList'>
            {findMovies.map(movie => {
              
              return(
              <li
                className='findMovies' 
                key={movie.imdbID}>
                  {/* <button onClick={() => findMovieHandleClick(movie.Title)} className='movieName'>{movie.Title}</button> */}
                  <div
                    className='poster'
                  onClick={() => handlePosterClick(videoUrl, newName !== '' ? movie.Title : fileName, movie.Title, movie.Year, movie.Poster, movie.imdbID)}
                  style={{
                      backgroundImage: `url(${movie.Poster})`,
                    }}>
                    <h5>{movie.Title} {movie.Year}</h5>
                    {/* <p className='imdb'>IMDB:{movie.imdbID} {movie.Year}</p> */}
                    <h2
                      className='selectedMovie'
                      style={{
                        display: selectedMovie.imdbID === movie.imdbID ? undefined : 'none'
                      }}>&#10003;</h2>
                  </div>
              </li>)})}
          </ul>}
        <ul className='pageNumber' style={{ gap: '10px', justifyContent: 'center' }}>
            {resultsPages.map((page, index) =>
              page < 10 &&
              <li key={index} className='page'
                  style={{ backgroundColor: '#119172', padding: '10px', borderRadius: '5px' }} 
                  onClick={() => handlePageSelected(page)}>{page}</li>
              )}
        </ul>

        {/* Subtitle Search Section */}
        {selectedMovie.title &&
          <div className="SubSection">
            {subSearchList.length === 0 ?
              <h3>Searching for subtitle ... </h3> : <h3>Subtitle for <span className='subtitleFound'>{selectedMovie.title} - {subSearchList.length}</span> </h3>}
            <select className='subtitlesSelect' onChange={handleSubSelectChange}>
                <option>Please select a subtitle</option>
                {subSearchList.map((result, index) => {
                  const name = api === 'subdl' ? result.release_name : result.attributes.release ?? result.attributes.slug;
                  const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                  return <option key={index} value={file}>{name}</option>
                })}
            </select>
            {(subtitleFileUrl !== '' || openSubtitleFileUrl) && 
              <p className='subtitleFileUrl' 
                onClick={handleSubtileDownload}>{api === 'subdl' ? subtitleFileUrl : openSubtitleFileUrl}</p>}
            {/*
            <ul className='subSearch'>
              {(subSearchList && subSearchList.length > 0) &&
                subSearchList.map((result, index) => {
                  // console.log(result)
                  const name = api === 'subdl' ? result.release_name : result.attributes.release ?? result.attributes.slug;
                  const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                  return (
                    <li className='subSearchItem' key={index}>
                      <p title={file}>{name}</p>
                    </li>)
                  })}
            </ul>
            */}
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

        <button className='addBtn' onClick={handleAddVideo}>Add to my Video List</button>
      </div>

    </div>
  );
}

export default InputSection;
