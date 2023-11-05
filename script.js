//#region DB initialize
const firebaseConfig = {
  apiKey: "AIzaSyDWTORxEsRlsSNGXT5_hkivLUC8bj10oHE",
  authDomain: "dismoviery-web.firebaseapp.com",
  projectId: "dismoviery-web",
  storageBucket: "dismoviery-web.appspot.com",
  messagingSenderId: "444895114611",
  appId: "1:444895114611:web:2d1eeebeffad0691d88106",
};
firebase.initializeApp(firebaseConfig); // Inicializaar app Firebase
const db = firebase.firestore(); // db representa mi BBDD //inicia Firestore
//#endregion

//Main section is where cards will be displayed
const mainSection = document.getElementById("main-section");
let moviesData = [];
//options needed for fetch requests:
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
  },
};

//#region Mobile nav
const toggleButton = document.getElementById("toggle-button");
const dropDownMenu = document.getElementById("dropdown-menu");
const toggleButtonIcon = document.getElementById("toggle-button-icon");

toggleButton.addEventListener("click", (event) => {
  dropDownMenu.classList.toggle("open");
  toggleButtonIcon.classList = dropDownMenu.classList.contains("open")
    ? "fa-solid fa-xmark"
    : "fa-solid fa-bars";
});
//#endregion

