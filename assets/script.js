/* setting some general variables for use */
var userName = "";
var userAge = 0;
var userHeight = "";
var userWeight = 0;
var userGender = "";
var idealWeight = 0;
var maxCalories = 0;
var whatMeal = "";
var dietRestrict = [];

/* on SubmitBtn click, anything added to text areas are saved to Local Storage */
/* need to expand on this to run a couple additional functions after the initial collection of information */
$(".SubmitBtn").click(function () {
    var yourName = $(this).closest('.container').find('#UserName').find('textarea').val();
    console.log("User Name is " + yourName);
    /* var userAge = $parent('.container').find('#UserAge').child('.input').val(); */
    var yourAge = $(this).closest('.container').find('#UserAge').find('textarea').val();
    console.log(yourName + " is " + yourAge + " years old.");
    var yourHeight = $(this).closest('.container').find('#UserHeight').find('textarea').val();
    console.log(yourName + " is " + yourHeight + " tall.");
    var yourWeight = $(this).closest('.container').find('#UserCurrentWeight').find('textarea').val();
    console.log(yourName + " weighs " + yourWeight + " pounds.");
    var idealWeight = $(this).closest('.container').find('#UserIdealWeight').find('textarea').val();
    console.log(yourName + " wants to weigh " + idealWeight + " pounds.");
    var yourGender = $(this).closest('.container').find('#UserGender').find('select').val();
    console.log(yourName + " is a " + yourGender)
    var userInfo = [yourName, yourAge, yourHeight, yourWeight, idealWeight, yourGender];
    localStorage.setItem("User Info", JSON.stringify(userInfo));

    setCalorieMax();
    gotoSecondPage();
});

$(".CancelBtn").click(function () {
    $(this).closest('.container').find('#UserName').find('textarea').val("");
    $(this).closest('.container').find('#UserAge').find('textarea').val("");
    $(this).closest('.container').find('#UserHeight').find('textarea').val("");
    $(this).closest('.container').find('#UserCurrentWeight').find('textarea').val("");
    $(this).closest('.container').find('#UserIdealWeight').find('textarea').val("");
});

$(".SecondSubmitBtn").click(function () {
    var userInfo = [];
    var userInfo = JSON.parse(localStorage.getItem("Extended User Info"));
    var yourName = userInfo[0];
    /* use Bulma to find a REQUIRED FIELD formatting for MEAL TYPE */
    var yourMeal = $(this).closest('.container').find('#UserMeal').find('select').val();
    console.log(yourName + " wants a " + yourMeal + " recipe.");
    var yourCuisine = $(this).closest('.container').find('#UserCuisine').find('textarea').val();
    console.log(yourName + " wants a recipe for " + yourCuisine + " food!");
    var yourIngredients = $(this).closest('.container').find('#UserIngredients').find('textarea').val();
    console.log(yourName + " has " + yourIngredients + " on hand they would like to use.");
    var yourDiet = $(this).closest('.container').find('#UserDiet').find('select').val();
    console.log(yourName + " abides by a " + yourDiet + " diet.");
    var yourAllergies = $(this).closest('.container').find('#UserAllergies').find('textarea').val();
    console.log(yourName + " is allergic to " + yourAllergies + "!");
    var yourNutrition = $(this).closest('.container').find('#UserNutrition').find('select').val();
    console.log(yourName + " wants a meal that adheres to the following nutritional requirements: " + yourNutrition + ".");
    
    var newInfo = [yourMeal];
    var moreInfo = userInfo.concat(newInfo);
    localStorage.setItem("Full User Info", JSON.stringify(moreInfo));
    var mealInfo = [yourMeal, yourCuisine, yourDiet]
    localStorage.setItem("User Meal Info", JSON.stringify(mealInfo));
    /* sets separate localStorage Items with any input that can have multiple things within it */
    var ingredientInfo = yourIngredients.split(",");
    var allergenInfo = yourAllergies.split(",");
    /* var nutritionInfo = [yourNutrition.split(",");] */
    var nutritionInfo = [yourNutrition];
    /* now any localStorage Item with multiple listed things can be separated as if an array, hopefully */
    localStorage.setItem("Ingredient List", JSON.stringify(ingredientInfo));
    localStorage.setItem("Restriction List", JSON.stringify(allergenInfo));
    localStorage.setItem("Nutrition List", JSON.stringify(nutritionInfo));

    setMealMax();
    setMealParameters();
    cleanSplitArrays();
    firstAPIcall();
    gotoThirdPage();
});

