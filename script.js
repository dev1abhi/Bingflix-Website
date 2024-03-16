
// document.addEventListener("DOMContentLoaded", function() {
//     function cloneItem() {

//         var series = document.getElementById("series");
//         var seriesImages = Array.from(series.getElementsByTagName("img"));
//         var initialCount1 = seriesImages.length;




//         var movies = document.getElementById("movies");
//         var movieImages = Array.from(movies.getElementsByTagName("img"));
//         var initialCount = movieImages.length;

//         for(var i = 0; i < initialCount; i++) {
//             var clonedItem = movieImages[i].cloneNode(true);
//             movies.appendChild(clonedItem);
            
//         }
       

//         for(var i = 0; i < initialCount1; i++) {
//             var clonedItem = seriesImages[i].cloneNode(true);
//             series.appendChild(clonedItem);
//         }


//     }

//     for(var i = 0; i < 3; i++) {
//         cloneItem();
//     }


//     for(var i = 0; i < 3; i++) {
//         cloneItem();
//     }

// });



const apiKey = '68e094699525b18a70bab2f86b1fa706';
const now_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const top_rated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const now_airing =`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`;
const nowPlayingIndia = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;
const bollywood = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&region=IN&with_original_language=hi`;

const top_rated_series = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
const bollywood_series = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=hi-IN&region=IN&sort_by=popularity.desc&with_original_language=hi`;

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
            image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            image.alt = movie.title;
            // image.style.width = "350px"; // Adjust the width as needed
            //image.style.height = "35vh"; // Adjust the height as needed

            if (window.innerWidth <= 768) { // Adjust the threshold as needed for your mobile design
              image.style.height = "25vh"; // Decrease the height for mobile devices
          } else {
              image.style.height = "35vh"; // Default height for larger screens
          }


            image.addEventListener('click', () => {
              handlePosterClick(movie.id);
          });


            movieList.appendChild(image);
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

     // Function to handle poster click event
     function handlePosterClick(movieId) {
      // Redirect to movie details page with movie ID as URL parameter
      window.location.href = `movie_details.html?id=${movieId}`;
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
          image.src = `https://image.tmdb.org/t/p/w200${series.poster_path}`;
          image.alt = series.name;
          //image.style.height = "35vh"; // Adjust the height as needed
          //image.style.width = "35vw"; 

        
  
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
    window.location.href = `series_details.html?id=${seriesId}`;
  }
  
    
   

    document.addEventListener('DOMContentLoaded', function() {
      fetchAndDisplayMovies(now_playing, 'movies');
      fetchAndDisplayMovies(top_rated, 'topratedmovies');
      fetchAndDisplayMovies(nowPlayingIndia, 'moviesind');
      fetchAndDisplayMovies(bollywood, 'bollywood');
  
      // Series
      fetchAndDisplaySeries(now_airing, 'series');
      fetchAndDisplaySeries(top_rated_series, 'seriestr');
      fetchAndDisplaySeries(bollywood_series, 'bollyseries');
  });



    //movies-slider
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
                  <a href=movie_details.html?id=${movie.id} class="watch-now-button">Watch Now</a>
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
  
   
    
  const slider = document.querySelector('.slider');
  function activate(e) {
    let inx=0;
    const items = document.querySelectorAll('.item');
    const nav = document.querySelector('.nav');

    e.target.matches('.next') && slider.append(items[0])
    e.target.matches('.prev') && slider.prepend(items[items.length-1]);


    if (e.target.matches('.next'))
    {
         inx=2;
    }

    nav.addEventListener('mouseenter', () => {
    // Make all movie items visible
    items.forEach(item => {
        item.style.opacity = 1;
    });
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
}
document.addEventListener('click',activate,false);



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


function searchMovies() {
  const query = document.getElementById('searchInput').value;
  if (query.length < 3) {
    alert("Please enter at least 3 characters for search.");
    return;
  }
  const url = `results.html?query=${query}`;
  window.location.href = url;
}


 // Function to adjust image heights based on window width
 function adjustImageHeights() {
  const images = document.querySelectorAll('img'); // Select all images

  images.forEach(image => {
      if (window.innerWidth <= 768) {
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