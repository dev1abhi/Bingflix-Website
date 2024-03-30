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
const apiKey = '68e094699525b18a70bab2f86b1fa706';
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