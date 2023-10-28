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

//#region Mobile nav
// Mobile Nav
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
//Main section is where cards will be displayed
const mainSection = document.getElementById("main-section");
//options needed for fetch requests:
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
  },
};
//#region Main Page
//Display de Main Page

async function mainPageLoad() {
  await printMostPopular(mainSection);
  await printNowPlaying(mainSection);
  await printUpcoming(mainSection);
  //Event listener for clicks on cards
  listenForClicks();
//   mainSection.addEventListener("click", async (event) => {
//     const movieCard = event.target.closest(".movie-card");
//     if (movieCard) {
//       const movieId = movieCard.getAttribute("data-movie-id");
//       if (movieId) {
//         console.log(movieId);
//         await fetchAndDisplayMovieDetails(movieId);
//       }
//     }
//   });
  //   adjustFontSizeToText();
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
async function printMostPopular(mainSection) {
  await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      let movieCardContainerHTML = `<span class="category-title">Most Popular</span><section class="movie-card-container">`;
      response.results.forEach((movie) => {
        movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="dynamic-font-size">${movie.title}</h3>
                </section>`;
      });
      movieCardContainerHTML += `</section>`;
      mainSection.innerHTML += movieCardContainerHTML;
    })
    .catch((err) => console.error(err));
}
async function printNowPlaying(mainSection) {
  await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      let movieCardContainerHTML = `<span class="category-title">Now Playing</span><section class="movie-card-container">`;
      response.results.forEach((movie) => {
        movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="dynamic-font-size">${movie.title}</h3>
                </section>`;
      });
      movieCardContainerHTML += `</section>`;
      mainSection.innerHTML += movieCardContainerHTML;
    })
    .catch((err) => console.error(err));
}
async function printUpcoming(mainSection) {
  await fetch(
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      let movieCardContainerHTML = `<span class="category-title">Upcoming</span><section class="movie-card-container">`;
      response.results.forEach((movie) => {
        movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="dynamic-font-size">${movie.title}</h3>
                </section>`;
      });
      movieCardContainerHTML += `</section>`;
      mainSection.innerHTML += movieCardContainerHTML;
    })
    .catch((err) => console.error(err));
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
mainPageLoad();

async function searchMovies(search) {
  mainSection.innerHTML = "<h1>Results</h1>"; //Prepopulate with "Results:" and "Sort By:" sections
  await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=1`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        let movieCardContainerHTML = `<section class="movie-card-container">`;
        response.results.forEach(movie => {
            movieCardContainerHTML += `<section class="movie-card" data-movie-id="${movie.id}">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
            <h3 class="dynamic-font-size">${movie.title}</h3>
        </section>`;
    })
    movieCardContainerHTML += `</section>`;
    mainSection.innerHTML += movieCardContainerHTML;
    })
    .catch((err) => console.error(err));
    listenForClicks();
}
//Event listener for Search Button
document.getElementById("search-button").addEventListener("click", (event) => {
  event.preventDefault();
  console.log(event.target.form[0].value);
  if (event.target.form[0].value) {
    searchMovies(event.target.form[0].value);
  } else console.log("Please search something");
});

//#endregion

// function adjustFontSizeToText() {
//     const movieCards = document.querySelectorAll(".movie-card");

//     movieCards.forEach(movieCard => {
//         const h3 = movieCard.querySelector("h3.dynamic-font-size");
//         const containerHeight = movieCard.offsetHeight  - 216;
//         const textHeight = h3.scrollHeight;
//         console.log(containerHeight, textHeight)

//         if (textHeight > containerHeight) {
//             const fontSize = (containerHeight / textHeight) * parseFloat(getComputedStyle(h3).fontSize);
//             // const fontSize = 3
//             h3.style.fontSize = fontSize + "px";
//         }
//     });
// }