$(".SecondCancelBtn").click(function () {
    /* no need to reset the drop-down menu */
    $(this).closest('.container').find('#UserCuisine').find('textarea').val("");
    $(this).closest('.container').find('#UserIngredients').find('textarea').val("");
    /* trying to reset this drop-down menu to "no diet" option */
    $(this).closest('.container').find('#UserDiet').find('select').val("nodiet");
    $(this).closest('.container').find('#UserAllergies').find('textarea').val("");
    /* trying to reset this drop-down menu to "no specifications" option */
    $(this).closest('.container').find('#UserNutrition').find('select').val("nospecification");
    /* if cancel on secondPage, go back to firstPage and empty the "User Info" in localStorage */
    var resetInfo = [];
    var resetInfo = JSON.parse(localStorage.getItem("User Info"));
    var resetInfo = [];
    localStorage.setItem("User Info", JSON.stringify(resetInfo));
    /* also reset the "Extended User Info" in localStorage */
    var resetExtend = [];
    var resetExtend = JSON.parse(localStorage.getItem("Extended User Info"));
    var resetExtend = [];
    localStorage.setItem("Extended User Info", JSON.stringify(resetExtend));

    backtoFirstPage();
});

function setCalorieMax() {
    /* ratio of current weight divided by ideal weight = multiplier for calorie deficit*/
    var userInfo = [];
    var userInfo = JSON.parse(localStorage.getItem("User Info"));
    var yourWeight = userInfo[3];
    var idealWeight = userInfo[4];
    var yourGender = userInfo[5];
    var calorieMultiplier = 0;

    if (yourWeight / idealWeight < 3/4) {
        calorieMultiplier = 1.4;
    } else if (yourWeight / idealWeight < 1/1 && yourWeight / idealWeight > 3/4) {
        calorieMultiplier = 1.2;
    } else if (yourWeight / idealWeight === 1) {
        calorieMultiplier = 1.0;
    } else if (yourWeight / idealWeight > 1/1 && yourWeight / idealWeight < 4/3) {
        calorieMultiplier = 0.9;
    } else if (yourWeight / idealWeight > 4/3 && yourWeight / idealWeight < 5/3) {
        calorieMultiplier = 0.8;
    } else if (yourWeight / idealWeight > 5/3 && yourWeight / idealWeight < 2) {
        calorieMultiplier = 0.7;
    } else if (yourWeight / idealWeight > 2) {
        calorieMultiplier = 0.6;
    };

    /* general multiplier to arrive at calorieMax depending on gender */
    var genderMultiplier = 0;

    if (yourGender = "man") {
        genderMultiplier = 15;
    } else if (yourGender = "woman") {
        genderMultiplier = 10;
    } else if (yourGender = "nonbinary") {
        genderMultiplier = 12.5;
    } else if (yourGender = "transman") {
        genderMultiplier = 14;
    } else if (yourGender = "transwoman") {
        genderMultiplier = 11;
    };

    /* sets a maximum calorie intake for the day for a normal weight loss rate */
    var calorieMax = idealWeight * genderMultiplier
    console.log("Max ideal intake for a " + yourGender + " who weighs " + yourWeight + " pounds is " + calorieMax + " calories per day!")

    /* sets a minimum calorie intake for the day for an accelerated weight loss rate */
    var calorieMin = calorieMax * calorieMultiplier
    console.log("For increased efficiency in reaching " + idealWeight + " pounds, you should set a goal of " + calorieMin + " calories per day!")

    var newInfo = [calorieMin, calorieMax]
    console.log("Thus, your ideal calorie range is " + calorieMin + " - " + calorieMax + " calories per day!")

    var moreInfo = userInfo.concat(newInfo);
    localStorage.setItem("Extended User Info", JSON.stringify(moreInfo));
};

