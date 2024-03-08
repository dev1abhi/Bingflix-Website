
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
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const movieList = document.querySelector('#' + containerId);
    
          data.results.forEach(movie => {
            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            image.alt = movie.title;
            image.style.width = "350px"; // Adjust the width as needed
            image.style.height = "180px"; // Adjust the height as needed



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
    
    // Fetch and display upcoming movies
    fetchAndDisplayMovies(now_playing, 'movies');
    
    fetchAndDisplayMovies(top_rated,'topratedmovies');

    fetchAndDisplayMovies(nowPlayingIndia,'moviesind');

    fetchAndDisplayMovies(bollywood,'bollywood');


    //series

    fetchAndDisplayMovies(now_airing, 'series');

    fetchAndDisplayMovies(top_rated_series,'seriestr');

    fetchAndDisplayMovies(bollywood_series,'bollyseries');

    //movies-slider

    //fetchAndDisplayMovies(navmovies,'slider');


    document.addEventListener("DOMContentLoaded", function() {
      const apiKey = '68e094699525b18a70bab2f86b1fa706';
      const topMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

      fetch(topMoviesUrl)
          .then(response => response.json())
          .then(data => {
              const slider = document.querySelector('.slider');

              data.results.slice(0, 6).forEach(movie => {
                  const item = document.createElement('li');
                  item.classList.add('item');
                  item.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`;
                 
                        
                  const content = document.createElement('div');
                  content.classList.add('content');
                  content.innerHTML = `
                      <h2 class='title'>${movie.title}</h2>
                      <p class='description'>${movie.overview}</p>
                      <button>Read More</button>
                  `;
               

//Select the nav element
const nav = document.querySelector('.nav');
// Select all movie items
const movieItems = document.querySelectorAll('.item');

// Add event listeners to the nav element for hover effect
// nav.addEventListener('mouseenter', () => {
//     // Make all movie items visible
//     movieItems.forEach(item => {
//         item.style.opacity = 1;
//     });
// });

// nav.addEventListener('mouseleave', () => {
//     // Make only movies 2 to 6 invisible
//     movieItems.forEach((item, index) => {
//         if (index > 1 && index < 6) {
//             item.style.opacity = 0;
//         }
//     });
// });


                  item.appendChild(content);
                  slider.appendChild(item);
              });


          })
          .catch(error => console.error('Error fetching top movies:', error));
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







  