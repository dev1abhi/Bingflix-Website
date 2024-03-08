
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
const now_airing =`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`;


    function fetchAndDisplayMovies(url, containerId) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const movieList = document.getElementById(containerId);
    
          data.results.forEach(movie => {
            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            image.alt = movie.title;
            image.style.width = "350px"; // Adjust the width as needed
            image.style.height = "180px"; // Adjust the height as needed
            movieList.appendChild(image);
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    
    // Fetch and display upcoming movies
    fetchAndDisplayMovies(now_playing, 'movies');
    
    // Fetch and display unrated movies
    fetchAndDisplayMovies(now_airing, 'series');

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


const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  e.target.matches('.next') && slider.append(items[0])
  e.target.matches('.prev') && slider.prepend(items[items.length-1]);
}

document.addEventListener('click',activate,false);