function setMealMax() {
    var userInfo = [];
    var userInfo = JSON.parse(localStorage.getItem("Full User Info"));
    var minCalories = userInfo[6];
    var maxCalories = userInfo[7];
    var yourMeal = userInfo[8];
    var mealMultiplier = 0;

    if (yourMeal = "breakfast") {
        mealMultiplier = 0.20;
    } else if (yourMeal = "main%20course") {
        mealMultiplier = 0.25;
    } else if (yourMeal = "appetizer") {
        mealMultiplier = 0.05;
    } else if (yourMeal = "side%20dish") {
        mealMultiplier = 0.10;
    } else if (yourMeal = "dessert") {
        mealMultiplier = 0.10;
    } else if (yourMeal = "drink") {
        mealMultiplier = 0.05;
    };

    var dailySodium = 2000 * mealMultiplier;
    var minMealCalories = minCalories * mealMultiplier;
    var maxMealCalories = maxCalories * mealMultiplier;
    var mealCalories = [minMealCalories, maxMealCalories, dailySodium];
    console.log("Based on your choice, your ideal calorie range for this meal is " + minMealCalories + " - " + maxMealCalories + " calories!")
    
    /* adds only to new array for singular variables that are relevant to the next bit of code */
    var mealInfo = JSON.parse(localStorage.getItem("User Meal Info"));
    var moreInfo = mealInfo.concat(mealCalories);
    localStorage.setItem("User Meal Info", JSON.stringify(moreInfo));
};

function cleanSplitArrays() {
    var userIngredients = [];
    /* does not need a redeclaration of the var to reassign value */
    var userIngredients = JSON.parse(localStorage.getItem("Ingredient List"));
    userIngredients = userIngredients.map(function(ingredient) {
        return ingredient.trim();
    });
    userIngredients = encodeURIComponent(userIngredients.join(", "));
    var userRestrictions = [];
    var userRestrictions = JSON.parse(localStorage.getItem("Restriction List"));
    userRestrictions = userRestrictions.map(function(restriction) {
        return restriction.trim();
    });
    userRestrictions = encodeURIComponent(userRestrictions.join(", "));
    console.log(userIngredients);
    console.log(userRestrictions);
    localStorage.setItem("Ingredient List", userIngredients);
    localStorage.setItem("Restriction List", userRestrictions);
};

