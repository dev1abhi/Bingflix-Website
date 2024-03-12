// Function to parse URL parameters
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return null;
  }

  const query = getQueryVariable('query');
  if (query) {
    // Perform search using query and display results
    searchMovies(query);
  } else {
    document.getElementById('results').innerHTML = '<p>No results found.</p>';
  }

  async function searchMovies(query) {
    const apiKey = '68e094699525b18a70bab2f86b1fa706'; // Replace 'YOUR_API_KEY' with your actual TMDb API key
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

    results.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
      
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Poster+Available';
        const imgElement = document.createElement('img');
        imgElement.src = posterPath;
        imgElement.alt = movie.title;
        imgElement.addEventListener('click', () => {
            handlePosterClick(movie.id);
        });
        
        movieElement.appendChild(imgElement);
        
        const h2Element = document.createElement('h2');
        h2Element.textContent = `${movie.title} (${getReleaseDate(movie)})`;
        movieElement.appendChild(h2Element);
      
        resultsContainer.appendChild(movieElement);
      });
      
  }

  // Function to handle poster click event
  function handlePosterClick(movieId) {
    window.location.href = `movie_details.html?id=${movieId}`;
}


  function getReleaseDate(movie)
  {
    const releaseDate = movie.release_date;
    const date = new Date(releaseDate);
    return date.getFullYear();
  }