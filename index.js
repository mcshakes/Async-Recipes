const appKey = edamam.APP_KEY
const appId = edamam.APP_ID
const baseURL = `https://api.edamam.com/search?q=`

function buildURL() {
  let ending = ""
  // $(".submit-build").click(function() {
    let vegan = $("#vegan");

    if (vegan.is(":checked")) {
      ending += "&health=vegan"
    }
  // })
  return ending
}

function renderContent() {
  $(".user-diet-preference").hide();
  $(".content-body").fadeIn(1000);
}

function submitSearch() {
  $(".js-search-form").submit(event => {
    event.preventDefault();

    const target = $(event.currentTarget).find(".js-query");
    const query = target.val();

    target.val("")
    getData(query, displayRecipes);
  });
}

function getData(query, callback) {
  const url = `${baseURL}${query}&app_id=${appId}&app_key=${appKey}&from=0&to=10` + buildURL
  $.getJSON(url, query, callback);
}

function displayRecipes(data) {
  const results = data.hits.map((hit, index) => renderResults(hit, index));

  const count = data.count
  $(".search-results").html(results);
  $("#number-of-recipes").html(count);
}

function renderResults(result, index) {

  let ingArr = result.recipe.ingredientLines
  let list = ""

  for(let i = 0; i < ingArr.length; i++) {
    list += `<li>${ingArr[i]}</li>`
  }

  return `
    <div class="recipe-${index + 1}">
      <h2>${result.recipe.label}</h2>
      <figure>
        <a target="_blank" href="${result.recipe.url}">
          <img class="thumbnail" src="${result.recipe.image}" alt="">
        </a>
      </figure>
      <ul>
        ${list}
      </ul>
    </div>
  `;
}

$(document).ready(function() {
  $(".submit-build").on("click", function() {
    buildURL();
    renderContent();
  });

  submitSearch();
})
