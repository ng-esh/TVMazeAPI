"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( term ) {
  
    // Make an API call to the TVMaze search shows endpoint
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  
   // Extract the necessary data from the response
  return res.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary || "No summary available.",
      image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing" // Fallback if no image
    };
  });
  
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= '${show.image}'
              alt='${show.name}'
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}
async function getEpisodesOfShow(id) {
  // Make an API call to get the episodes of a show by ID
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  // Return an array of episode objects with relevant info
  return res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty();

  // Loop through episodes and add each as an <li> element
  for (let episode of episodes) {
    const $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );
    $episodesList.append($item);
  }

  // Show the episodes area
  $("#episodesArea").show();
}

$showsList.on("click", ".Show-getEpisodes", async function(evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
