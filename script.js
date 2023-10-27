//DB
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
}

async function printMostPopular(mainSection) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
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
                movieCardContainerHTML += `<section class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="">${movie.title}</h3>
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
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
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
                movieCardContainerHTML += `<section class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="">${movie.title}</h3>
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
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTgwNDUyMzA5OTlmZjEwNWYwODc1NzE3MDdmYmZjNyIsInN1YiI6IjY1MmQ4NTM3MDI0ZWM4MDEzYzU4ZmNjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IxnAafvpj2cajIWF6g3BipJBl3uzCk58CaOmgUUBuxY",
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
                movieCardContainerHTML += `<section class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster Image">
                    <h3 class="">${movie.title}</h3>
                </section>`;
            });
            movieCardContainerHTML += `</section>`;
            mainSection.innerHTML += movieCardContainerHTML;
        })
        .catch((err) => console.error(err));
}

mainPageLoad();

//#endregion
