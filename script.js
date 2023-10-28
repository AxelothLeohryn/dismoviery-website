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

//#region Main Page
//Display de Main Page

async function mainPageLoad() {
  const mainSection = document.getElementById("main-section");
  await printMostPopular(mainSection);
  await printNowPlaying(mainSection);
  await printUpcoming(mainSection);
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
  //   adjustFontSizeToText();
}

async function printMostPopular(mainSection) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
    },
  };

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
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
    },
  };

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
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
    },
  };

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
  movieDetails.innerHTML = '';
  movieDetails.style.removeProperty("display");
  movieDetails.style.display = "flex";

  let movieTrailerKey = "";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
    },
  };
  await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response.results.reverse()[0].key);
      movieTrailerKey = response.results.reverse()[0].key;
    })
    .catch((err) => console.error(err));

  await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
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
                <div id="movie-details-footer"></div></div>
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
    });
}

mainPageLoad();

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
