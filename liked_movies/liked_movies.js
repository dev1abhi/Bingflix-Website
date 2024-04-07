
   
    
    document.addEventListener('DOMContentLoaded', function() {

        const apiKey = '68e094699525b18a70bab2f86b1fa706';
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
    