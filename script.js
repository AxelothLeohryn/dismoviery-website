//#region DB initialize ----------------------------------------------------------------------------------------------------
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

//#region Firebase Login ----------------------------------------------------------------------------------------------------
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};
const readAllUsers = (born) => {
  db.collection("users")
    .where("first", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
};
function readOne(id) {
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`);
      alert(`se ha registrado ${user.email}`);
      // Guarda El usuario en Firestore
      createUser({
        id: user.uid,
        email: user.email,
      });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(`Error en el sistema (${errorCode}): ${errorMessage}`);
    });
};
document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;
    pass === pass2 ? signUpUser(email, pass) : alert("Passwords not matching.");
  });
const signInUser = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`Se ha logado ${user.email} ID:${user.uid}`);
      alert(`You have logued in: ${user.email}`);
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};
const signOut = () => {
  let user = firebase.auth().currentUser;
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sale del sistema: " + user.email);
    })
    .catch((error) => {
      console.log("Hubo un error: " + error);
    });
};
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass);
  });
document.getElementById("logout-button").addEventListener("click", signOut);

// User listener
// Control logged in user
let userLoggedIn = "";
firebase.auth().onAuthStateChanged(function (user) {
  const userName = document.getElementById("user-list-username");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const logoutButton = document.getElementById("logout-button");
  if (user) {
    userLoggedIn = user.email; //Store logged in username
    console.log(`User currently logged in:${user.email} ${user.uid}`);
    userName.innerHTML = `<li id="user-list-username"><i class="fa-solid fa-user"></i>${user.email.split("@")[0]}</li>`;
    registerForm.style.display = "none";
    loginForm.style.display = "none";
    logoutButton.style.display = "flex";
  } else {
    console.log("No user logged in");
    userName.innerHTML = `Login`;
    registerForm.style.display = "flex";
    loginForm.style.display = "flex";
    logoutButton.style.display = "none";
  }
});
//#endregion

//#region Login Page ----------------------------------------------------------------------------------------------------
const loginPage = document.getElementById("login-section");
const loginCloseButton = document.getElementById("close-login-button");
loginCloseButton.addEventListener("click", (event) => {
  event.preventDefault();
  loginPage.style.display = "none";
});

const loginButton = document.getElementById("user-list-username");
loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  loginPage.style.display = "flex";
});

//#endregion

//#region General ----------------------------------------------------------------------------------------------------
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
//#endregion

//#region Mobile nav ----------------------------------------------------------------------------------------------------
const toggleButton = document.getElementById("toggle-button");
const dropDownMenu = document.getElementById("dropdown-menu");
const toggleButtonIcon = document.getElementById("toggle-button-icon");

toggleButton.addEventListener("click", (event) => {
  dropDownMenu.classList.toggle("open");
  toggleButtonIcon.classList = dropDownMenu.classList.contains("open")
    ? "fa-solid fa-xmark"
    : "fa-solid fa-bars";
});

const mostPopularButton = document.getElementById("most-popular-button");
const nowPlayingButton = document.getElementById("now-playing-button");
const upcomingButton = document.getElementById("upcoming-button");

mostPopularButton.addEventListener("click", (event) => {
  event.preventDefault();
  mainSection.innerHTML = "";
  hideDiscoverFilters();
  hideSearchFilters();
  printMostPopular();
});
nowPlayingButton.addEventListener("click", (event) => {
  event.preventDefault();
  mainSection.innerHTML = "";
  hideDiscoverFilters();
  hideSearchFilters();
  printNowPlaying();
});
upcomingButton.addEventListener("click", (event) => {
  event.preventDefault();
  mainSection.innerHTML = "";
  hideDiscoverFilters();
  hideSearchFilters();
  printUpcoming();
});
//#endregion

//#region Main Page ----------------------------------------------------------------------------------------------------
function printMovieCards(moviesData) {
  console.log(moviesData);
  let movieCardContainerHTML = `<section class="movie-card-container">`;
  moviesData.forEach((movie) => {
    if (movie.poster_path) {
      movieCardContainerHTML += `<section class="movie-card" data-movie-title="${movie.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${movie.poster_path}" data-movie-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                <h3 class="dynamic-font-size">${movie.title}</h3>
            </section>`;
    } else {
      movieCardContainerHTML += `<section class="movie-card" data-movie-title="${movie.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${movie.poster_path}" data-movie-id="${movie.id}">
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
  movieDetails.style.backgroundImage = "";
  movieDetails.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
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
      <div id="movie-details-alert"></div>
        <div id="movie-details-nav">
            <i id="movie-details-fav" class="fa-solid fa-star" data-movie-title="${response.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${response.poster_path}" data-movie-id="${response.id}"></i>
            <i id="movie-details-fav-delete" class="fa-solid fa-star display-none" data-movie-title="${response.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${response.poster_path}" data-movie-id="${response.id}"></i>
            <i id="movie-details-watchlater" class="fa-solid fa-clock" data-movie-title="${response.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${response.poster_path}" data-movie-id="${response.id}"></i>
            <i id="movie-details-watchlater-delete" class="fa-solid fa-clock display-none" data-movie-title="${response.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${response.poster_path}" data-movie-id="${response.id}"></i>
            <i id="movie-details-close" class="fa-solid fa-xmark" data-movie-title="${response.title}" data-movie-poster="https://image.tmdb.org/t/p/w500/${response.poster_path}" data-movie-id="${response.id}"></i>
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
  //Event listeners for the buttons:
  const closeButton = document.getElementById("movie-details-close");
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    movieDetails.style.removeProperty("display");
    movieDetails.style.display = "none";
    movieDetails.innerHTML = ""; //fix youtube video playing in background
    document.getElementById("movie-details-alert").innerHTML = "";
    // document.getElementById('movie-details-alert').style.display =
  });
  const favButton = document.getElementById("movie-details-fav");
  const favButtonDelete = document.getElementById("movie-details-fav-delete");
  favButton.addEventListener("click", (event) => {
    event.preventDefault();
    const title = event.target.getAttribute("data-movie-title");
    const poster = event.target.getAttribute("data-movie-poster");
    const id = event.target.getAttribute("data-movie-id");
    console.log("Favorite details: " + userLoggedIn, title, poster, id);
    addToFavsUser(userLoggedIn, title, poster, id);
    favButton.classList.add("display-none");
    favButtonDelete.classList.remove("display-none");
  });
  favButtonDelete.addEventListener("click", (event) => {
    event.preventDefault();
    const title = event.target.getAttribute("data-movie-title");
    const poster = event.target.getAttribute("data-movie-poster");
    const id = event.target.getAttribute("data-movie-id");
    console.log("Favorite details: " + userLoggedIn, title, poster, id);
    deleteFromFavsUser(userLoggedIn, title, poster, id);
    favButton.classList.remove("display-none");
    favButtonDelete.classList.add("display-none");
  });
  const watchLaterButton = document.getElementById("movie-details-watchlater");
  const watchLaterButtonDelete = document.getElementById(
    "movie-details-watchlater-delete"
  );
  watchLaterButton.addEventListener("click", (event) => {
    event.preventDefault();
    const title = event.target.getAttribute("data-movie-title");
    const poster = event.target.getAttribute("data-movie-poster");
    const id = event.target.getAttribute("data-movie-id");
    console.log("Watchlater details: " + userLoggedIn, title, poster, id);
    addToWatchlaterUser(userLoggedIn, title, poster, id);
    watchLaterButton.classList.add("display-none");
    watchLaterButtonDelete.classList.remove("display-none");
  });
  watchLaterButtonDelete.addEventListener("click", (event) => {
    event.preventDefault();
    const title = event.target.getAttribute("data-movie-title");
    const poster = event.target.getAttribute("data-movie-poster");
    const id = event.target.getAttribute("data-movie-id");
    deleteFromWatchlaterUser(userLoggedIn, title, poster, id);
    watchLaterButton.classList.remove("display-none");
    watchLaterButtonDelete.classList.add("display-none");
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
      mainSection.innerHTML += `<span id="most-popular" class="category-title">Most Popular</span><section class="movie-card-container">`;
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
      mainSection.innerHTML += `<span id="now-playing" class="category-title">Now Playing</span><section class="movie-card-container">`;
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
      mainSection.innerHTML += `<span id="upcoming" class="category-title">Upcoming</span><section class="movie-card-container">`;
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
  mainSection.innerHTML = "";
  hideSearchFilters();
  hideDiscoverFilters();
  await printMostPopular();
  await printNowPlaying();
  await printUpcoming();
  //Event listener for clicks on cards
  listenForClicks();
}
mainPageLoad();
document.getElementById("home-button").addEventListener("click", (event) => {
  event.preventDefault();
  mainPageLoad();
});
//#endregion

//#region Search ----------------------------------------------------------------------------------------------------
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
document.getElementById("search-bar").addEventListener("submit", (event) => {
  event.preventDefault();
  const searchValue = document.getElementById("search-box").value;
  console.log(searchValue);
  if (searchValue) {
    searchMovies(searchValue);
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

//#region Discover ----------------------------------------------------------------------------------------------------

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
        genresButton.innerHTML = "Select Genres";
      }
    });
  });
