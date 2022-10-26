import { Notify } from 'notiflix';
import { Report } from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import fetchPhotos from './customFunction/fetchPhotos';
import createSmallImgMarkup from './customFunction/funcrionRender';
import cleanRender from './customFunction/functionCleanRender';
// import './css/styles.css';
import '../css/index.css';
const lightbox = new SimpleLightbox('.gallery__link', { showCounter: false });
// -----------------

// -------------------

// const optionsObserv = {
//   root: null,
//   rootMargin: '30px',
//   threshold: 1,
// };
//const observer = new IntersectionObserver(onLoad, optionsObserv);
let page;
let perPage = 40;
let totalPage;
let totalHitsPhotos;
let inputValue = '';

const optionsNotify = {
  position: 'center-center',
  showOnlyTheLastOne: true,
  timeout: 4000,
};
const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  guardEl: document.querySelector('.guard'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};
refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtnEl.addEventListener('click', onLoad);
// -------------------
refs.loadMoreBtnEl.setAttribute('hidden', true);
//--------------------
function onFormSubmit(evt) {
  evt.preventDefault();
  refs.loadMoreBtnEl.setAttribute('hidden', true);

  // window.scrollBy({
  //   behavior: 'auto',
  // });
  window.scrollTo(top);
  page = 1;

  inputValue = evt.target.elements.searchQuery.value.toLowerCase().trim();
  if (inputValue === '') {
    cleanRender(refs.galleryEl);
    Report.info('Please', 'Fill in the search field!', 'Okay', {
      backOverlayClickToClose: true,
    });
    return;
  }

  fetchPhotos(inputValue, perPage, page)
    .then(response => {
      cleanRender(refs.galleryEl);

      if (response.data.total === 0) {
        refs.loadMoreBtnEl.setAttribute('hidden', true);
        Report.warning(
          'Sorry',
          'There are no images matching your search query. Please try again.',
          'Okay',
          {
            backOverlayClickToClose: true,
          }
        );
        return;
      }
      refs.loadMoreBtnEl.removeAttribute('hidden');
      totalPage = Math.ceil(response.data.totalHits / perPage);
      totalHitsPhotos = response.data.totalHits;

      Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
        showOnlyTheLastOne: true,
      });
      const imgMarkUp = createSmallImgMarkup(response.data.hits);
      refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkUp);

      lightbox.refresh();
    })
    .catch(error => console.log(error));
}

function onLoad() {
  if (inputValue === '') {
    return;
  }

  page += 1;
  if (totalHitsPhotos > 0 && page > totalPage) {
    refs.loadMoreBtnEl.setAttribute('hidden', true);
    Notify.warning(
      'We are sorry, but you have reached the end of search results.',
      optionsNotify
    );
    // observer.unobserve(refs.guardEl);
    return;
  }

  fetchPhotos(inputValue, perPage, page).then(response => {
    const imgMarkUp = createSmallImgMarkup(response.data.hits);
    refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkUp);
    // //*********************************
    const { height: cardHeight } =
      refs.galleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    //*************************************
    lightbox.refresh();
  });
}
