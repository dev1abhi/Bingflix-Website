let ImdbId;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function switchEmbed(embedUrl) {
    console.log("Switching embed to:", embedUrl);
    console.log(embedUrl);
    const iframe = document.getElementById('movieIframe');
    iframe.src = embedUrl;
}

const movieId = getParameterByName('id');
const apiKey = 'TMDB_API_KEY_HERE';
const extidsUrl =  `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${apiKey}`;
async function getImdbIdAndEmbed(embedUrl)
{
    await fetch(extidsUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data.imdb_id);
                 
                embedUrl=embedUrl+data.imdb_id;
                console.log(embedUrl);
                const iframe = document.getElementById('movieIframe');
                iframe.src = embedUrl;


            })
         }


document.addEventListener("DOMContentLoaded", function() {
   
    // Fetch movie details using movie ID from URL parameter
    const movieId = getParameterByName('id');
    const apiKey = '68e094699525b18a70bab2f86b1fa706';
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;


    const likeButton = document.querySelector('.paw-button'); // Assuming you have only one like button
    if (likeButton && movieId) {
        likeButton.setAttribute('data-movie-id', movieId);
        updateLikeButtonState(movieId);
    }
   
    //updating like button state when doc reloads
    function updateLikeButtonState(movieId) {
        const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
        const likeButton = document.querySelector('.paw-button');
        
        if (likedMovies.includes(movieId)) {
            // The movie is liked
            if (likeButton) {

                document.querySelectorAll('.paw-button').forEach(elem => { 
                    elem.classList.add('animation');
                    elem.classList.add('confetti');
                    elem.classList.add('liked');
                    elem.children[1].textContent = "Saved";
                })
               // Update to match your "liked" state appearance
            }
        } else {
            // The movie is not liked
            // if (likeButton) {
            //     likeButton.classList.remove('liked');
            //     likeButton.children[1].textContent = ""; // Update to your default state appearance
            // }
        }
    }

    function fetchCastDetails() {
        fetch(castUrl)
            .then(response => response.json())
            .then(data => {
                // Populate cast details in HTML element
                const castList = document.getElementById('castList');
                data.cast.slice(0, 5).forEach(actor => {
                    const listItem = document.createElement('div');
                    listItem.style.width='fit-content';

                    listItem.style.display='flex';
                    listItem.style.flexDirection='column';
                    listItem.style.paddingRight= '20px';
                    listItem.style.fontFamily='Poppins';
                    listItem.style.fontSize ='1vw'
                    

                    const actorName = document.createElement('span');
                    const actorImage = document.createElement('img');
                    actorName.textContent = actor.name;
                    actorImage.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
                    actorImage.alt = actor.name;
                    actorImage.style.borderRadius="1.2rem";
                    listItem.appendChild(actorImage);
                    listItem.appendChild(actorName);
                    castList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching cast details:', error));
    }

    //fetchCastDetails is also getting called inside this
    fetch(movieDetailsUrl)
        .then(response => response.json())
        .then(data => {
            // Populate movie details in HTML elements
            const poster = document.getElementById('poster');
            const title = document.getElementById('title');
            const description = document.getElementById('description');

            poster.src = `https://image.tmdb.org/t/p/w780${data.backdrop_path}`;
            title.textContent = data.title;
            description.textContent = data.overview;
            
            fetchCastDetails();

            // Set default embed URL
            switchEmbed('https://vidsrc.xyz/embed/' + getParameterByName('id'));
        })
        .catch(error => console.error('Error fetching movie details:', error));


        function fetchAndEmbedTrailer() {
            fetch(videosUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("showing trailer");
                    // Find trailer key
                    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
                    if (trailer) {
                        const trailerKey = trailer.key;
                        // Embed trailer
                        switchEmbed(`https://www.youtube.com/embed/${trailerKey}`);
                    } else {
                        console.log("Trailer not found");
                    }
                })
                .catch(error => console.error('Error fetching trailer:', error));
        }

        const trailer = document.getElementById('Trailerbtn');
        trailer.addEventListener('click', fetchAndEmbedTrailer);
});



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

  let confettiAmount = 60,
    confettiColors = [
        '#7d32f5',
        '#f6e434',
        '#63fdf1',
        '#e672da',
        '#295dfe',
        '#6e57ff'
    ],
    random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    createConfetti = to => {
        let elem = document.createElement('i'),
            set = Math.random() < 0.5 ? -1 : 1;
        elem.style.setProperty('--x', random(-260, 260) + 'px');
        elem.style.setProperty('--y', random(-160, 160) + 'px');
        elem.style.setProperty('--r', random(0, 360) + 'deg');
        elem.style.setProperty('--s', random(.6, 1));
        elem.style.setProperty('--b', confettiColors[random(0, 5)]);
        to.appendChild(elem);
    };

document.querySelectorAll('.paw-button').forEach(elem => {
    elem.addEventListener('click', e => {

        let movieId = elem.getAttribute('data-movie-id');
        

        let number = elem.children[1].textContent;
        if(!elem.classList.contains('animation')) {
            elem.classList.add('animation');
            for(let i = 0; i < confettiAmount; i++) {
                createConfetti(elem);
            }
            setTimeout(() => {
                elem.classList.add('confetti');
                setTimeout(() => {
                    elem.classList.add('liked');
                    elem.children[1].textContent = "Saved";
                }, 400);
                setTimeout(() => {
                    elem.querySelectorAll('i').forEach(i => i.remove());
                }, 600);
            }, 260);
        }
        
        
        else {
            elem.classList.remove('animation', 'liked', 'confetti');
            elem.children[1].textContent = "";
        }

        toggleLikeState(movieId, elem);

        function toggleLikeState(movieId, elem) {
            let likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
            
            // Check if the movie is already liked
            if (likedMovies.includes(movieId)) {
                // Movie is already liked; unlike it
                likedMovies = likedMovies.filter(id => id !== movieId);
              
            } else {
                // Movie is not liked; like it
                likedMovies.push(movieId);
            }
        
            // Update localStorage
            localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        }

        e.preventDefault();

    });
});


