document.cookie = "name=value; SameSite=None; Secure";
// Define your TMDB API key
const apiKey = 'TMDB_API_KEY_HERE';
//let currentPage = 1; // Example: current page is 7
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
const totalPages = 20; // Example: total number of pages
let contentType="";
let Rank="";
let Region="";

document.addEventListener("DOMContentLoaded", function() {
    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const rank=urlParams.get('rank');
    const region = urlParams.get('region');
    Rank=rank;
    Region=region;
    //console.log(rank);

    // Fetch data based on the type parameter
    if (type === 'movies') {
        contentType="movie";
        fillCardsWithPageAndType(currentPage, 'movie',rank , region);
    } else if (type === 'series' ) {
        contentType="tv";
        fillCardsWithPageAndType(currentPage, 'tv',rank , region);
    } else{
        
    }
});
  
// Function to fetch trending movies from TMDB API with pagination support
async function fetchMoviesByPageAndType(page,type,rank,region) {
    let response;
    console.log(rank);
    console.log(region);
    if (rank==null && region==null) //trending US
    { 
    response = await fetch(`https://api.themoviedb.org/3/trending/${type}/week?api_key=${apiKey}&page=${page}`);
    }
    else if (rank=='topRanked' && region==null) //Top-rated US
    {
        console.log('yes')
    response = await fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${apiKey}&page=${page}`);
    }
    else if (rank=='topRanked' && region == "KR") //Popular Korean
    {
    response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ko-KR&region=KR&sort_by=popularity.desc&with_original_language=ko&page=${page}`)
    }

    else if (rank=='topRanked' && region == "IN") //Popular Indian
    {
    response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-IN&region=IN&sort_by=popularity.desc&with_original_language=hi&page=${page}`)
    }

    const data = await response.json();
    return data.results;
}

// Function to fetch movie/series details including poster URLs from TMDB API
//dont change this
async function fetchMovieDetails(movieId,type) {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=${apiKey}`);
    const data = await response.json();
    return data;
}

// Function to dynamically fill the cards with movie data
async function fillCardsWithPageAndType(page,type,rank,region) {
   
    const movies = await fetchMoviesByPageAndType(page,type,rank,region);
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
        const movieDetails = await fetchMovieDetails(movie.id,type);
        const posterUrl = `https://image.tmdb.org/t/p/w780${movieDetails.poster_path}`;

        // Set card background image to the poster URL
        card.style.backgroundImage = `url(${posterUrl})`;
        card.style.backgroundSize = "contain";
        card.style.backgroundRepeat ="no-repeat";
        card.style.backgroundPosition = "center";
        

        // Assuming you have a function to extract YouTube trailer URL from TMDB data
        const trailerUrl = await getYouTubeTrailerUrl(movie,type);

        //console.log("trailers fetched");

        // Set the iframe source to the YouTube trailer URL
        iframeElement.dataset.video = trailerUrl;

       
    });
}


async function getYouTubeTrailerUrl(movie,type) {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${apiKey}`);
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



// Get all elements with class "card"
var cards = document.querySelectorAll(".card");

// Loop through each card element
cards.forEach(function(card) {
    card.addEventListener("mouseenter", function() {
        var iframe = this.querySelector('iframe');
        var vSrc = iframe.dataset.video;
        if (vSrc!='null') {
            iframe.src = vSrc;
        } else {
            iframe.src = "about:blank";
            iframe.contentWindow.document.write("<div style='color: white;'>Trailer not found.</div>");
        }
    });

    card.addEventListener("mouseleave", function() {
        var iframe = this.querySelector('iframe');
        iframe.removeAttribute('src');
    });
});


  // Function to update pagination buttons based on current page
  function updatePaginationButtons() {
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = ''; // Clear existing buttons
  
      // Add first page button
      const firstPageButton = document.createElement('button');
      firstPageButton.textContent = 'First';
      firstPageButton.id = 'firstPage';
      paginationContainer.appendChild(firstPageButton);
  
      // Add previous page button
      const prevPageButton = document.createElement('button');
      prevPageButton.textContent = 'Prev';
      prevPageButton.id = 'prevPage';
      paginationContainer.appendChild(prevPageButton);
  
      console.log(currentPage);//1
      console.log(totalPages);//20
      console.log(Math.min(totalPages, currentPage + 1));//11
      // Add number buttons dynamically based on current page and total pages
      for (let i = Math.max(1, currentPage-1); i <= Math.min(totalPages, currentPage + 1); i++) { 
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
      nextPageButton.textContent = 'Next';
      nextPageButton.id = 'nextPage';
      paginationContainer.appendChild(nextPageButton);
  
      // Add last page button
      const lastPageButton = document.createElement('button');
      lastPageButton.textContent = 'Last';
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
              fillCardsWithPageAndType(currentPage,contentType,Rank,Region);
          }
      } else if (event.target.id === 'prevPage' && currentPage > 1) {
          currentPage--;
          updatePaginationButtons();
          fillCardsWithPageAndType(currentPage,contentType,Rank,Region);
      } else if (event.target.id === 'nextPage' && currentPage < totalPages) {
          ++currentPage;
          updatePaginationButtons();
          fillCardsWithPageAndType(currentPage,contentType,Rank,Region);
      }
      else if (event.target.id === 'firstPage') {
        currentPage=1;
        updatePaginationButtons();
        fillCardsWithPageAndType(currentPage,contentType,Rank,Region);
    }
    else if (event.target.id === 'lastPage') {
        currentPage=20;
        updatePaginationButtons();
        fillCardsWithPageAndType(currentPage,contentType,Rank,Region);
    }
  });



  // Initial page load
  updatePaginationButtons();

  

  document.addEventListener("DOMContentLoaded", function() {
    var movieDivs = document.querySelectorAll(".view.movie");
    movieDivs.forEach(function(div) {
        div.addEventListener("click", function() {
            // Redirect to another internal page with movieId as query parameter
            const movieId = div.dataset.movieId; // Assuming you have a dataset property containing the movieId

            // Redirect based on contentType
            switch (contentType) {
                case 'movie':
                    //const movieId = div.dataset.movieId;
                    window.location.href = `../movie_details/movie_details.html?id=${movieId}`;
                    break;
                case 'tv':
                    //const movieId = div.dataset.movieId;
                    window.location.href = `../series_details/series_details.html?id=${movieId}`;
                    break;
                // Add cases for other content types if needed
                default:
                    // Redirect to a default page if contentType is unknown
            }
        
        
        
        });
    });
});

function goToAnotherLocation() {
    currentPage=1;
    window.location.href = '../index.html';
}

function saveCurrentPage() {
    localStorage.setItem('currentPage', currentPage);
}

// Call saveCurrentPage whenever currentPage changes
window.addEventListener('pagehide', saveCurrentPage);