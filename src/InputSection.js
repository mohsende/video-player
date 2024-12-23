import React, { useEffect, useState, useRef } from 'react';
import JSZip from 'jszip';
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
  const [vttFileList, setVttFileList] = useState([]);
  const [typeOfSearch, setTypeOfSearch] = useState('t');
  const [api, setApi] = useState('subdl');
  const [subtitleFileUrl, setSubtitleFileUrl] = useState('');
  const [openSubtitleFileUrl, setOpenSubtitleFileUrl] = useState('');
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

  // console.log('findMovies:', findMovies);

  useEffect(() => {
    // اگر findMovies تغییر کند، ref را مجدداً به عنصر دوم متصل می‌کنیم
    if (findMovies.length > 0) {
      myRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [findMovies]);

  const myRef = useRef(null);

  async function handleVideoUrlChange(value) {
    setVideoUrl(value);
  }

  // Open Dialog : select and store selected subtitle files into setSubtitleFile useState
  // function handleSubSelected(files) {
  //   const chosenFiles = Array.prototype.slice.call(files);
  //   setSubtitleFile(chosenFiles);
  // }

  function handleNameClick(name) {
    reset();
    setSelectedName(name);
    searchMovie(name);
  };

  // find movie data by OMDB API
  async function searchMovie(name, page=1) {
    const apiUrlMovie = `${OMDB_API_URL}${typeOfSearch}=${name}&page=${page}`;
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      if (data.Response === 'True') {
        if (typeOfSearch === 't') {
          setResultsPages([]);
          setFindMovies(new Array(data)); 
        } else {
          const totalPages = parseInt(data.totalResults / 10)
          const pages = new Array();
          for (let i = 0; i < totalPages; i++) {
            pages.push(i + 1);
          }
          setResultsPages(pages);
          setFindMovies(data.Search); 
        }
        myRef.current.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        setFindMovies([]);
      }
      setSelectedMovie({title: null, imdbID: null});
    } catch (error) {
      console.error('Error fetching links:', error);
    }

  };

  function reset() {
    setSubtitleFileUrl('');
    setOpenSubtitleFileUrl('');
    setSubtitleFile([]);
  }

  // set movieData and search subtitle for it when click on movie card
  function handlePosterClick(url, filename, title, year, poster, imdbID) {
    reset();
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

  
  //#region Subtitle Methods

/*   ****** SUB API *******
  // **********************
  
      
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
    try {
      const response = await fetch(url, {
        method: 'POST',
      });
      const data = await response.json();
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
      setSubSearchList(api === 'subdl' ? data.subtitles || [] : data.data)
    } catch (error) {
      console.error(error);
      return ([error]);
    }

  } 

  // set the setApi useState which source for searching subtitle [ subdl / opensubtitles ]
  function handleSubSrcChange(check){
    setSubSearchList([]); // clear search list for filling new results.
    setSelectedMovie({ title: null, imdbID: null });
    setApi(check ? 'subdl' : 'open');
  }
  

  // Show subtitle file link when select a subtitle
  async function handleSubtitleSelectChange(event) {
    setVttFileList([]);
    setSubtitleFileUrl('');
    setOpenSubtitleFileUrl('');
    console.log(event.target.value);
    if (event.target.value !== 'Please select a subtitle') {
      var url = ``;
      if (api === 'subdl') {
        url = `https://dl.subdl.com${event.target.value}`;
        setSubtitleFileUrl(url);
        handleZipFile(url);
      } else if (api === 'open') {
        url = `${event.target.value}`;
        await downloadOpenSubtitles(url);
        // setSubtitleFileUrl(openSubtitleFileUrl);
      }
    } else {
      // setSubtitleFileUrl('');
      // setOpenSubtitleFileUrl('')
    }
  }

  
  // unzip from a url and convert srt to vtt
  async function handleZipFile(zipUrl) {
    try{
      const zipResponse = await fetch(zipUrl);
      const zipData = await zipResponse.arrayBuffer();
      const zip = await JSZip.loadAsync(zipData);
      const vttFiles = [];
      const vttFilesContent = [];
      
      for (const [filename, file] of Object.entries(zip.files)) {
        if (filename.endsWith('.srt')) {
          const srtContent = await file.async("string");
          const vttContent = convertSrtToVtt(srtContent);
          const vttFilename = filename.replace('.srt', '.vtt');
          
          // fill select for choosing a vtt to add to movieData
          vttFilesContent.push({ vttFilename: vttFilename, vttContent: vttContent });
          
          
          // await saveFileToCloudflare(vttFilename, vttContent);
          vttFiles.push(`/subs/${vttFilename}`);
        }
      }
      
      setVttFileList(vttFilesContent);
      return vttFiles;
    } catch (error) {
      console.log(error);
    }
  }

  // convert srt to vtt
  function convertSrtToVtt(srtContent) {
    return 'WEBVTT\n\n' + srtContent.replace(/\r\n|\n/g, '\n').replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
  }

  // add vtt subtitle to subtitleFile useState
  function handleVttSelectChange(filename) {
    const vttFile = vttFileList.filter(vtt => vtt.vttFilename === filename);
    // console.log(vttFile);
    const { vttFilename, vttContent } = vttFile[0];
    if (window.confirm(`This is Okey ?\n${vttContent}`)) {

      // تبدیل VTT content به فایل Blob
      const blob = new Blob([vttContent], { type: 'text/vtt' });
      const file = new File([blob], vttFilename, { type: 'text/vtt' });
      
      // اضافه کردن فایل به setSubtitleFile
      setSubtitleFile((prevFiles) => [...prevFiles, file]);
    } 
  }

  //#endregion

  // 

  // https://upmediaa.upera.tv/2766450-11-720.mp4?ref=7wIA
  

  // Add videoData and subtitle if selected into formData and send it to WORKER for saving 
  const handleAddVideo = async () => {
    if (newVideo.url && !videoList.some(video => video.url === newVideo.url)) {

      const formData = new FormData();
      formData.append('videoData', JSON.stringify(newVideo));
      // If subtitle selected for uploading 
      if (subtitleFile) {
        subtitleFile.forEach((file, index) => {
          const random_id = Math.floor(Math.random() * 100);
          const type = file.name.endsWith('srt') ? 'srt' : 'vtt';
          formData.append(`subtitle${index + 1}_${type}_${random_id}`, file); // add type of subtitle (srt or vtt) to file name 
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

  async function getFileNameFromUrl(url) {
    // const oldFilename = new URL(url).pathname.split('/').pop();
    try {
      const response = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-10' } });
      if (response.ok) {
        const newFilename = new URL(response.url).pathname.split('/').pop();
        const cleanedFilename = newFilename.replace(/^\d+-\d+-/, '');
        return (cleanedFilename);
      }
    } catch (error) {
      console.log("Error fetching file name:", error);
    }
  }


  // console.log('subtitleFileUrl',subtitleFileUrl);
  // console.log('openSubtitleFileUrl',openSubtitleFileUrl);



  return (
    <div className='inputMovie'>
      <div className='inputSection'>
        <div className='input'>
          <input
            type="text"
            className='videoUrl'
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="Enter video URL"
          />
          {/* <input
            type="file"
            id='fileUpload'
            multiple
            accept=".vtt"
            // onChange={(e) => setSubtitleFile(e.target.files[0])}
            onChange={(e) => handleSubSelected(e.target.files)}
          /> */}
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
            <label htmlFor='typeOfSearch'>All Movies</label>
          </div>
          <div>
            <input id='byIMDB' type='checkbox' checked={byIMDB} onChange={(e) => setByIMDB(e.target.checked)} />
            <label htmlFor='byIMDB'>By IMDB ID</label>
          </div>
          <div>
            <input id='subSrc' type='checkbox' checked={api === 'subdl'} onChange={(e) => handleSubSrcChange(e.target.checked)} />
            <label htmlFor='subSrc'>{api === 'subdl' ? 'Subdl' : 'OpenSubtitles'}</label>
          </div>
        </div>


        <div>
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
        </div>



        {/* {(!findMovies.Response) && <h3>No movie found</h3>} */}
        {/* <a className={!subFileAddress ? 'inactive' : undefined} href={subFileAddress}>{subFileAddress}</a> */}


      </div>
      {/* ***** Movie Search Section ***** */}
      <div ref={myRef}>
        {findMovies.length > 0 && findMovies[0].Response !== 'False' &&
          <ul className='findMovieList'>
            {findMovies.map(movie => {
                return (
                  <li
                    className={selectedMovie.imdbID === movie.imdbID ? 'findMovies selected' : 'findMovies'}
                    key={movie.imdbID}>
                    {/* <button onClick={() => findMovieHandleClick(movie.Title)} className='movieName'>{movie.Title}</button> */}
                    <div
                      className='poster'
                      onClick={() => handlePosterClick(videoUrl, newName !== '' ? movie.Title : fileName, movie.Title, movie.Year, movie.Poster, movie.imdbID)}
                      style={{ backgroundImage: `url(${movie.Poster})`, }}>
                      <div className='movieData'>
                        <span className='title'>{movie.Title}</span>
                        <div className='type'><span>{movie.Type && movie.Type.toUpperCase()}</span> <span className='year'>{movie.Year}</span></div>
                        {movie.imdbRating &&
                          <span className='imdbRating'>IMDB: {movie.imdbRating}/10</span>}
                        {movie.Metascore &&
                          <span className='Metascore'>Metascore: {movie.Metascore}</span>}
                        {movie.Plot &&
                          <span className='plot'>{movie.Plot}</span>}
                        <div className='vttSelected'>
                          {subtitleFile.map((file, index) => <p key={index}><span className='vvtFile' >{file.name}</span></p>)}
                        </div>
                      </div>
                    </div>
                  </li>)
              })}
          </ul>
        }


        {/* Page numbers */}
        {(findMovies && findMovies.length > 1) &&
          <ul className='pageNumber' style={{ gap: '10px', justifyContent: 'center' }}>
            {resultsPages.map((page, index) =>
              page < 10 &&
              <li key={index} className='page'
                style={{ backgroundColor: '#119172', padding: '10px', borderRadius: '5px' }}
                  onClick={() => handlePageSelected(page)}>{page}</li>
              )}
          </ul>}

      </div>



        {/* Subtitle Search Section */}
        {selectedMovie.title &&
          <div className="SubSection">
            {subSearchList.length === 0 ?
              <h3>Searching for subtitle ... </h3> : <h3>Subtitle for <span className='subtitleFound'>{selectedMovie.title} - {subSearchList.length}</span> </h3>}

              {/* List of subtitles that found based of selected source [ subdl / opensubtitles ] */}
            <select className='subtitlesSelect' onChange={handleSubtitleSelectChange}>
                <option>Please select a subtitle</option>
                {subSearchList.map((result, index) => {
                  const name = api === 'subdl' ? result.release_name : result.attributes.release ?? result.attributes.slug;
                  const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                  return <option key={index} value={file}>{name}</option>
                })}
            </select>
            




            {(subtitleFileUrl !== '' || openSubtitleFileUrl) && 
            <div>
              {/* Show the URL of zip file or srt subtitle */}
              {/* <p className='subtitleFileUrl' style={{display: ''}}
                onClick={handleSubtileDownload}>{api === 'subdl' ? subtitleFileUrl : openSubtitleFileUrl}</p> */}

                {/* list of vtt files that unzip from zip which selected  */}
                <select className='vttSelect' defaultValue='defult' onChange={(event) => handleVttSelectChange(event.target.value)}>
                  <option value='defult'>Please select a vtt subtitle</option>
                  {subtitleFileUrl && vttFileList.map((result, index) => {
                    const content = api === 'subdl' ? result.vttContent : 'No subdl';
                    const name = api === 'subdl' ? result.vttFilename : result.attributes.release ?? result.attributes.slug;
                    // const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                    return <option key={index} title={content} value={name}>{name}</option>
                })}
              </select>
            </div>}
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

            {/*subSearchFileList.length !== 0 && <h3>Download link</h3>*/}
            {/* <ul className='subFileSearch'>
              {(subSearchFileList && subSearchFileList.length > 0) &&
                subSearchFileList.map((link) => <li key={link.title} onClick={() => handleSubtitle(link.url)}><p>{link.url}</p></li>)}
            </ul> */}

          </div>
        }
      <div style={{ padding: '5px 10px' }}>
        <button className='addBtn' onClick={handleAddVideo}>Add to my Video List</button>
      </div>
      </div>


  );
}

export default InputSection;
