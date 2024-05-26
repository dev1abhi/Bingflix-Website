
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
    const iframe = document.getElementById('seriesIframe');
    iframe.src = embedUrl;
}


document.addEventListener("DOMContentLoaded", function() {
   
    // Fetch series details using series ID from URL parameter
    const seriesId = getParameterByName('id');
    const apiKey = 'TMDB_API_KEY_HERE';
    const seriesDetailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`;
    const castUrl = `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}`;
    const videosUrl = `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}`;
    //const seasonsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/seasons?api_key=${apiKey}`;

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
    
    
    function fetchSeasonsAndEpisodes() {
        fetch(seriesDetailsUrl)
            .then(response => { console.log(response) ; return response.json();})
            .then(data => {
                // Populate seasons and episodes in dropdown menus
                const seasonSelect = document.getElementById('Sno');
                const episodeSelect = document.getElementById('epNo');
    
                data.seasons.filter(season => season.season_number !== 0).forEach(season => {
                    const option = document.createElement('option');
                    option.value = season.season_number;
                    option.textContent = `Season ${season.season_number}`;
                    seasonSelect.appendChild(option);
                });
    
                // Trigger change event to populate episodes for the first season
                seasonSelect.dispatchEvent(new Event('change'));
            })
            .catch(error => console.error('Error fetching seasons and episodes:', error));
    }

    //fetchCastDetails is also getting called inside this
    fetch(seriesDetailsUrl)
        .then(response => response.json())
        .then(data => {
            // Populate series details in HTML elements
            const poster = document.getElementById('poster');
            const title = document.getElementById('title');
            const description = document.getElementById('description');

            poster.src = `https://image.tmdb.org/t/p/w780${data.backdrop_path}`;
            title.textContent = data.name;
            description.textContent = data.overview;
            
            fetchCastDetails();

             // Fetch and populate seasons and episodes
            fetchSeasonsAndEpisodes();

        })
        .catch(error => console.error('Error fetching series details:', error));


    const seasonSelect = document.getElementById('Sno');
    const episodeSelect = document.getElementById('epNo');

    seasonSelect.addEventListener('change', function() {
        const seasonNumber = this.value;
        // Clear episode dropdown
        episodeSelect.innerHTML = '';
        // Populate episodes for selected season
        fetchEpisodesForSeason(seasonNumber);
    });

    function fetchEpisodesForSeason(seasonNumber) {
        // Fetch episodes for the selected season
        const episodesUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}`;
        fetch(episodesUrl)
            .then(response => response.json())
            .then(data => {
                data.episodes.forEach(episode => {
                    const option = document.createElement('option');
                    option.value = episode.episode_number;
                    option.textContent = `Episode ${episode.episode_number}`;
                    episodeSelect.appendChild(option);
                });
                
                // Trigger change event to update embed URL
                episodeSelect.dispatchEvent(new Event('change'));
            })
            .catch(error => console.error('Error fetching episodes:', error));
    }

    episodeSelect.addEventListener('change', function() {
        const seasonNumber = seasonSelect.value;
        const episodeNumber = this.value;

        const seriesId = getParameterByName('id');

        // Construct the URLs for each server based on the selected season and episode
        const server1Url = '';
        const server2Url = '';
        const server3Url = '';
      // Check the current embed URL
        const currentEmbedUrl = document.getElementById('seriesIframe').src;

        // Update the onclick attributes of the buttons
    document.getElementById('Server1Btn').setAttribute('onclick', `switchEmbed('${server1Url}')`);
    document.getElementById('Server2Btn').setAttribute('onclick', `switchEmbed('${server2Url}')`);
    document.getElementById('Server3Btn').setAttribute('onclick', `switchEmbed('${server3Url}')`);

    // Determine which server URL to use based on the current embed URL
    let embedUrl;
    if (currentEmbedUrl.includes('embed.smashystream.com')) {
        embedUrl = server1Url;
    } else if (currentEmbedUrl.includes('multiembed.mov')) {
        embedUrl = server2Url;
    }
    else //default server will always be in else
    {
        embedUrl = server3Url;
    }

    // Call switchEmbed with the determined embed URL
    switchEmbed(embedUrl);

    });



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

function searchSeries() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 3) {
      alert("Please enter at least 3 characters for search.");
      return;
    }
    const url = `../results/results.html?query=${query}`;
    window.location.href = url;
  }