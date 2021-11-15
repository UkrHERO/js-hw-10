import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import API from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  oneCountry: document.querySelector('.country-info'),
  head: document.querySelector('head'),
};

refs.head.insertAdjacentHTML(
  'beforeend',
  `<style>
  .country-info {
    padding-left: 30px;
  }
.item {
 list-style:none;
 display:flex;
 margin-bottom:20px;
 align-items: center;
}

.flag {
  margin-right:15px;
}

  .name{
font-weight:600;
margin:0;
  }

  .country {
    display:flex;
    margin-bottom:20px;
    align-items: center;
  }

  .country__name {
font-weight:600;
margin:0;
font-size:22px;
  }

  .country__info {
font-weight:600;
  }
.country__span {
font-weight:400;
  }
  
}</style>`,
);

refs.inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const search = e.target.value;
  if (search.length < 1) {
    refs.oneCountry.innerHTML = '';
    refs.countryList.innerHTML = '';
  }

  API.fetchCountries(search).then(renderCountry).catch(onFetchError);
}

function renderCountry(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    refs.countryList.innerHTML = '';
  } else if (countries.length < 10 && countries.length >= 2) {
    const markup = countries
      .map(country => {
        return `<li class="item">
         <img class="flag" src="${country.flags.svg}" width="35" height="20" alt="Flag">
          <p class="name">${country.name}</p>
        </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
    refs.oneCountry.innerHTML = '';
  } else if (countries.length === 1) {
    const markup = countries
      .map(country => {
        return `<div class="country">
          <img class="flag" style="margin-right:15px;" src="${
            country.flags.svg
          }" width="35" height="20" alt="Flag">
          <p class="country__name" style="">${country.name}</p>
          </div>
          <p class="country__info">Capital: <span class="country__span">${
            country.capital
          }</span></p>
          <p class="country__info">Population: <span class="country__span">${
            country.population
          }</span></p>
          <p class="country__info">Languages: <span class="country__span">${country.languages
            .map(item => item.name)
            .join(', ')}</span></p>
        `;
      })
      .join('');
    refs.oneCountry.innerHTML = markup;
    refs.countryList.innerHTML = '';
  }
}

function onFetchError() {
  Notiflix.Notify.warning(`Oops, there is no country with that name`);
}
