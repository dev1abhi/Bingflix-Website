document.cookie = "name=value; SameSite=None; Secure";
// Define your TMDB API key
const apiKey = '68e094699525b18a70bab2f86b1fa706';
let currentPage = 1; // Example: current page is 7
const totalPages = 20; // Example: total number of pages
  
// Function to fetch trending movies from TMDB API with pagination support
async function fetchMoviesByPage(page) {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`);
    const data = await response.json();
    return data.results;
}

// Function to fetch movie details including poster URLs from TMDB API
async function fetchMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const data = await response.json();
    return data;
}

// Function to dynamically fill the cards with movie data
async function fillCardsWithPage(page) {
    //const movies = await fetchTrendingMovies();

    const movies = await fetchMoviesByPage(page);
    var movieDivs = document.querySelectorAll(".view.movie");
    const cards = document.querySelectorAll('.card');

  

    movies.slice(0, 9).forEach(async (movie, index) => {
        const card = cards[index];
        const mov = movieDivs[index];
        const titleElement = card.querySelector('.title');
        const dateElement = card.querySelector('.date');
        const textElement = card.querySelector('.text');
        const iframeElement = card.querySelector('iframe');
        const tagline = card.querySelector('.tagline');

        // Clear previous trailer URL
        iframeElement.removeAttribute('data-video');

        //console.log(movie.title);
        titleElement.textContent = "";
        dateElement.textContent = movie.release_date;
        textElement.textContent = ""; //overview
        //console.log(movie.tagline);
        tagline.textContent= "";
        mov.dataset.movieId=movie.id;


        // Fetch movie details to get poster URL
        const movieDetails = await fetchMovieDetails(movie.id);
        const posterUrl = `https://image.tmdb.org/t/p/w780${movieDetails.poster_path}`;

        // Set card background image to the poster URL
        card.style.backgroundImage = `url(${posterUrl})`;
        card.style.backgroundSize = "contain";
        card.style.backgroundRepeat ="no-repeat";
        card.style.backgroundPosition = "center";
        

        // Assuming you have a function to extract YouTube trailer URL from TMDB data
        const trailerUrl = await getYouTubeTrailerUrl(movie);

        console.log("trailers fetched");

        // Set the iframe source to the YouTube trailer URL
        iframeElement.dataset.video = trailerUrl;

        if (index==2)
        console.log(iframeElement.dataset.video);
    });
}


async function getYouTubeTrailerUrl(movie) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
    const data = await response.json();
    
    // Filter out YouTube trailer
    const trailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
    
    // If a trailer is found, return its YouTube URL
    if (trailer) {
        const trailerKey = trailer.key;
        //console.log(trailerKey);
        return `https://www.youtube.com/embed/${trailerKey}?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&modestbranding=1&controls=1&showinfo=0&mute=1`;
    } else {
        // If no trailer is found, return a default URL or handle accordingly
        return null; // Change this to a default URL or handle as needed
    }
}

// Initial Call the function to fill the cards with data
fillCardsWithPage(currentPage);


// Get all elements with class "card"
var cards = document.querySelectorAll(".card");

// Loop through each card element
cards.forEach(function(card) {
    // Add event listener for mouseenter
    card.addEventListener("mouseenter", function() {
        // Get the iframe element within the card
        var iframe = this.querySelector('iframe');
        // Get the value of the data-video attribute
        var vSrc = iframe.dataset.video;
        // Set the src attribute of the iframe
        iframe.src = vSrc;
    });

    // Add event listener for mouseleave
    card.addEventListener("mouseleave", function() {
        // Get the iframe element within the card
        var iframe = this.querySelector('iframe');
        // Remove the src attribute to stop the video
        iframe.removeAttribute('src');
    });
});




  
  // Function to update pagination buttons based on current page
  function updatePaginationButtons() {
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = ''; // Clear existing buttons
  
      // Add first page button
      const firstPageButton = document.createElement('button');
      firstPageButton.textContent = 'First Page';
      firstPageButton.id = 'firstPage';
      paginationContainer.appendChild(firstPageButton);
  
      // Add previous page button
      const prevPageButton = document.createElement('button');
      prevPageButton.textContent = 'Previous Page';
      prevPageButton.id = 'prevPage';
      paginationContainer.appendChild(prevPageButton);
  
      // Add number buttons dynamically based on current page and total pages
      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
          const pageButton = document.createElement('button');
          pageButton.textContent = i;
          pageButton.classList.add('pageBtn');
          pageButton.dataset.page = i;
          if (i === currentPage) {
              pageButton.disabled = true; // Disable current page button
          }
          paginationContainer.appendChild(pageButton);
      }
  
      // Add next page button
      const nextPageButton = document.createElement('button');
      nextPageButton.textContent = 'Next Page';
      nextPageButton.id = 'nextPage';
      paginationContainer.appendChild(nextPageButton);
  
      // Add last page button
      const lastPageButton = document.createElement('button');
      lastPageButton.textContent = 'Last Page';
      lastPageButton.id = 'lastPage';
      paginationContainer.appendChild(lastPageButton);
  }
  
  // Function to handle pagination button clicks using event delegation
  document.querySelector('.pagination').addEventListener('click', (event) => {
      if (event.target.classList.contains('pageBtn')) {
          const pageNum = parseInt(event.target.dataset.page);
          if (!isNaN(pageNum) && pageNum !== currentPage) {
              currentPage = pageNum;
              updatePaginationButtons();
              fillCardsWithPage(currentPage);
          }
      } else if (event.target.id === 'prevPage' && currentPage > 1) {
          currentPage--;
          updatePaginationButtons();
          fillCardsWithPage(currentPage);
      } else if (event.target.id === 'nextPage' && currentPage < totalPages) {
          ++currentPage;
          updatePaginationButtons();
          fillCardsWithPage(currentPage);
      }
      else if (event.target.id === 'firstPage') {
        currentPage=1;
        updatePaginationButtons();
        fillCardsWithPage(currentPage);
    }
    else if (event.target.id === 'lastPage') {
        currentPage=20;
        updatePaginationButtons();
        fillCardsWithPage(currentPage);
    }
  });
  
  // Initial page load
  updatePaginationButtons();
  fillCardsWithPage(currentPage);




  document.addEventListener("DOMContentLoaded", function() {
    var movieDivs = document.querySelectorAll(".view.movie");
    movieDivs.forEach(function(div) {
        div.addEventListener("click", function() {
            // Redirect to another internal page with movieId as query parameter
            const movieId = div.dataset.movieId; // Assuming you have a dataset property containing the movieId
            window.location.href = `../movie_details/movie_details.html?id=${movieId}`;
        });
    });
});

function goToAnotherLocation() {
    window.location.href = '../index.html';
}