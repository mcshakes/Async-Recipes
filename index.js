
function submitSearch() {
  $(".js-search-form").submit(event => {
    event.preventDefault();

    const target = $(event.currentTarget).find(".js-query");
    const query = target.val();

    target.val("")
    getData(query, displayYouTubeData);
  });
}

function getData(query, callback) {

const url =

  $.getJSON(url, query, callback);
}

function displayYouTubeData(data) {
  const results = data.items.map((item, index) => renderResults(item));
  $(".search-results").html(results);
}

function renderResults(result) {
  return `
    <div>
      <h3>${result.snippet.title}</h3>

      <figure>
        <a target="_blank" href="https://www.youtube.com/watch?v=${result.id.videoId}">
          <img class="thumbnail" src="${result.snippet.thumbnails.medium.url}" alt="">
        </a>
      </figure>

      <${result.snippet.description}</p>
    </div>
  `;
}

$(document).ready(function() {
  submitSearch();
})
