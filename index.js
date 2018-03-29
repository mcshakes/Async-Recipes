
const appKey = edamam.APP_KEY
const appId = edamam.APP_ID
const nutr_id = nutritionix.APP_ID
const nutr_key = nutritionix.APP_KEY


const baseURL = `https://api.edamam.com/search?q=`

var recipeData;
var page = 1;

function toggleDietaryAlert() {
  $("#warning").fadeTo(3000,500).slideUp(500, function() {
    $("#warning").slideUp(500);
  })
}

function buildEdamamURL() {
  let ending = ""
  let vegan = $("#vegan");
  let peanutFree = $("#peanut-free");
  let vegetarian = $("#vegetarian");
  let none = $("#none");

  if (vegan.is(":checked")) {
    ending += "&health=vegan"
  }

  else if (peanutFree.is(":checked")) {
    ending += "&health=peanut-free"
  }

  else if (vegetarian.is(":checked")) {
    ending += "&health=vegetarian"
  }

  else if (none.is(":checked")) {
    ending += ""
  }
  return ending
}

function renderContent() {
  $(".user-diet-preference").hide();
  $(".content-body").removeClass("hide");
  addBackToFormButton();

  $("button.return-form").on("click" ,function() {
    returnToDietForm()
  });

}

function showNextPaginateButton() {
  $(".next-btn").removeClass("invisible");
}

function showPreviousPaginateButton() {
  $(".previous-btn").removeClass("invisible");
}

function clickNext() {
  $(".next-btn").on("click", nextPage);
}

function clickPrevious() {
  $(".previous-btn").on("click", previousPage);
}

function nextPage() {
  page += 1
  paginateRecipes();
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
}

function previousPage() {
  page -= 1
  paginateRecipes();
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
}

function submitSearch() {
  $(".js-search-form").submit(event => {
    event.preventDefault();

    const target = $(event.currentTarget).find(".js-query");
    const query = target.val();

    target.val("")
    getEdamamData(query, displayRecipes);

    // Hides irrelevant parts of the form
    $(".form-header").hide()
    $(".js-search-form").hide()
  });
}

function getEdamamData(query, callback) {

  const url = `${baseURL}${query}&app_id=${appId}&app_key=${appKey}&from=0&to=50` + buildEdamamURL();

  $.getJSON(url, query, callback)
  .fail(function(e) {
    console.log(e)
  });
}

function paginateRecipes() {
  let index = page * 5
  let perPage = recipeData.slice((index - 5), index )

  let results = createRecipeCard(perPage)

  $(".search-results").html(results);
  // NOTE: Page is being incremented here
}

function displayRecipes(data) {

  recipeData = data.hits
  let ingredients = data.q
  let count = data.count;

  let perPage = recipeData.slice(0,5)

  let results = createRecipeCard(perPage)

  if (count === 0) {
    noRecipesToShow();
  } else {
    $(".search-results").html(results);

    ingredientsInHand(ingredients);
    pagination();
  }
}

function pagination() {
  showPreviousPaginateButton();
  showNextPaginateButton();

  clickNext();
  clickPrevious();
}

function noRecipesToShow() {
  $(".content-body").append("Oh no! We got nothing for you. Make something up or try a different combo")
}

function ingredientsInHand(ing) {
  $(".reminder").html(ing)
  $(".ingredients-in-hand").show();
}

function createRecipeCard(dataArr) {
  let results = dataArr.map((hit, index) => {
    const recipeCard = $(buildRecipe(hit,index));
    ingredientListener(hit.recipe.ingredientLines, recipeCard);

    return recipeCard;
  });
  return results;
}

function buildRecipe(result, index) {

  let ingArr = result.recipe.ingredientLines
  let list = ""

  for(let i = 0; i < ingArr.length; i++) {
    list += `<li>${ingArr[i]}</li>`
  }

  return `
    <div class="recipe-card rounded">

        <div class="hold-image">
          <a target="_blank" href="${result.recipe.url}">
            <img src="${result.recipe.image}" class="img-fluid rounded mx-auto d-block" alt="">
            <div class="middle">
              <div class="message">Click image for full recipe</div>
            </div>
          </a>
        </div>


      <div class="card-body">
        <h3 class="card-title">${result.recipe.label}</h3>
        </hr>

        <ul class="card-text">
          ${list}
        </ul>

        <button type="button" class="nutrient-data btn btn-primary" data-toggle="modal" data-target="#nutritionModal">Nutritional Info</button>

    </div>
  `;

}

function getNutritionInfo(ing_arr) {
  let ingredients = ing_arr.join();

  $.ajax({
    url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
    headers: {
      "x-app-id": nutritionix.APP_ID,
      "x-app-key": nutritionix.APP_KEY
    },
    dataType: "json",
    data: {"query": ingredients},
    method: 'POST',
    success: function(data) {
      let foodArr = data.foods;
      let nutrition = "";

      for (let i = 0; i < foodArr.length; i++) {
        let name = foodArr[i].food_name
        let totalCal = foodArr[i].nf_calories
        let fat = foodArr[i].nf_total_fat
        let saturatedFat = foodArr[i].nf_saturated_fat
        let carbs = foodArr[i].nf_total_carbohydrate
        let protein = foodArr[i].nf_protein
        let sugar = foodArr[i].nf_sugars

        nutrition +=
        `<table class="table table-hover">
          <thead>
            <tr>
              <th><strong>${name}</strong></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Calories:</td> <td>${totalCal}</td>
            </tr>
            <tr>
              <td>Fat:</td> <td>${fat} grams</td>
            </tr>
            <tr>
              <td>Saturated Fat:</td> <td>${saturatedFat} grams</td>
            </tr>
            <tr>
              <td>Carbohydrates:</td> <td>${carbs} grams</td>
            </tr>
            <tr>
              <td>Protein:</td> <td>${protein} grams</td>
            </tr>
            <tr>
              <td>Sugar:</td> <td>${sugar} grams</td>
            </tr>
          </tbody>
        </table>
        `
      }

      $(".modal-body").html(nutrition)

    },
    error: function(e) {
      console.log(e);
    }
  });
}

function getStarted() {
  $(".submit-build").on("click", function(e) {
    e.preventDefault()

    let checkedBoxes = $("input[type='checkbox']:checked")

    if (checkedBoxes.length === 0) {
      toggleDietaryAlert();
    } else {
      renderContent();
      buildEdamamURL();
    }
  });
}

function ingredientListener(ingArr, recipeCard) {
   recipeCard.on("click", "button.nutrient-data", function() {
     getNutritionInfo(ingArr)
   })
}

function addBackToFormButton() {
  $(".navbar").append(`<button class="return-form btn">Try Different Diet?</button>`)
}

function returnToDietForm() {
  location.reload();
}

$(document).ready(function() {
  getStarted();
  submitSearch();
})