function populateYearDropdown() {
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const yearSelect = document.getElementById("year-select");

  for (let year = currentYear + 1; year >= startYear; year--) {
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

async function discovery(customUrl) {
  await fetch(customUrl, options)
    .then((response) => response.json())
    .then((moviesData) => {
      moviesData = moviesData.results;
      console.log({ "Movies Discovered": moviesData });
      mainSection.innerHTML = "";
      printMovieCards(moviesData);
    })
    .catch((err) => console.error(err));
}

document
  .getElementById("discover-submit")
  .addEventListener("click", (event) => {
    event.preventDefault();
    console.log(event.target);
    const genres = Array.from(
      document.querySelectorAll(
        "#discover-genres-checkboxes input[type=checkbox]:checked"
      )
    )
      .map((checkbox) => checkbox.value)
      .join("%2C%20");
    const year = document.getElementById("year-select").value;
    const sortBy = document.getElementById("sort-by-select").value;

    console.log("Selected Genres:", genres);
    console.log("Selected Year:", year);
    console.log("Selected Sorting Option:", sortBy);

    let customUrl =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1";
    if (sortBy) {
      customUrl += `&sort_by=${sortBy}`;
    }
    if (genres) {
      customUrl += `&with_genres=${genres}`;
    }
    if (year) {
      customUrl += `&year=${year}`;
    }
    console.log({ "Custom URL: ": customUrl });

    discovery(customUrl);
  });
//#endregion

//#region User Lists
async function addToFavsUser(userLoggedIn, movieTitle, moviePoster, movieId) {
  const userUserlistsRef = db.collection("user-lists").doc(userLoggedIn);

  try {
    const doc = await userUserlistsRef.get();

    if (doc.exists) {
      // If the document exists, update the favorites array
      await userUserlistsRef.update({
        favorites: firebase.firestore.FieldValue.arrayUnion({
          title: movieTitle,
          poster_path: moviePoster,
          id: movieId,
        }),
      });
      console.log("Movie added to favorites");
      document.getElementById(
        "movie-details-alert"
      ).innerHTML = `${movieTitle} added to Favorites`;
    } else {
      // If the document does not exist, create a new one
      await userUserlistsRef.set({
        username: userLoggedIn,
        favorites: [
          {
            title: movieTitle,
            poster_path: moviePoster,
            id: movieId,
          },
        ],
        watchlater: [], // Assuming watchlater should be empty initially
      });
      console.log("Favorite list created and movie added");
    }
  } catch (error) {
    console.error("Error adding movie to favorites: ", error);
  }
}
async function deleteFromFavsUser(
  userLoggedIn,
  movieTitle,
  moviePoster,
  movieId
) {
  const userUserlistsRef = db.collection("user-lists").doc(userLoggedIn);

  try {
    const doc = await userUserlistsRef.get();
    await userUserlistsRef.update({
      favorites: firebase.firestore.FieldValue.arrayRemove({
        title: movieTitle,
        poster_path: moviePoster,
        id: movieId,
      }),
    });
    console.log("Movie removed from favorites");
    document.getElementById(
      "movie-details-alert"
    ).innerHTML = `${movieTitle} removed from Favorites`;
  } catch (error) {
    console.error("Error removing movie from favorites: ", error);
  }
}
async function addToWatchlaterUser(
  userLoggedIn,
  movieTitle,
  moviePoster,
  movieId
) {
  const userUserlistsRef = db.collection("user-lists").doc(userLoggedIn);

  try {
    const doc = await userUserlistsRef.get();

    if (doc.exists) {
      // If the document exists, update the favorites array
      await userUserlistsRef.update({
        watchlater: firebase.firestore.FieldValue.arrayUnion({
          title: movieTitle,
          poster_path: moviePoster,
          id: movieId,
        }),
      });
      console.log("Movie added to watch later");
      document.getElementById(
        "movie-details-alert"
      ).innerHTML = `${movieTitle} added to Watch Later`;
    } else {
      // If the document does not exist, create a new one
      await userUserlistsRef.set({
        username: userLoggedIn,
        favorites: [],
        watchlater: [
          {
            title: movieTitle,
            poster_path: moviePoster,
            id: movieId,
          },
        ], // Assuming watchlater should be empty initially
      });
    }
  } catch (error) {
    console.error("Error adding movie to watch later: ", error);
  }
}
async function deleteFromWatchlaterUser(
  userLoggedIn,
  movieTitle,
  moviePoster,
  movieId
) {
  const userUserlistsRef = db.collection("user-lists").doc(userLoggedIn);
  try {
    const doc = await userUserlistsRef.get();
    await userUserlistsRef.update({
      watchlater: firebase.firestore.FieldValue.arrayRemove({
        title: movieTitle,
        poster_path: moviePoster,
        id: movieId,
      }),
    });
    await userUserlistsRef.set({
      username: userLoggedIn,
      favorites: [],
      watchlater: [
        {
          title: movieTitle,
          poster_path: moviePoster,
          id: movieId,
        },
      ],
    });
    console.log("Favorite list created and movie added");
    document.getElementById(
      "movie-details-alert"
    ).innerHTML = `${movieTitle} removed from Watch Later`;
  } catch (error) {
    console.error("Error adding movie to watch later: ", error);
  }
}
async function favsSection() {
  mainSection.innerHTML = "";
  let favoritesMovies = await db.collection("user-lists").doc(userLoggedIn);
  let favoritesMoviesData = [];
  await favoritesMovies
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data().favorites);
        favoritesMoviesData = doc.data().favorites;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  mainSection.innerHTML += `<span id="most-popular" class="category-title">Your favorite movies:</span><section class="movie-card-container">`;
  printMovieCards(favoritesMoviesData);
  mainSection.innerHTML += `</section>`;
  console.log(favoritesMoviesData);
}
async function watchLaterSection() {
  mainSection.innerHTML = "";
  let watchLaterMovies = await db.collection("user-lists").doc(userLoggedIn);
  let watchLaterMoviesData = [];
  await watchLaterMovies
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data().watchlater);
        watchLaterMoviesData = doc.data().watchlater;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  mainSection.innerHTML += `<span id="most-popular" class="category-title">Movies to watch later:</span><section class="movie-card-container">`;
  printMovieCards(watchLaterMoviesData);
  mainSection.innerHTML += `</section>`;
  console.log(watchLaterMoviesData);
}

document.getElementById("favorites").addEventListener("click", (event) => {
  event.preventDefault();
  hideDiscoverFilters();
  hideSearchFilters();
  favsSection();
});
document.getElementById("watch-later").addEventListener("click", (event) => {
  event.preventDefault();
  hideDiscoverFilters();
  hideSearchFilters();
  watchLaterSection();
});

//#endregion
