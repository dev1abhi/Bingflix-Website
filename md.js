
function switchEmbed(embedUrl) {
    console.log(embedUrl);
    const iframe = document.getElementById('movieIframe');
    iframe.src = embedUrl;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function switchEmbed1(embedUrl) {
    const movieI = getParameterByName('id');
    const iframe = document.getElementById('movieIframe');
    iframe.src = embedUrl + movieI;}


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
                    

                    const actorName = document.createElement('span');
                    const actorImage = document.createElement('img');
                    actorName.textContent = actor.name;
                    actorImage.src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
                    actorImage.alt = actor.name;
                    listItem.appendChild(actorImage);
                    listItem.appendChild(actorName);
                    castList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching cast details:', error));
    }

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
            switchEmbed('https://embed.smashystream.com/playere.php?tmdb=${movieId}');
        })
        .catch(error => console.error('Error fetching movie details:', error));


        function fetchAndEmbedTrailer() {
            fetch(videosUrl)
                .then(response => response.json())
                .then(data => {
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

        const poster = document.getElementById('poster');
        poster.addEventListener('click', fetchAndEmbedTrailer);
});