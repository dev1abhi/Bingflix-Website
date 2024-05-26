
    
    document.addEventListener('DOMContentLoaded', function() {

        const apiKey = 'TMDB_API_KEY';
        const moviesContainer = document.getElementById('moviesContainer');
        const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
    
        likedMovies.forEach(movieId => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
    
            // Initially set the shimmer effect
            const shimmerDiv = document.createElement('div');
            shimmerDiv.classList.add('shimmer-bg');
            movieCard.appendChild(shimmerDiv);
    
            moviesContainer.appendChild(movieCard);

    
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    // Create the movie card once the data is fetched
                    const movieElement = createMovieCard(data);
                    
                    // Replace the shimmer div with the actual content
                    moviesContainer.replaceChild(movieElement, movieCard);
                })
                .catch(error => console.error('Error:', error));
        });
    });
    
    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.addEventListener('click', () => {
            handlePosterClick('movie', movie.id);
          });


        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = `${movie.title}`;
       
        img.onload = function() {
            movieCard.innerHTML = `
                <img src="${this.src}" alt="${this.alt}" style="width: 100%; height: auto; display: block;">
                <div class="movie-details">
                    <h3 class="movie-title">${movie.title}</h3>
                </div>
            `;
        };
        img.onerror = function() {
            movieCard.innerHTML = `
                <div class="movie-details" style="padding: 10px;">
                    <h3 class="movie-title">Image not available</h3>
                </div>
            `;
        };
    
        return movieCard;
    }
    
    function handlePosterClick(mediaType, mediaId) {
        if (mediaType === 'movie') {
          window.location.href = `../movie_details/movie_details.html?type=movie&id=${mediaId}`;
        } else if (mediaType === 'tv') {
          window.location.href = `../series_details/series_details.html?type=tv&id=${mediaId}`;
        } else {
          console.error('Unknown media type');
        }
      }




    //sidebar logic
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});
searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
 }
}

function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 3) {
      alert("Please enter at least 3 characters for search.");
      return;
    }
    const url = `../results/results.html?query=${query}`;
    window.location.href = url;
  }