const appKey = edamam.APP_KEY
const appId = edamam.APP_ID

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
  const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&from=0&to=8`
  $.getJSON(url, query, callback);
}

function displayRecipes(data) {
  const results = data.hits.map((hit, index) => renderResults(hit, index));
  $(".search-results").html(results);
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
          <img class="thumbnail" src="${result.recipe.image}" alt="">
      </figure>
      <ul>
        ${list}
      </ul>
    </div>
  `;
}

// function sortIngredients()

$(document).ready(function() {
  submitSearch();
})
