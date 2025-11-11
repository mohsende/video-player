import React, { useEffect, useState, useRef, Children, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import JSZip from 'jszip';
import '../styles/InputSection.scss';
import Modal from './Modal.js';
import Skaleton from './Skaleton';
import { useNavigate } from 'react-router-dom';

import { customAlphabet } from 'nanoid';

// const HAJI_LICENSE = 'aNxVui2gLkJwqJEAadpiOtUXw44zoHR8rop9crfmXSc';
// const HAJI_LICENSE = 'Os0vxtpXI1RyggywxkJBrufpSYat3aAZn3w6H2qUgaqJu14znW7t1';
// const SUBDL_API_URL = 'https://api.subdl.com/api/v1/subtitles?api_key=h11PHJkLrVYI9ha6crzlKtt-UDAD_2OF&languages=fa&';

const OMDB_API_URL = 'https://www.omdbapi.com/?apikey=c3327b94&';

function InputSection({ WORKER_URL, videoList, setVideoList, setShowInputSection }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [subUrl, setSubUrl] = useState('');
  const [subtitleFile, setSubtitleFile] = useState([]);
  const [subtitleUploadedFile, setSubtitleUploadedFile] = useState([]);

  const fileName = videoUrl.split('/').pop();

  // fileName = fileName.replace(/%20|_/g, '.');
  const movieNameSuggestion = fileName.replace(/%20|_|-/g, '.').split('.')
  const suggestions = [];
  const [findMovies, setFindMovies] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [subSearchList, setSubSearchList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // const [subSearchFileList, setSubSearchFileList] = useState([]);
  const [vttFileList, setVttFileList] = useState([]);
  const [typeOfSearch, setTypeOfSearch] = useState('t');
  const [api, setApi] = useState('subdl');
  const [fileType, setFileType] = useState('mp4');
  const [subtitleFileUrl, setSubtitleFileUrl] = useState('');
  const [openSubtitleFileUrl, setOpenSubtitleFileUrl] = useState('');
  const [byIMDB, setByIMDB] = useState(true);
  const [resultsPages, setResultsPages] = useState([]);
  const [byEpisode, setByEpisode] = useState(true);

  const [newVideo, setNewVideo] = useState({
    id: undefined,
    url: undefined,
    title: '',
    type: '',
    year: '',
    poster: ''
  });
  const [selectedMovie, setSelectedMovie] = useState({
    title: null,
    imdbID: null
  });


  const subSelectRef = useRef(null);
  const mp4Ref = useRef(null);
  const mkvRef = useRef(null);
  const movieSectionRef = useRef(null);

  const location = useLocation();
  const newEpisode = location.state?.videoToEdit;
  // console.log(newEpisode);


  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const observer = useRef();

  const [subTotalPages, setSubTotalPages] = useState(1);
  const [subCurrentPage, setSubCurrentPage] = useState(1);


  let navigate = useNavigate();

  // const [addLastMovieRef, setAddLastMovieRef] = useState(true)

  // const lastMovieRef = useCallback(
  //   (node) => {
  //     // console.log("CALLBACK: page", page);
  //     if (typeOfSearch !== 't' && node && !loading && hasMore && isSearching) {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver(entries => {
  //         if (entries[0].isIntersecting) {
  //           setPage((prevPage) => prevPage + 1);
  //           // console.log("CALLBACK: page increament ", page);
  //           setAddLastMovieRef(false);
  //         }
  //       });
  //       observer.current.observe(node);
  //     }
  //   }, [loading, addLastMovieRef, typeOfSearch, hasMore, isSearching]);


  useEffect(() => {
    if (selectedName && isSearching) {
      searchMovie(selectedName, page);
    }
  }, [page, isSearching, selectedName]);
  
  // useEffect(() => {
    //   if (page === 1 && findMovies.length > 0 && movieSectionRef.current) {
      //     movieSectionRef.current.scrollIntoView({
        //       behavior: 'smooth',
        //     });
        //   }
        //   if (findMovies.length > 0) {
          //     console.log('useEffect: findMovies', findMovies);
          //   }
          // }, [page, findMovies]);
          
          useEffect(() => {
            if (selectedMovie.imdbID) {
      searchSubtitle(byIMDB ? selectedMovie.imdbID.split('tt').pop() : selectedMovie.title);
    }
  }, [subCurrentPage]);
  
  useEffect(() => {
    if (subSelectRef.current) {
      if (subSelectRef.current.value === 'default') {
        setVttFileList([]);
      }
    }
  }, [subSelectRef]);

  // useEffect(() => {

  // }, [subtitleUploadedFile]);


  // useEffect(() => {
  //   console.log(newVideo)
  // }, [newVideo.episode, newVideo.season])





  // useEffect(() => {
  //   // init();
  //   if (findMovies.length > 0) {
  //     movieSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  //   // console.log('useEffect');
  // }, [findMovies] );



  if (fileName !== '' && newName === '') {
    for (let i = 0; i < (movieNameSuggestion.length > 5 ? 5 : movieNameSuggestion.length); i++) {
      i === 0 ? suggestions.push(movieNameSuggestion[i]) : suggestions.push(suggestions[i - 1] + ' ' + movieNameSuggestion[i])
    }
  } else if (newName !== '') {
    suggestions[0] = newName;
  }
  
  // reset all data
  function reset() {
    setFindMovies([]);
    setNewVideo({
      id: undefined,
      url: undefined,
      title: '',
      type: '',
      year: '',
      poster: ''
    });
    setSubtitleFileUrl('');
    setOpenSubtitleFileUrl('');
    setFileType('mp4');
    setSubtitleFile([]);
    setSubSearchList([])
    setVttFileList([]);
    setIsSearching(false);
    setHasMore(true);
  }
  
  useEffect(() => {
    if (newEpisode) {
      // console.log(newEpisode)
      setVideoUrl(newEpisode.url);
    }
  }, []);

  function init() {
    console.log('init');
    setVideoUrl('dark');
    setFindMovies([
      {
        "Title": "Dark",
        "Year": "2017–2020",
        "Rated": "TV-MA",
        "Released": "01 Dec 2017",
        "Runtime": "60 min",
        "Genre": "Crime, Drama, Mystery",
        "Director": "N/A",
        "Writer": "Baran bo Odar, Jantje Friese",
        "Actors": "Louis Hofmann, Karoline Eichhorn, Lisa Vicari",
        "Plot": "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
        "Language": "German",
        "Country": "Germany, United States",
        "Awards": "8 wins & 25 nominations",
        "Poster": "https://m.media-amazon.com/images/M/MV5BM2RhZGVlZGItMGZiMy00YjdjLWIwMGUtMWYxOGIwNjA0MjNmXkEyXkFqcGc@._V1_SX300.jpg",
        "Ratings": [
          {
            "Source": "Internet Movie Database",
            "Value": "8.7/10"
          }
        ],
        "Metascore": "N/A",
        "imdbRating": "8.7",
        "imdbVotes": "470,407",
        "imdbID": "tt5753856",
        "Type": "series",
        "totalSeasons": "3",
        "Response": "True"
      }
    ]);
    setSelectedMovie({
      title: 'Dark',
      imdbID: 'tt5753856'
    });
    setNewVideo({
      url: 'dark',
      // filename: 'dark',
      title: 'Dark',
      year: '2017–2020',
      poster: 'https: //m.media-amazon.com/images/M/MV5BM2RhZGVlZG…WIwMGUtMWYxOGIwNjA0MjNmXkEyXkFqcGc@._V1_SX300.jpg',
    });
  }

  function generateNanoid() {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const generateId = customAlphabet(alphabet, 10);
    return generateId();
  }

  // Handle type url into url input
  async function handleVideoUrlChange(value) {
    if (findMovies.length > 0) {
      setFindMovies([]);
    }
    setVideoUrl(value);
  }

  // Open Dialog : select and store selected subtitle files into setSubtitleUploadedFile useState
  function handleSubSelected(event) {
    console.log(event.target.value); // the path of uploaded file
    const chosenFile = Array.prototype.slice.call(event.target.files[0]);
    setSubtitleUploadedFile(chosenFile);
    fileToVtt(chosenFile);
  }

  // Handle guess name click
  function handleNameClick(name) {
    reset();
    setIsSearching(true);
    setSelectedName(name);
    setPage(1);
    searchMovie(name, 1);

  };


  // Find movie data by OMDB API
  async function searchMovie(name, pageNo = 1) {
    if (!name || !isSearching || (totalPages && pageNo > totalPages)) return;
    setLoading(true);
    const apiUrl = `https://api.themoviedb.org/3/search/person?query=Louis%20Hofmann&include_adult=false&language=en-US&page=1`;
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
        // console.log(data);
      }
    } catch (error) {
      console.error('Error fetching TMDB:', error);
    }


    const apiUrlMovie = `${OMDB_API_URL}${typeOfSearch}=${name}&page=${pageNo}`;
    // console.log(apiUrlMovie);
    try {
      const response = await fetch(apiUrlMovie);
      const data = await response.json();
      if (data.Response === 'True') {
        if (typeOfSearch === 't') {
          // setResultsPages([]);
          // setFindMovies(new Array(data));
          setHasMore(false);
          setFindMovies([data]);

        } else {
          // const totalPages = parseInt(data.totalResults / 10)
          // const pages = new Array();
          // for (let i = 0; i < totalPages; i++) {
          //   pages.push(i + 1);
          // }
          // setResultsPages(pages); 
          if (pageNo === 1) {
            const pages = Math.floor(data.totalResults % 10 > 0 ? data.totalResults / 10 + 1 : data.totalResults / 10);
            setTotalPages(pages)
            setFindMovies(data.Search);
          } else {
            // console.log(data.Search);
            setFindMovies((prevFindMovies) => [...prevFindMovies, ...data.Search]);
          }
          // console.log('Search: page', pageNo, 'Total:', data.totalResults);
          if (data.Search.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
        // if (pageNo === 1) {
        //   movieSectionRef.current.scrollIntoView({
        //     behavior: 'smooth',
        //   });
        // }
      } else {
        setFindMovies([]);
        setHasMore(false);
      }
      setSelectedMovie({ title: null, imdbID: null });
    } catch (error) {
      console.error('Error fetching links:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }

  };

  // Handle Poster click set movieData and search subtitle for it when click on movie card
  function handlePosterClick(url, filename, title, type, year, poster, imdbID, e) {
    // console.log(`poster clicked -> imdbID: ${imdbID} - prevIMDB: ${selectedMovie.imdbID ?? 'null'}`);
    const { season, episode, fileType } = extractSeasonEpisodeFormat(url);
    // console.log(season);
    if (selectedMovie.imdbID !== imdbID) {
      // const className = e.target.parentElement?.className;
      reset();
      setSelectedMovie({
        title: title,
        imdbID: imdbID
      });

      setIsSearching(false);
      setHasMore(false);
      setFindMovies(findMovies.filter(movie => movie.Title === title)); // Show just selected movie when selected
      const newTitle = title.replaceAll(' ', '+');
      const newNanoid = generateNanoid();
      // console.log(newNanoid);
      setNewVideo({
        id: newNanoid,
        url: url,
        title: title,
        type: type,
        year: year,
        poster: poster,
        ...(type === 'series' && { season: season, episode: episode })
      })
    }
  }

  // Handle Search Subtitle button
  function handleSearchSubtitleClick(event, imdbID, title) {
    setVttFileList([]);
    setSubtitleFileUrl('');
    setSubUrl('');
    setOpenSubtitleFileUrl('');
    setSubSearchList([]); // clear search list for filling new results.
    setSelectedMovie({
      title: title,
      imdbID: imdbID
    });
    searchSubtitle(byIMDB ? imdbID.split('tt').pop() : title);
    // setIsSearching(true);
    setIsModalOpen(true);
    event.stopPropagation();
  }

  // #region ******* SUBTITLE SECTION Methods
  // ******************************************
  // set the setApi useState which source for searching subtitle [ subdl / opensubtitles ]
  function handleSubSrcChange(check) {
    setSubSearchList([]); // clear search list for filling new results.
    setSelectedMovie({ title: null, imdbID: null });
    setApi(check ? 'subdl' : 'open');
  }

  async function handleSubtitleUrlChange(value) {
    setSubUrl(value);
    if (value === '') {
      subSelectRef.current.disabled = false;
    } else {
      subSelectRef.current.value = 'default';
      subSelectRef.current.disabled = true;
    }
    setVttFileList([]);
  }

  async function handleSubDownloadByURL() {
    setVttFileList([]);
    // console.log('subUrl' , subUrl);
    if (subUrl !== '') {
      // Generate proxy URL
      const proxyUrl = `${WORKER_URL}proxyZip/${encodeURIComponent(subUrl)}`;
      await linkToVtt(proxyUrl);
    }
  }

  // General Subtitle Search by WORKER
  async function searchSubtitle(movieOrImdbID) {
    const query = byIMDB ? `imdb_id` : `movie`;
    const season_number = newVideo.season ? `&season=${newVideo.season}` : '';
    const episode_number = byEpisode ? `&episode=${newVideo.episode}` : '';
    var url = `${WORKER_URL}searchSubtitle?api=${api}&${query}=${movieOrImdbID}${season_number}${episode_number}&page=${subCurrentPage}`;
    // console.log(url, newVideo);
    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data);
      setSubSearchList(api === 'subdl' ? data.subtitles || [] : data.data)
      setSubTotalPages(api === 'subdl' ? data.totalPages || 1 : 1);
      // setSubCurrentPage(api === 'subdl' ? data.currentPages || 1 : 1);
    } catch (error) {
      console.error(error);
      return ([error]);
    }
  }

  // Show subtitle file link when select a subtitle
  async function handleSubtitleSelectChange(event) {
    // console.log(event);
    // const isUploadedFile = event.target.id !== '';
    setVttFileList([]);
    setSubtitleFileUrl('');
    setOpenSubtitleFileUrl('');
    const value = event.target.value;
    // if (!isUploadedFile) {
    if (value !== 'Please select a subtitle' && value !== 'nextPage' && value !== 'prevPage') {
      await linkToVtt(value);
      return;
    }
    if (value === 'Please select a subtitle') { return; }
    if (value === 'nextPage') {
      setSubCurrentPage(prevSubCurrentPage => prevSubCurrentPage + 1);
    } else {
      setSubCurrentPage(prevSubCurrentPage => prevSubCurrentPage - 1);
    }
    subSelectRef.current.value = 'default';
    // }
  }

  async function linkToVtt(link) {
    var url = ``;
    if (api === 'subdl') {
      url = `https://dl.subdl.com${link}`;
      if (subUrl !== '') {
        url = link;
      }
      // console.log(url);
      setSubtitleFileUrl(url);
      handleZipFile(url);
    } else if (api === 'open') {
      url = `${link}`;
      await downloadOpenSubtitles(url);
      // setSubtitleFileUrl(openSubtitleFileUrl);
    };
  }

  async function fileToVtt(file) {
    const type_of_file = file.split('.').pop();
    if (type_of_file === 'zip') {
      setSubtitleFileUrl(file);
      handleZipFile(file);
      return;
    }

    if (type_of_file === 'srt') {
      return;
    }

    if (type_of_file === 'vtt') {
      return;
    }
  }

  function handleModalClose() {
    setSubCurrentPage(1);
    setSubTotalPages(1);
    setIsModalOpen(false);
  }

  // Unzip from a SUBDL url and convert all srt file into vtt
  async function handleZipFile(zipUrl) {
    // console.log('zipUrl', zipUrl);
    try {
      let zipResponse;
      let zipData;
      if (zipUrl.startsWith('http')) {
        zipResponse = await fetch(zipUrl);
        zipData = await zipResponse.arrayBuffer();
      } else {
        zipData = await subtitleUploadedFile.arrayBuffer();
      }
      const zip = await JSZip.loadAsync(zipData);
      const vttFiles = [];
      const vttFilesContent = [];
      for (const [filename, file] of Object.entries(zip.files)) {
        if (filename.endsWith('.srt')) {
          // خواندن محتوای فایل با TextDecoder
          const srtContent = await detectEncoding(file);
          // console.log(`Best encoding detected: \n${srtContent.substring(0, 200)}`);
          // const srtContent = await readSrtFile(file);

          const vttContent = convertSrtToVtt(srtContent);
          // console.log(vttContent.substring(0, 200));
          const vttFilename = filename.replace('.srt', '.vtt');
          vttFilesContent.push({ vttFilename: vttFilename, vttContent: vttContent });
          vttFiles.push(`/subs/${vttFilename}`);
        }
      }
      setVttFileList(vttFilesContent);
      return vttFiles;
    } catch (error) {
      console.log('fetch zip file error:', error);
    }
  }

  async function detectEncoding(file) {
    const contentArrayBuffer = await file.async("arraybuffer");
    const view = new DataView(contentArrayBuffer);

    let encoding = 'utf-8';
    if (view.byteLength >= 2) {
      const bom = view.getUint16(0);
      if (bom === 0xFFFE)
        encoding = 'utf-16le';
      else if (bom === 0xFEFF)
        encoding = 'utf-16be';
    }
    if (encoding === 'utf-16le' || encoding === 'utf-16be') {
      return new TextDecoder(encoding, { fatal: false }).decode(view);
    }

    const decoders = [
      { name: 'utf-8', decoder: new TextDecoder('utf-8', { fatal: false }) },
      { name: 'windows-1256', decoder: new TextDecoder('windows-1256', { fatal: false }) },
      { name: 'iso-8859-6', decoder: new TextDecoder('iso-8859-6', { fatal: false }) },
      { name: 'windows-1252', decoder: new TextDecoder('windows-1252', { fatal: false }) },
    ];

    const bytes = new Uint8Array(contentArrayBuffer);
    let bestMatch = { encoding: null, readableText: null, score: 0 };
    for (let { name, decoder } of decoders) {
      try {
        const text = decoder.decode(bytes);
        const score = evaluateTextQuality(text);
        if (score > bestMatch.score) {
          bestMatch = { encoding: name, readableText: text, score };
        }
      } catch (error) {
        console.log(`Error decoding with ${name}:`, error);
      }
    }

    // encode by bestMatch
    const selectedDecoder = decoders.find(({ name }) => name === bestMatch.encoding)?.decoder;
    if (selectedDecoder) {
      return selectedDecoder.decode(bytes);
    }

    console.log("No suitable encoding found.");
    return null;
  }

  // تابع بررسی کیفیت متن (امتیازدهی به متن خوانا)
  function evaluateTextQuality(text) {
    let score = 0;
    // اگر حروف فارسی در متن هست، امتیاز بده
    if (/[آ-ی]/.test(text)) score += 10;
    // اگر حروف غیرقابل نمایش (مثل علامت سوال، مربع) زیاد باشه، امتیاز کم کن
    const unreadableChars = text.match(/[\uFFFD�]/g);
    if (unreadableChars) score -= unreadableChars.length * 2;
    return score;
  }

  function convertSrtToVtt(srtContent) {
    let vttContent = 'WEBVTT\n\n';
    vttContent += srtContent
      .replace(/\r\n|\n/g, '\n')
      .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
    return vttContent;
  }

  // Convert srt to vtt
  // function convertSrtToVtt(srtContent) {
  //   return 'WEBVTT\n\n' + srtContent.replace(/\r\n|\n/g, '\n').replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
  // }

  // Add vtt subtitle to subtitleFile useState
  function handleVttSelectChange(filename) {
    if (filename === 'default') { return; }
    const vttFile = vttFileList.filter(vtt => vtt.vttFilename === filename);
    const { vttFilename, vttContent } = vttFile[0];
    if (window.confirm(`This is Okey ?\n${vttContent.substring(0, 100)}`)) {
      const blob = new Blob([vttContent], { type: 'text/vtt' });
      const file = new File([blob], vttFilename, { type: 'text/vtt' });
      if (!subtitleFile.some(file => file.name === filename)) {
        setSubtitleFile((prevFiles) => [...prevFiles, file]);
      } else {
        console.log('This file already exist!');
      }
    }
  }

  // Create a temperary srt link by OPENSUBTITLES 
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

  //#endregion ******* SUBTITLE SECTION Methods

  // async function getFileNameFromUrl(url) {
  //   // const oldFilename = new URL(url).pathname.split('/').pop();
  //   try {
  //     const response = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-10' } });
  //     if (response.ok) {
  //       const newFilename = new URL(response.url).pathname.split('/').pop();
  //       const cleanedFilename = newFilename.replace(/^\d+-\d+-/, '');
  //       return (cleanedFilename);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching file name:", error);
  //   }
  // }


  // #region File-Data-Section
  // **************************
  // When click on file-data stopPropagation 
  function handleFileDataClick(event) {
    event.stopPropagation();
  }

  // set Season and Episode number
  function handleSeasonEpisodeClick(op, isSeason) {
    // console.log(op, isSeason);
    if (isSeason) {
      if (op === "-") {
        if (newVideo.season > 1) {
          setNewVideo({
            ...newVideo,
            season: newVideo.season - 1,
          });
        }
      } else {
        setNewVideo({
          ...newVideo,
          season: newVideo.season + 1,
        });
      }
    } else {
      if (op === "-") {
        if (newVideo.episode > 1) {
          setNewVideo({
            ...newVideo,
            episode: newVideo.episode - 1,
          });
        }
      } else {
        setNewVideo({
          ...newVideo,
          episode: newVideo.episode + 1,
        });
      };
    };
    
  };

  function handleFileTypeClick(target) {
    // console.log(target.innerText);
    if (target.innerText === 'mkv') {
      mkvRef.current.className = 'selected';
      mp4Ref.current.className = '';
    } else {
      mp4Ref.current.className = 'selected';
      mkvRef.current.className = '';
    }
    setFileType(target.innerText);
    console.log(target.innerText);
  }

  // Handle click on subtitle to remove it
  function handleSubtitleClick(filename) {
    const newList = subtitleFile.filter(file => file.name !== filename);
    setSubtitleFile(newList);
  }
  // #endregion File-Data-Section

  // Handle page number click
  function handlePageSelected(page) {
    searchMovie(selectedName, page)
  }

  // Add videoData and subtitle if selected into formData and send it to WORKER for saving 
  const handleAddVideo = async () => {
    if (videoUrl !== '') {
      if (newVideo.url) {
        if (!videoList.some(video => video.url === newVideo.url)) {
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
            setSubtitleFile([]);
            setShowInputSection(false);
            navigate('/');
          } catch (error) {
            console.error('Error saving links:', error);
          };
        } else {
          alert('This url already exist in your movie list!');
        }
      } else {
        alert('Please select your movie or serie from list.');
      };
    } else {
      alert('Please insert your movie or serie url.');
    }
  };


  function handleTypeOfSearchChanged(event) {
    setIsSearching(false);
    setTypeOfSearch(event.target.checked ? 's' : 't');
  }

  function handleToggleByEpisode() {
    if (byEpisode)
      setByEpisode(false);
    else
      setByEpisode(true);
  }

  function extractSeasonEpisodeFormat(url) {
    const pattern = /[Ss](?:eason)?\s*(\d{1,2})[^\d]?[Ee](?:pisode)?\s*(\d{1,2})/;
    const match = url.match(pattern);

    // استخراج فرمت فایل (قسمت آخر بعد از نقطه)
    const extMatch = url.match(/\.([a-z0-9]+)(?:\?|#|$)/i);

    return {
      season: match ? parseInt(match[1], 10) : null,
      episode: match ? parseInt(match[2], 10) : null,
      format: extMatch ? extMatch[1].toLowerCase() : null
    };
  }


  // console.log('subSearchList', subSearchList);
  // console.log('selectedMovie', selectedMovie);
  // console.log('findMovies', findMovies);
  // console.log('openSubtitleFileUrl',openSubtitleFileUrl);



  return (
    <div className='input-movie'>
      <div className='url-section'>
        <div className='input'>
          <input
            type="text"
            className='video-url'
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
      <div className='movie-section'>
        <input
          type='text'
          className='new-name'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='Movie name'
        />
        <div className='type-of-search'>
          <div>
            <input id='typeOfSearch' type='checkbox' checked={typeOfSearch === 's'} onChange={(e) => handleTypeOfSearchChanged(e)} />
            <label htmlFor='typeOfSearch'>All</label>
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


        {fileName !== '' &&
          <ul className='movie-name-guesses'>
            {suggestions.map((name, index) =>
              <li className='movie-name'
                key={index}>
                <button className='names'
                  style={{ backgroundColor: selectedName === name ? '#d19172' : '' }}
                  onClick={() => handleNameClick(name)}>
                  {name}
                </button>
              </li>)}
          </ul>
        }



        {/* {(!findMovies.Response) && <h3>No movie found</h3>} */}
        {/* <a className={!subFileAddress ? 'inactive' : undefined} href={subFileAddress}>{subFileAddress}</a> */}


      </div>
      {/* ***** Movie Search Section ***** */}
      <div ref={movieSectionRef} className='find-movie-section'>
        {loading && <><Skaleton /><Skaleton /></>}
        {findMovies.length > 0 && findMovies[0].Response !== 'False' && <>
          <ul className='find-movie-list'>
            {findMovies.map((movie, index) => {
              const isLastMovie = index === findMovies.length - 1;
              return (
                <li className='find-movie' key={index}>
                  <div
                    className='poster'
                    onClick={(e) => handlePosterClick(videoUrl, movie.Type === 'series' ? `${movie.Title}-S${newVideo.season}E${newVideo.episode}` : `${movie.Title}`, movie.Title, movie.Type, movie.Year, movie.Poster, movie.imdbID, e)}
                    style={{ backgroundImage: `url(${movie.Poster})`, }}>
                    <div className='movie-data'>
                      <span className='title'>{movie.Title}</span>
                      <div className='type'>
                        <span>{movie.Type && movie.Type.toUpperCase()}</span> <span className='year'>{movie.Year}</span>
                      </div>
                      {movie.imdbRating && <span className='imdb-rating'>IMDB: {movie.imdbRating}/10</span>}
                      {movie.Metascore && <span className='meta-score'>Metascore: {movie.Metascore}</span>}
                      {movie.Plot && <span className='plot'>{movie.Plot}</span>}

                    </div>




                    {selectedMovie.title &&
                      <div className='file-data' onClick={(event) => handleFileDataClick(event)}>
                        {/* <div className='section-row file-name'> */}
                        {/* <span>File name</span> */}
                        {/* <input className='' style={{ width: 'auto' }} 
                            type='text'
                            value={movie.Type === 'series' ? `${newVideo.title}-S${newVideo.season}E${newVideo.episode}` : `${newVideo.title}`}
                            // value=`${fileData.season}S${fileData.season}E${fileData.episode}`
                            onChange={(e) => setNewVideo({ ...newVideo, filename: e.target.value })}
                          /> */}
                        {/* </div> */}

                        {movie.Type === 'series' && <>
                          <div className="section-row season-episode">
                            <span className="title">Season</span>
                            <div className="picker">
                              <button onClick={() => handleSeasonEpisodeClick("-", true)}>
                                -
                              </button>
                              <span>{newVideo.season}</span>
                              <button onClick={() => handleSeasonEpisodeClick("+", true)}>
                                +
                              </button>
                            </div>
                          </div>

                          <div className="section-row season-episode">
                            <span className="title">Episode</span>
                            <div className="picker">
                              <button onClick={() => handleSeasonEpisodeClick("-", false)}>
                                -
                              </button>
                              <span>{newVideo.episode}</span>
                              <button onClick={() => handleSeasonEpisodeClick("+", false)}>
                                +
                              </button>
                            </div>
                          </div>
                        </>
                        }
                        <div className='section-row file-type'>
                          {/* <span className="title">File type</span> */}
                          <button ref={mkvRef} className={fileType === 'mkv' ? 'selected' : undefined}
                            onClick={(e) => handleFileTypeClick(e.target)}>mkv</button>
                          <button ref={mp4Ref} className={fileType === 'mp4' ? 'selected' : undefined}
                            onClick={(e) => handleFileTypeClick(e.target)}>mp4</button>
                          {selectedMovie.title && <>
                            <button onClick={(event) => handleSearchSubtitleClick(event, movie.imdbID, movie.Title)}
                              className='search-subtitle-btn'>Search Sub</button>
                            {movie.Type === 'series' && <div className={`check-section-proxy ${byEpisode ? 'checked' : 'unchecked'}`}>
                              <div className={`byEpisode ${byEpisode ? 'checked' : 'unchecked'}`}
                                onClick={handleToggleByEpisode}>
                                <div className={byEpisode ? `checked` : 'unchecked'}></div>
                              </div>
                            </div>}
                            </>
                          }
                        </div>



                        {/* Subtitle Search Section */}
                        {subSearchList.length >= 0 && <>
                          <Modal
                            isOpen={isModalOpen}
                            onClose={handleModalClose}
                            isPopUp={true}
                          >
                            <div className="sub-section">
                              {/* { */}
                              // subSearchList.length === 0 ?
                              <div className='upload'>
                                <span className='subtitle-nothing-found'>Nothing</span>

                                {/* <div>
                                  <input id='subSrcFileOrURL' type='checkbox' checked={true} onChange={(e) => handleSubSrcChange(e.target.checked)} />
                                  <label htmlFor='subSrcFileOrURL'>{api === 'subdl' ? 'FileUpload' : 'URL'}</label>
                                </div> */}

                                <div style={{ display: 'flex' }}>

                                  <input style={{ flexGrow: '1' }}
                                    type="text"
                                    id='subURL'
                                    className='sub-url'
                                    value={subUrl}
                                    onChange={(e) => handleSubtitleUrlChange(e.target.value)}
                                    placeholder="Enter subtitle URL to download"
                                  />
                                  <button onClick={() => handleSubDownloadByURL()}>
                                    +
                                  </button>
                                </div>

                                {/* <input
                                  type="file"
                                  id='fileUpload'
                                  // multiple
                                  accept=".vtt,.srt,.zip"
                                  // onChange={(e) => setSubtitleFile(e.target.files[0])}
                                  onChange={handleSubSelected}
                                /> */}
                              </div>
                              {/* : */}
                              <>
                                {/* List of subtitles that found based of selected source [ subdl / opensubtitles ] */}
                                <div className='subtitles-section'>
                                  <select ref={subSelectRef} className='subtitles-select' defaultValue='default' onChange={handleSubtitleSelectChange}>
                                    <option value='default'>Please select a subtitle</option>
                                    {subSearchList.map((result, index) => {
                                      const name = api === 'subdl' ? result.release_name : result.attributes.release ?? result.attributes.slug;
                                      const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                                      return <option key={index} value={file}>{name}</option>
                                    })}
                                    {subCurrentPage < subTotalPages && <option key='nextPage' value='nextPage'>Next Page &gt;&gt;&gt;</option>}
                                    {subCurrentPage > 1 && <option key='prevPage' value='prevPage'> &lt;&lt;&lt; Previous Page</option>}
                                  </select>
                                </div>



                                {/* {(subtitleFileUrl !== '' || openSubtitleFileUrl) &&  */}
                                {(vttFileList.length > 0) &&
                                  <div className='vtt-section'>
                                    {/* Show the URL of zip file or srt subtitle */}
                                    {/* <p className='subtitleFileUrl' style={{display: ''}}
                                        onClick={handleSubtileDownload}>{api === 'subdl' ? subtitleFileUrl : openSubtitleFileUrl}</p> */}



                                    {/* list of vtt files that unzip from zip which selected  */}
                                    <select className='vtt-select' defaultValue='default' onChange={(event) => handleVttSelectChange(event.target.value)}>
                                      <option value='default'>Please select a vtt subtitle</option>
                                      {subtitleFileUrl && vttFileList.map((result, index) => {
                                        const content = api === 'subdl' ? result.vttContent : 'No subdl';
                                        const name = api === 'subdl' ? result.vttFilename : result.attributes.release ?? result.attributes.slug;
                                        // const file = api === 'subdl' ? result.url : result.attributes.files[0].file_id ?? result.attributes.url;
                                        return <option key={index} /*title={content}*/ value={name}>{name}</option>
                                      })}
                                    </select>
                                  </div>}
                              </>
                              {/* } */}
                            </div>
                          </Modal>
                        </>
                        }




                        {subtitleFile.length > 0 &&
                          <div className='vtt-selected'>
                            {subtitleFile.map((file, index) => <p key={index}
                              className='vtt-file section-row'
                              onClick={() => handleSubtitleClick(file.name)}>
                              {file.name}
                            </p>)}
                          </div>
                        }



                      </div>
                    }
                    <div className='add-button'>
                      <button className='add-btn' onClick={handleAddVideo}>Add to my Video List</button>
                    </div>
                  </div>
                  {/* {isLastMovie && <div className='last' ref={lastMovieRef} />} */}
                </li>)
            })}
          </ul>

          {!loading && typeOfSearch === 's' && hasMore && <div className='load-more' onClick={() => setPage(prevPage => prevPage + 1)}>Load more</div>}
        </>}
        {loading && <div className='loading' > Loading ...</div>}

        {/* Page numbers */}
        {/*         
        {(findMovies && findMovies.length > 1) &&
        <ul className='page-number'>
          {resultsPages.map((pageNo, index) =>
            pageNo < 10 &&
            <li key={index} className='page'
              style={{ backgroundColor: '#119172', padding: '10px', borderRadius: '5px' }}
              onClick={() => handlePageSelected(pageNo)}>{pageNo}</li>
          )}
        </ul>
        } 
        */}
      </div>
    </div>
  );
}

export default InputSection;
