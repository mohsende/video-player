import { useState } from "react";

// const HAJI_LICENSE = 'aNxVui2gLkJwqJEAadpiOtUXw44zoHR8rop9crfmXSc';
const HAJI_LICENSE = 'Os0vxtpXI1RyggywxkJBrufpSYat3aAZn3w6H2qUgaqJu14znW7t1';
const ONE_API_LICENSE = '753695:672f0ecc7ea36';
const ONE_API_URL = 'https://one-api.ir/film2subtitle/?token=753695:672f0ecc7ea36&action=';

function SubtitleSection({ title }) {
  // const [newTitle, setNewTitle] = useState('');
  const [subSearchList, setSubSearchList] = useState([]);
  // const [subFileAddress, setSubFileAddress] = useState('');
  
  // const [subSearchList2, setSubSearchList2] = useState([]);
  // const [subFileAddress2, setSubFileAddress2] = useState('');

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


  async function searchSubtitle2() {
    const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/search?s=${title}&license=${HAJI_LICENSE}`;
    // await alert(apiUrl);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.result)
        return data.result;
      else {
        console.log('Subtitle Not Found.', data.result);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchSubtitleFile2(downloadAPI) {
    // const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/download?url=${link}&license=${license}`;

    try {
      const response = await fetch(downloadAPI);
      const data = await response.json();
      if (data.result)
        return(data.result);
      else {
        console.log('Subtitle file Not Found.', data.result);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchSubtitleOneApi() {
    // const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/search?s=${title}&license=${HAJI_LICENSE}`;
    const apiUrl = `https://one-api.ir/film2subtitle/?token=${ONE_API_LICENSE}&action=search&q=${title}`;
    // await alert(apiUrl);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.result) {
        console.log(data.result);
        return data.result;
      }
      else {
        console.log('Subtitle Not Found.', data.result);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchSubtitleFileOneApi(link) {
    // const apiUrl = `https://api3.haji-api.ir/majid/movie/subtitle/download?url=${link}&license=${license}`;

    try {
      const response = await fetch(link);
      const data = await response.json();
      if (data.result)
        return(data.result);
      else {
        console.log('Subtitle file Not Found.', data.result);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }


  // const searchList = searchSubtitle2();
  // setSubSearchList2(searchList);
  
  console.log('title: ', title);
  const searchList = [];
  if (title) {
    // searchList.push(searchSubtitleOneApi());
    // setSubSearchList(searchList);
  }
  console.log('searchList: ', searchList);
  console.log('subSearchList: ', subSearchList);
  
  return (
  <div className="SubSection">
    <h1>search {title}</h1>
    <ul>
      {
          (subSearchList && subSearchList.length) > 0 &&
          subSearchList.map((result) => 
          // console.log(result)
            <li>{result.link}</li>
          )
      
      }
    </ul>
  </div>
  )
}

export default  SubtitleSection;