//#region Main Page
function printMovieCards(moviesData) {
  let movieCardContainerHTML = `<section class="movie-card-container">`;
  moviesData.forEach((movie) => {
    if (movie.poster_path) {
      movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                <h3 class="dynamic-font-size">${movie.title}</h3>
            </section>`;
    } else {
      movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" alt="Poster Image">
                <h3 class="dynamic-font-size">${movie.title}</h3>
            </section>`;
    }
  });
  movieCardContainerHTML += `</section>`;
  mainSection.innerHTML += movieCardContainerHTML;
}
function listenForClicks() {
  mainSection.addEventListener("click", async (event) => {
    const movieCard = event.target.closest(".movie-card");
    if (movieCard) {
      const movieId = movieCard.getAttribute("data-movie-id");
      if (movieId) {
        console.log(movieId);
        await fetchAndDisplayMovieDetails(movieId);
      }
    }
  });
}
async function fetchAndDisplayMovieDetails(id) {
  const movieDetails = document.getElementById("movie-details");
  //Show details window
  movieDetails.innerHTML = "";
  movieDetails.style.removeProperty("display");
  movieDetails.style.display = "flex";

  let movieTrailerKey = "";
  await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      //Get youtube trailer id key
      console.log(response.results.reverse());
      response.results.forEach((video) => {
        if (video.type == "Trailer") {
          movieTrailerKey = video.key;
        }
      });
      //   movieTrailerKey = response.results.reverse()[0].key;  NOT ALWAYS TRAILER
    })
    .catch((err) => console.error(err));

  await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      //Get movie genres
      let movieGenres = "";
      response.genres.forEach(
        (genre) => (movieGenres += `<div class='genre-tag'>${genre.name}</div>`)
      );
      console.log(movieGenres);

      movieDetails.innerHTML = `
        <div id="movie-details-nav">
            <i id="movie-details-fav" class="fa-solid fa-star"></i>
            <i id="movie-details-watchlater" class="fa-solid fa-clock"></i>
            <i id="movie-details-close" class="fa-solid fa-xmark"></i>
        </div>
        <div id="movie-details-container">
            <div id="movie-details-title">${response.title}</div>
            <div id="movie-details-main">
                <iframe id="movie-details-trailer" src="https://www.youtube.com/embed/${movieTrailerKey}">
                </iframe>
                <div id="movie-details-overview">${response.overview}</div>
            </div>
            <div id="movie-details-footer">
            <div id="movie-details-genres">
            ${movieGenres}
            </div>
            <div id="movie-details-date">
            ${response.release_date}
                </div>
                </div>
                </div>
                `;
      movieDetails.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${response.backdrop_path})`;
    })
    .catch((err) => console.error(err));
  document
    .getElementById("movie-details-close")
    .addEventListener("click", (event) => {
      event.preventDefault();
      movieDetails.style.removeProperty("display");
      movieDetails.style.display = "none";
      movieDetails.innerHTML = ""; //fix youtube video playing in background
    });
}
async function printMostPopular() {
  await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      moviesData = response.results;
      mainSection.innerHTML += `<span class="category-title">Most Popular</span><section class="movie-card-container">`;
      printMovieCards(moviesData);
      mainSection.innerHTML += `</section>`;
    })
    .catch((err) => console.error(err));
}
async function printNowPlaying() {
  await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      moviesData = response.results;
      mainSection.innerHTML += `<span class="category-title">Now Playing</span><section class="movie-card-container">`;
      printMovieCards(moviesData);
      mainSection.innerHTML += `</section>`;
    })
    .catch((err) => console.error(err));
}
async function printUpcoming() {
  await fetch(
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      let moviesData = response.results;
      mainSection.innerHTML += `<span class="category-title">Upcoming</span><section class="movie-card-container">`;
      printMovieCards(moviesData);
      mainSection.innerHTML += `</section>`;
    })
    .catch((err) => console.error(err));
}
//Functions to show and hide Search filters
function hideSearchFilters() {
  const searchFilters = document.getElementById("search-results");
  searchFilters.style.removeProperty("display");
  searchFilters.style.display = "none";
}
function showSearchFilters() {
  const searchFilters = document.getElementById("search-results");
  searchFilters.style.removeProperty("display");
  searchFilters.style.display = "flex";
}
async function mainPageLoad() {
  hideSearchFilters();
  await printMostPopular();
  await printNowPlaying();
  await printUpcoming();
  //Event listener for clicks on cards
  listenForClicks();
}
mainPageLoad();
//#endregion

//#region Search
function sortByDateDesc(moviesData) {
  moviesData.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return dateB - dateA;
  });
}
function sortByDateAsc(moviesData) {
  moviesData.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return dateA - dateB;
  });
}
function sortByPopularityDesc(moviesData) {
  moviesData.sort((a, b) => {
    return b.popularity - a.popularity;
  });
}
function sortByPopularityAsc(moviesData) {
  moviesData.sort((a, b) => {
    return a.popularity - b.popularity;
  });
}
async function searchMovies(search) {
  mainSection.innerHTML = "";
  document.getElementById("sort-results").selectedIndex = 0; //Selected Popularity as default each time user searches
  moviesData = [];
  showSearchFilters();
  hideDiscoverFilters();
  //We are gonna search page by page (each page = 20 results) until no more results
  let searchResultsLength = 0;
  let page = 1;
  while (true) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
      options
    );

    if (!response.ok) {
      console.error(`Error fetching data: ${response.status}`);
      break;
    }

    const data = await response.json();
    moviesData.push(...data.results);
    searchResultsLength = data.results.length;
    page++;

    if (searchResultsLength === 0) {
      break; // No more results to fetch
    }
  }

  //Sort by popularity date by default
  sortByPopularityDesc(moviesData);
  console.log(moviesData);
  printMovieCards(moviesData);
  listenForClicks();
}

//Event listener for Search Button
document.getElementById("search-button").addEventListener("click", (event) => {
  event.preventDefault();
  console.log(event.target.parentNode.form[0].value);
  if (event.target.parentNode.form[0].value) {
    searchMovies(event.target.parentNode.form[0].value);
  } else console.log("Please search something");
});
//Search sort
let sortSelect = document.getElementById("sort-results");
sortSelect.addEventListener("change", () => {
  const selectedSort = sortSelect.value;
  switch (selectedSort) {
    case "release-date-desc":
      sortByDateDesc(moviesData);
      mainSection.innerHTML = "";
      printMovieCards(moviesData);
      break;

    case "release-date-asc":
      sortByDateAsc(moviesData);
      mainSection.innerHTML = "";
      printMovieCards(moviesData);
      break;

    case "popularity-desc":
      sortByPopularityDesc(moviesData);
      mainSection.innerHTML = "";
      printMovieCards(moviesData);
      break;

    case "popularity-asc":
      sortByPopularityAsc(moviesData);
      mainSection.innerHTML = "";
      printMovieCards(moviesData);
      break;

    default:
      break;
  }
});

//#endregion

//#region Discover

async function discoverSection() {
  mainSection.innerHTML = "";
  hideSearchFilters();
  showDiscoverFilters();
  populateYearDropdown();
  document.getElementById("discover").style.display = "flex";
}
//Event listener Discover Section Button
document
  .getElementById("discover-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    discoverSection();
    const genresButton = document.getElementById("select-genres-btn");
    // When the "Select Genres" button is clicked, show the genres selection
    genresButton.addEventListener("click", (event) => {
      event.preventDefault();
      const genresWindow = document.getElementById("discover-genres-window");
      if (
        genresWindow.style.display === "none" ||
        genresWindow.style.display === ""
      ) {
        genresWindow.style.display = "flex";
        genresButton.innerHTML = "Hide Genres";
      } else {
        genresWindow.style.display = "none";
        genresButton.innerHTML = 'Select Genres';
      }
    });
  });

//Function to populate year select dropdown
function populateYearDropdown() {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const yearSelect = document.getElementById("year-select");

  for (let year = currentYear; year >= startYear; year--) {
    let option = new Option(year, year);
    yearSelect.add(option);
  }
}
//Functions to show and hide Discover filters
function showDiscoverFilters() {
  const discoverFilters = document.getElementById("discover");
  discoverFilters.style.display = "flex";
}
function hideDiscoverFilters() {
  const discoverFilters = document.getElementById("discover");
  discoverFilters.style.display = "none";
}
//#endregion
