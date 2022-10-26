import axios from 'axios';
const BASEURL = 'https://pixabay.com/api/';
const keyApiPix = '30040272-179178153c29e3da83ceec1ea';

export default async function fetchPhotos(keyWord, perPage, page) {
  const response = await axios.get(
    `${BASEURL}?key=${keyApiPix}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );

  return response;
}
//