function setMealParameters() {
    var nutritionInfo = [];
    var nutritionInfo = JSON.parse(localStorage.getItem("Nutrition List"));
    /* added minMultipliers so that min # defaults to 0 */
    var minfatMultiplier = 0.00;
    var maxfatMultiplier = 0.0389;
    /* make sure to go back through and remove all the SODIUM mentions, that is a request-breaking parameter and is not included in nearly any of the possible API results anyhow */
    var maxSodium = 1;
    var minproteinMultiplier = 0.00;
    var maxproteinMultiplier = 0.075;
    var minsugarMultiplier = 0.00;
    var maxsugarMultiplier = 0.025;
    var mincarbMultiplier = 0.00;
    var maxcarbMultiplier = 0.0875;

    /* if someone has 2000 calories per day:
    700 fat cal, 700 carb cal inc. sugar, 600 protein cal for 2000
    77.78g fat, 175g carb inc. sugar, 150g protein
    0.0389 fat, .0875 carb inc. sugar, 0.075 protein
    0.025 sugar for 50g sugar, 125g carb
    all add up to defaults 
     */

    if (nutritionInfo == "low-fat") {
        maxfatMultiplier = 0.03;
    } else if (nutritionInfo == "low-sodium") {
        maxSodium = 0.50;
    } else if (nutritionInfo == "low-sugar") {
        maxsugarMultiplier = .0175;
    } else if (nutritionInfo == "nosugar") {
        maxsugarMultiplier = 0.00;
    } else if (nutritionInfo == "high-protein") {
        maxproteinMultiplier = 0.10;
    } else if (nutritionInfo == "low-carb") {
        maxcarbMultiplier = 0.070;
    } else if (nutritionInfo == "keto") {
        maxsugarMultiplier = 0.01;
        maxcarbMultiplier = 0.0263;
        maxfatMultiplier = 0.076;
        maxproteinMultiplier = .0527;
    } else if (nutritionInfo == "nospecification") {    
    };

    var mealInfo = [];
    var mealInfo = JSON.parse(localStorage.getItem("User Meal Info"));
    var minCalories = mealInfo[3];
    var maxCalories = mealInfo[4];
    var mealSodium = mealInfo[5];

    var minProtein = Math.round(minCalories * minproteinMultiplier);
    var maxProtein = Math.round(maxCalories * maxproteinMultiplier);
    var minFat = Math.round(minCalories * minfatMultiplier);
    var maxFat = Math.round(maxCalories * maxfatMultiplier);
    var sodiumLimit = Math.round(mealSodium * maxSodium);
    var minCarbs = Math.round(minCalories * mincarbMultiplier);
    var maxCarbs = Math.round(maxCalories * maxcarbMultiplier);
    var minSugar = Math.round(minCalories * minsugarMultiplier);
    var maxSugar = Math.round(maxCalories * maxsugarMultiplier);
    var realminCarbs = Math.round(minCarbs - minSugar);
    var realmaxCarbs = Math.round(maxCarbs - maxSugar);
    /* maximize the range between minX and maxX so as to not over-narrow the search */
    if ((realmaxCarbs - realminCarbs) < 10){
        realminCarbs = (realmaxCarbs - 10);
    } else if ((maxProtein - minProtein) < 10) {
        minProtein = (maxProtein - 10);
    } else if ((maxSugar - minSugar) < 10){
        maxSugar = (minSugar + 10);
    } else if ((maxFat - minFat) < 10) {
        minFat - (maxFat - 10);
    };
    /* prevent any variable from becoming negative and breaking the request */
    if (realminCarbs < 0) {
        realminCarbs = 0;
    } else if (minProtein < 0) {
        minProtein = 0;
    } else if (minFat < 0) {
        minFat = 0;
    };

    var nutritionGrams = [minProtein, maxProtein, minFat, maxFat, realminCarbs, realmaxCarbs, minSugar, maxSugar, sodiumLimit];
    localStorage.setItem("Nutritional Content For Meal", JSON.stringify(nutritionGrams));
};

