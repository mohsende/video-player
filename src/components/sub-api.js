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
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status) {
      return (data.data);
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
  try {
    const response = await fetch(url);
    const data = await response.json();
    return (data.data);
  } catch (error) {
    console.error(error);
    return ([error]);
  }
}



