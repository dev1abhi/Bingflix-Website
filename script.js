
const apiKey = 'TMDB_API_KEY_HERE';
const now_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const top_rated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const now_airing =`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`;
const nowPlayingIndia = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;
const bollywood = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;

const top_rated_series = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
const korean_series = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=ko-KR&region=KR&sort_by=popularity.desc&with_original_language=ko`;

    function fetchAndDisplayMovies(url, containerId) {

      const movieList = document.querySelector('#' + containerId);
       movieList.innerHTML = ""; // Clear previous content
     // Add shimmer animation placeholder
     movieList.classList.add('shimmer-placeholder');

      fetch(url)
        .then(response => response.json()) //callback function (returning response.json())
        .then(data => {
          //const movieList = document.querySelector('#' + containerId);
          movieList.classList.remove('shimmer-placeholder'); // Remove the shimmer animation placeholder
    
          data.results.forEach(movie => {
            const image = document.createElement('img');
            image.classList.add('card-image');
            image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            image.alt = movie.title;
            image.style.cursor ='pointer';
            image.style.borderRadius='1.2rem';

            // Inside the loop
               image.classList.add('card-image');
               image.addEventListener('mouseenter', () => {
                 image.style.transform = 'scale(1.1)';
                 });
               image.addEventListener('mouseleave', () => {
                 image.style.transform = 'scale(1)';
                });

            image.addEventListener('click', () => {
              handlePosterClick(movie.id);
          });


            movieList.appendChild(image);
          });

        adjustImageHeights();

        })
        .catch(error => console.error('Error fetching data:', error));
    }

     function handlePosterClick(movieId) {
      // Redirect to movie details page with movie ID as URL parameter
      window.location.href = `movie_details/movie_details.html?id=${movieId}`;
  }

  function fetchAndDisplaySeries(url, containerId) {
    const seriesList = document.querySelector('#' + containerId);
    seriesList.innerHTML = ""; // Clear previous content
    // Add shimmer animation placeholder
    seriesList.classList.add('shimmer-placeholder');
  
    fetch(url)
      .then(response => response.json()) //callback function (returning response.json())
      .then(data => {
        seriesList.classList.remove('shimmer-placeholder'); // Remove the shimmer animation placeholder
  
        data.results.forEach(series => {
          const image = document.createElement('img');
          image.classList.add('card-image');
          image.src = `https://image.tmdb.org/t/p/w200${series.poster_path}`;
          image.alt = series.name;
          image.style.cursor ='pointer';
          image.style.borderRadius='1.2rem';

          image.classList.add('card-image');
               image.addEventListener('mouseenter', () => {
                 image.style.transform = 'scale(1.1)';
                 });
               image.addEventListener('mouseleave', () => {
                 image.style.transform = 'scale(1)';
                });

    
          image.addEventListener('click', () => {
            fetchAndDisplaySeriesEpisodes(series.id);
          });
  
          seriesList.appendChild(image);
        });

        adjustImageHeights();
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  function fetchAndDisplaySeriesEpisodes(seriesId) {
    // Redirect to series details page with series ID as URL parameter
    window.location.href = `series_details/series_details.html?id=${seriesId}`;
  }
  
    
   

    document.addEventListener('DOMContentLoaded', function() {
      fetchAndDisplayMovies(now_playing, 'movies');
      fetchAndDisplayMovies(top_rated, 'topratedmovies');
      fetchAndDisplayMovies(nowPlayingIndia, 'moviesind');
      fetchAndDisplayMovies(bollywood, 'bollywood');
  
      // Series
      fetchAndDisplaySeries(now_airing, 'series');
      fetchAndDisplaySeries(top_rated_series, 'seriestr');
      fetchAndDisplaySeries(korean_series, 'koreanseries');
  });



    //populating movies slider with API Data
    document.addEventListener("DOMContentLoaded", async function() {
      try {
          const apiKey = '68e094699525b18a70bab2f86b1fa706';
          const topMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  
          const response = await fetch(topMoviesUrl);
          const data = await response.json();
  
          const slider = document.querySelector('.slider');
  
          data.results.slice(0, 6).forEach(movie => {
              const item = document.createElement('li');
              item.classList.add('item');
              item.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
  
              const content = document.createElement('div');
              content.classList.add('content');
              content.innerHTML = `
                  <h2 class='title'>${movie.title}</h2>
                  <p class='description'>${movie.overview}</p>
                  <a href=movie_details/movie_details.html?id=${movie.id} class="watch-now-button">Watch Now</a>
              `;
  
              const nav = document.querySelector('.nav');
              const movieItems = document.querySelectorAll('.item');
  
              item.appendChild(content);
              slider.appendChild(item);
          });
      } catch (error) {
          console.error('Error fetching top movies:', error);
      }
  });
  
  //Slider Nav-bar logic , which controls the slider animation
  document.addEventListener('DOMContentLoaded', function() {
  let a = 6;
  const slider = document.querySelector('.slider');
  const nav = document.querySelector('.nav');

  function activate(e) {
    let inx=0;
    const items = document.querySelectorAll('.item');
    

    e.target.matches('.next') && slider.append(items[0])
    e.target.matches('.prev') && slider.prepend(items[items.length-1]);

    

    items.forEach(item => {
      item.style.opacity = 1;
  });  
    document.querySelector(`.slider .item:nth-child(${a})`).style.opacity = 0;

    


    if (e.target.matches('.next'))
    {
         inx=2;
    }

    nav.addEventListener('mouseenter', () => {
    // Make all movie items visible
    items.forEach(item => {
        item.style.opacity = 1;
    });    

    document.querySelector(`.slider .item:nth-child(6)`).style.opacity = 0;


});

nav.addEventListener('mouseleave', () => {
    // Make only movies 2 to 6 invisible
    items.forEach((item, index) => {
        if (  index==inx ) {
            item.style.opacity = 1;
        }
        else
        item.style.opacity = 0;
    });
});

//a=a-1;
}

nav.addEventListener('click',activate,false);
  });