function firstAPIcall() {
    var mealInfo = [];
    mealInfo = JSON.parse(localStorage.getItem("User Meal Info"));
    var userMeal = mealInfo[0];
    var userCuisine = mealInfo[1];
    var userDiet = mealInfo[2];
    /* meal variables must be multiplied to account for serving # boosting total
    leave minX numbers alone, multiply maxX numbers by 4 for best results
    number of servings per recipe MUST display on final page to reflect this */
    var minCalories = mealInfo[3];
    var maxCalories = (mealInfo[4] * 4);
    var userIngredients = "";
    userIngredients = localStorage.getItem("Ingredient List");
    var userRestrictions = "";
    userRestrictions = localStorage.getItem("Restriction List");
    var mealNutrition = [];
    mealNutrition = JSON.parse(localStorage.getItem("Nutritional Content For Meal"));
    var minProtein = mealNutrition[0];
    var maxProtein = (mealNutrition[1] * 4);
    var minFat = mealNutrition[2];
    var maxFat = (mealNutrition[3] * 4);
    var minCarbs = mealNutrition[4];
    var maxCarbs = (mealNutrition[5] * 4);
    var minSugar = mealNutrition[6];
    var maxSugar = (mealNutrition[7] * 4);
    var trueNutritionInputs = [minCalories, maxCalories, minProtein, maxProtein, minFat, maxFat, minCarbs, maxCarbs, minSugar, maxSugar];
    localStorage.setItem("API Nutrition Inputs", JSON.stringify(trueNutritionInputs));
    /* sodium was a problem child, API's results for this request rarely have a sodium measurement */
    /* var maxSodium = mealNutrition[8]; */

    /* instructions */
    const nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '297a433770msh51ab7b6b5fc5ad2p1043b5jsnc5affd639b98',
		    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    fetch(nutritionAPIcall, options
        ).then(response => response.json()
        ).then(response => console.log(response)
        ).then(json => {
            /* still cannot get this to work! not sure what the fuck is happening */
            for (i=0; i <= 4; i++) {
            var recipeInfo = json;
            var recipeName = recipeInfo.results.results[i].title;
            var recipeURL = recipeInfo.results.results[i].sourceUrl;
            var recipeImage = recipeInfo.results.results[i].image;
            var recipeServings = recipeInfo.results.results[i].servings;
            var recipeCalories = recipeInfo.results.results[i].calories;
            var recipeCarbs = recipeInfo.results.results[i].carbs;
            var recipeFat = recipeInfo.results.results[i].fat;
            var recipeProtein = recipeInfo.results.results[i].protein;

            var recipeStats = [recipeName, recipeURL, recipeImage, recipeServings,  recipeCalories, recipeCarbs, recipeFat, recipeProtein];
            console.log(recipeStats);
            localStorage.setItem(("Recipe Result Stats" + [i]), JSON.stringify(recipeStats));

        }}).catch(err => console.error(err));
};


/* function to add when clicking the "start" or "get started" button on the landing page to go to firstPage */
function gotoFirstPage() {
    var landingPageContainer = document.getElementById("landingPage");
    landingPageContainer.setAttribute("style", "display:none");
    var firstPageContainer = document.getElementById("firstPage");
    firstPageContainer.setAttribute("style", "display:block");
    var landingHeaderContainer = document.getElementById("landingHeader");
    landingHeaderContainer.setAttribute("style", "display:none");
    var mainHeaderContainer = document.getElementById("initialHeader");
    mainHeaderContainer.setAttribute("style", "display:block");
};

/* function to switch screen from firstPage to secondPage */
function gotoSecondPage() {
    var firstPageContainer = document.getElementById("firstPage");
    firstPageContainer.setAttribute("style", "display:none");
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:block");
};

/* function to switch screen from secondPage to thirdPage */
function gotoThirdPage() {
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:none");
    var thirdPageContainer = document.getElementById("thirdPage");
    thirdPageContainer.setAttribute("style", "display:block");
    var mainHeaderContainer = document.getElementById("initialHeader");
    mainHeaderContainer.setAttribute("style", "display:none");
    var secondHeaderContainer = document.getElementById("finalHeader");
    secondHeaderContainer.setAttribute("style", "display:block");
};

/* function should also work with the "reset"/"start over" button on the final page */
function backtoFirstPage() {
    var firstPageContainer = document.getElementById("firstPage");
    firstPageContainer.setAttribute("style", "display:block");
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:none");
    var thirdPageContainer = document.getElementById("thirdPage");
    thirdPageContainer.setAttribute("style", "display:none");
    var mainHeaderContainer = document.getElementById("initialHeader");
    mainHeaderContainer.setAttribute("style", "display:block");
    var secondHeaderContainer = document.getElementById("finalHeader");
    secondHeaderContainer.setAttribute("style", "display:none");
};

/* function to add to "new recipe" button on the final page to keep firstPage info and re-enter secondPage info */
function backtoSecondPage() {
    var thirdPageContainer = document.getElementById("thirdPage");
    thirdPageContainer.setAttribute("style", "display:none");
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:block");
    var secondHeaderContainer = document.getElementById("finalHeader");
    secondHeaderContainer.setAttribute("style", "display:none");
    var mainHeaderContainer = document.getElementById("initialHeader");
    mainHeaderContainer.setAttribute("style", "display:block");
};

