const appKey = edamam.APP_KEY
const appId = edamam.APP_ID
const nutr_id = nutritionix.APP_ID
const nutr_key = nutritionix.APP_KEY
const baseURL = `https://api.edamam.com/search?q=`

function buildURL() {
  let ending = ""
  let vegan = $("#vegan");
  let peanutFree = $("#peanut-free");
  let none = $("#none");

  if (vegan.is(":checked")) {
    ending += "&health=vegan"
  }
  else if (peanutFree.is(":checked")) {
    ending += "&health=peanut-free"
  }
  else {
    ending += ""
  }
  return ending

}

function renderContent() {
  $(".user-diet-preference").hide();
  $(".content-body").removeClass("hide")
  // fadeIn(1000);
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

function errorHandling() {
  // put in .fail
}

function getData(query, callback) {
  const url = `${baseURL}${query}&app_id=${appId}&app_key=${appKey}&from=0&to=10` + buildURL();
  $.getJSON(url, query, callback)
  .fail(function() {
    alert('getJSON request failed! ');
  });
}

function getNutrients(ing_arr) {
  let ingredients = ing_arr.join();

  $.ajax({
    headers: {
      "x-app-id": nutr_id,
      "x-app-key": nutr_key
    },
    dataType: "json",
    data: ingredients,
    method: 'POST',
    url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
    success: function(data) {
      console.log("HEEY Was CLicked")
    },
    error: function() {
      console.log("Error grabbing calories and nutrient info");
    }
  });
}

function displayRecipes(data) {
  // console.log(data)
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

  $(`recipe-${index + 1}`).on("click", ".nutrient-data", function(ingArr) {
    console.log("HEy within button click")
    // getNutrients(ingArr)
  })

  return `
    <div class="">
      <h2>${result.recipe.label}</h2>
      <figure>
        <a target="_blank" href="${result.recipe.url}">
          <img class="thumbnail" src="${result.recipe.image}" alt="">
        </a>
      </figure>
      <ul>
        ${list}
      </ul>

      <button class="nutrient-data">See Nutrients</button>
    </div>
  `;
}




$(document).ready(function() {
  $(".submit-build").on("click", function(e) {
    e.preventDefault()
    renderContent();
    buildURL();
  });

  submitSearch();
})
