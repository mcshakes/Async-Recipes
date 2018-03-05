
const appKey = edamam.APP_KEY
const appId = edamam.APP_ID
const nutr_id = nutritionix.APP_ID
const nutr_key = nutritionix.APP_KEY
const yummID = yummly.APP_ID
const yummKey = yummly.APP_KEY

const baseURL = `https://api.edamam.com/search?q=`
const yummURL = "https://api.yummly.com/v1/api/recipes?"

var recipeData;
var page = 1;

function toggleDietaryAlert() {
  $(".alert").toggleClass('in out');
  let form = $(".dietary-url-builder")

  form.addClass('was-validated')
  // return false;
}

function buildYummlyURL() {
  let ending = ""
  let pesc = $("#pescatarian");

  if (pesc.is(":checked")) {
    ending += "&allowedDiet[]=Pescetarian"
  }
  return ending
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
  else {
    // noDietaryAlert();
    console.log("User did not pick a legitimate dietary option")
  }
  return ending
}

function renderContent() {
  $(".user-diet-preference").hide();
  $(".content-body").removeClass("hide");
  addBackButton();

  $("button.return-form").on("click" ,function() {
    returnToDietForm()
  });
}

function showPaginateButton() {
  $(".next-btn").removeClass("invisible");
}

function clickNext() {
  $(".next-btn").on("click", nextPage);
}

function nextPage() {
  page += 1
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
  });
}

function errorHandling() {
  // put in .fail
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
}

function displayRecipes(data) {
  // console.log(data)
  recipeData = data.hits
  let perPage = recipeData.slice(0,5)

  let results = createRecipeCard(perPage)

  $(".search-results").html(results);
  showPaginateButton();
  clickNext()
}

function createRecipeCard(dataArr) {
  let results = dataArr.map((hit, index) => {
    const recipeCard = $(renderResults(hit,index));
    ingredientListener(hit.recipe.ingredientLines, recipeCard);

    return recipeCard;
  });
  return results;
}

function renderResults(result, index) {

  let ingArr = result.recipe.ingredientLines
  let list = ""

  for(let i = 0; i < ingArr.length; i++) {
    list += `<li>${ingArr[i]}</li>`
  }

  return `
    <div class="recipe-card rounded">

        <figure>
          <a target="_blank" href="${result.recipe.url}">
            <img src="${result.recipe.image}" class="img-fluid rounded mx-auto d-block" alt="">
            <div class="mask rgba-white-slight"></div>
          </a>
        </figure>


      <div class="card-body">
        <h3 class="card-title">${result.recipe.label}</h3>
        </hr>

        <ul class="card-text">
          ${list}
        </ul>

        <button type="button" class="nutrient-data btn btn-primary" data-toggle="modal" data-target="#nutritionModal">See Nutrients</button>

    </div>
  `;

}

function getNutrients(ing_arr) {
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
        console.log(foodArr[i].food_name)
        console.log(foodArr[i].nf_calories)
        console.log(foodArr[i].nf_total_fat)
        console.log(foodArr[i].nf_saturated_fat)
        console.log(foodArr[i].nf_total_carbohydrate)
        console.log(foodArr[i].nf_protein)
        console.log(foodArr[i].nf_sugars)

        nutrition +=
        `
        <strong></strong>

        `
      }

      // $("modal-body").html(nutrition)

      // console.log(data.foods)
    },
    error: function(e) {
      console.log(e);
    }
  });
}

function getStarted() {
  $(".submit-build").on("click", function(e) {
    e.preventDefault()
    checkedBoxes = $("input[type='checkbox']:checked")

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
    getNutrients(ingArr)
   })
}

function addBackButton() {
  $(".navbar").append(`<button class="return-form btn">Back to Form</button>`)
}

function returnToDietForm() {
  location.reload();
}

$(document).ready(function() {
  getStarted();
  submitSearch();
})