/* So, THIRD PAGE will require a button which is able to go through and quantify all of the information gathered
THEN sort all of that information into respective VARIABLES and ARRAYS (arrays for required questions, variables for optional ones)
THEN the information within the API GETs will have to update to reflect the information gathered from the User
ONLY THEN must the GETs actually run and then arrive at the randomly generated recipe
Prior to switching to FOURTH PAGE, the random recipe information must be broken down into the recipe name, ingredient list, full instructions, etc.
Some of those will be filling the HTML for the FOURTH PAGE so that it's able to reflect new information directly from the THIRD PAGE
And some of those will be sorted into new VARIABLES
THEN the new VARIABLES will have to be used to change the information within the YOUTUBE SEARCH API GETs
THEN !THOSE results will have to be broken down to video name, video creator, youtube embed, youtube link, etc.
Some of which will be further filling the HTML for the FOURTH PAGE so that it's able to load with everything ready to rock*/

/* If all goes according to plan, the FOURTH PAGE will contain a Full Recipe, with a Title, a list of Ingredients, an embed & link to the top Youtube Video, and two further buttons
Button #1 will be "NEW RECIPE" which will take them back to the THIRD PAGE, where all of their information will reload from localstorage if they choose to edit it
Button #2 will be "START OVER" which will take them back to the SECOND PAGE, where all fields will be reset to empty and the entirety of localstorage/console will be cleared
It would also be really advantageous if we can include a PRINT RECIPE button on the FOURTH PAGE with some kind of send-to-printer function
BEAR IN MIND the "GET Search Recipes Complex (Deprecated)" costs 3 returns per use, and the API will charge for >50 returns per day
BEAR IN MIND the "GET Youtube Search Results" costs 10 returns per use, and the API flat-caps at =100 returns per day (unless we can lower the results to 1 per search!)
ALL TO SAY: we might wind up having to set a FLAT CAP of 15 test-runs per-day, per-account */

/* something is causing a console ERROR here, in regards to the [i] functionality
            either I'm running the for loop too soon (quite possible) or I'm misunderstanding how to designate a function parameter and use it to gather info from the API results */
            /* for (i=0; i<= 4; i++) {
                console.log(recipeInfo);
                var recipeName = recipeInfo.results[i].title;
                var recipeURL = recipeInfo.results[i].sourceUrl;
                var recipeImage = recipeInfo.results[i].image;
                var recipeServings = recipeInfo.results[i].servings;
                var recipeCalories = recipeInfo.results[i].calories;
                var recipeCarbs = recipeInfo.results[i].carbs;
                var recipeFat = recipeInfo.results[i].fat;
                var recipeProtein = recipeInfo.results[i].protein;
                var recipeStats = [recipeName, recipeURL, recipeImage, recipeServings, recipeCalories, recipeCarbs, recipeFat, recipeProtein];
                console.log(recipeStats);
                localStorage.setItem(("Recipe Result Stats" + [i]), JSON.stringify(recipeStats));
    } */
    /* still not working even after removing from a for loop and removing all the [i] iterances from the recipeInfo function. very unsure as to what's going on here */
    /* console.log(recipeInfo, "here!");
    var recipeTitle = recipeInfo.title;
    var recipeURL = recipeInfo.sourceUrl;
    var recipeImage = recipeInfo.image;
    var recipeServings = recipeInfo.servings;
    var recipeInstructions = recipeInfo.analyzedInstructions[0].steps;
    var recipeCalories = recipeInfo.calories;
    var recipeCarbs = recipeInfo.carbs;
    var recipeFat = recipeInfo.fat;
    var recipeProtein = recipeInfo.protein;

    var recipeStats = [recipeTitle, recipeURL, recipeImage, recipeServings, recipeInstructions, recipeCalories, recipeCarbs, recipeFat, recipeProtein];
    console.log(recipeStats);
    localStorage.setItem(("Recipe Result Stats" + [i]), JSON.stringify(recipeStats)); */