//sidebar logic
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});
searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search icon
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the icons class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the icons class
 }
}


//HANDLES FORWARD AND BACKWARD LOGIC ON BUTTON CLICK

document.addEventListener("DOMContentLoaded", function() {
  // Get all the scroll containers and buttons
  const scrollContainers = document.querySelectorAll('.scroll-container');
  const fwButtons = document.querySelectorAll('.btf');
  const bwButtons = document.querySelectorAll('.btw');

  // Function to scroll the container to the left
  function scrollLeft(container) {
      container.scrollLeft -= 200; // Adjust the scroll amount as needed
  }

  // Function to scroll the container to the right
  function scrollRight(container) {
      container.scrollLeft += 200; // Adjust the scroll amount as needed
  }

  // Attach event listeners to all forward buttons
  fwButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
          scrollLeft(scrollContainers[index]);
      });
  });

  // Attach event listeners to all backward buttons
  bwButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
          scrollRight(scrollContainers[index]);
      });
  });
});



//HANDLES PAUSING AND RESUMING OF ANIMATION ON HOVER AND NOT HOVER

document.addEventListener("DOMContentLoaded", function() {
  // Get all the forward buttons, backward buttons, images, and scroll containers
  const fwButtons = document.querySelectorAll('.btf');
  const bwButtons = document.querySelectorAll('.btw');
  const imagesContainers = document.querySelectorAll('.scroll-container');

  function stopAnimation(images) {
      images.forEach(img => {
          img.style.animation = 'none';
      });
  }

  function resumeAnimation(images) {
      images.forEach(img => {
          img.style.animation = 'scrollMovies 20s linear infinite';
      });
  }

  // Attach event listeners to all forward buttons
  fwButtons.forEach((fwButton, index) => {
      const images = imagesContainers[index].querySelectorAll('img');
      fwButton.addEventListener('mouseover', () => stopAnimation(images));
      fwButton.addEventListener('mouseleave', () => resumeAnimation(images));
  });

  // Attach event listeners to all backward buttons
  bwButtons.forEach((bwButton, index) => {
      const images = imagesContainers[index].querySelectorAll('img');
      bwButton.addEventListener('mouseover', () => stopAnimation(images));
      bwButton.addEventListener('mouseleave', () => resumeAnimation(images));
  });

  // Attach event listeners to all scroll containers
  imagesContainers.forEach(container => {
      container.addEventListener('mouseover', () => stopAnimation(container.querySelectorAll('img')));
      container.addEventListener('mouseleave', () => resumeAnimation(container.querySelectorAll('img')));
  });
});

//Searching movies thru query
function searchMovies() {
  const query = document.getElementById('searchInput').value;
  if (query.length < 3) {
    alert("Please enter at least 3 characters for search.");
    return;
  }
  const url = `results/results.html?query=${query}`;
  window.location.href = url;
}


 // Function to adjust image heights based on window width (responsiveness)
 function adjustImageHeights() {
  const images = document.querySelectorAll('.card-image'); // Select all images

  images.forEach(image => {
      if (document.body.clientWidth <= 768) {
          image.style.height = "25vh"; // Decrease the height for mobile devices
      } else {
          image.style.height = "35vh"; // Default height for larger screens
      }
  });
}


// Call the adjustImageHeights function whenever the window is resized
window.addEventListener('resize', function() {
  adjustImageHeights();
});