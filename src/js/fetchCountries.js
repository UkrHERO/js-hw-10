function fetchCountries(country) {
  if (country.length > 0) {
    return fetch(
      `https://restcountries.com/v2/name/${country}?fields=name,capital,population,languages,flags`,
    )
      .then(response => {
        if (response.status === 404) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .catch(() => {
        Notiflix.Notify.warning(`Oops, there is no country with that name`);
      });
  }
}

export default { fetchCountries };
