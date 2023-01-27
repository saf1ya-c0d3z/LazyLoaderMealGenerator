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
    var yourNutrition = $(this).closest('.container').find('#UserNutrition').find('textarea').val();
    console.log(yourName + " wants a meal that adheres to the following nutritional requirements: " + yourNutrition + ".");
    var newInfo = [yourMeal, yourCuisine, yourIngredients, yourDiet, yourAllergies, yourNutrition];
    var moreInfo = userInfo.concat(newInfo);
    localStorage.setItem("Full User Info", JSON.stringify(moreInfo));

    setMealMax();
    gotoThirdPage();
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

function gotoSecondPage() {
    var firstPageContainer = document.getElementById("firstPage");
    firstPageContainer.setAttribute("style", "display:none");
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:block");
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
    } else if (yourMeal = "main course") {
        mealMultiplier = 0.25;
    } else if (yourmeal = "appetizer") {
        mealMultiplier = 0.05;
    } else if (yourMeal = "side dish") {
        mealMultiplier = 0.10;
    } else if (yourMeal = "dessert") {
        mealMultiplier = 0.10;
    } else if (yourMeal = "drink") {
        mealMultiplier = 0.05;
    };

    var minMealCalories = minCalories * mealMultiplier;
    var maxMealCalories = maxCalories * mealMultiplier;
    var mealCalories = [minMealCalories, maxMealCalories];
    console.log("Based on your choice, your ideal calorie range for this meal is " + minMealCalories + " - " + maxMealCalories + " calories!")
    var moreInfo = userInfo.concat(mealCalories);
    localStorage.setItem("Fuller User Info", JSON.stringify(moreInfo));
};

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

/* Options on THIRD PAGE will include:
Which meal of the day is this? (breakfast, main course, etc.)
Do you want a certain kind of food? (american, indian, asian, etc.)
Do you have ingredients on hand you'd like to use? (onions, lettuce, beef, etc.)
Do you abide by a specific diet? (vegetarian, vegan, pescatarian, etc.)
Do you have any allergies or dietary restrictions? (tree nuts, shellfish, gluten, etc.)
Do you have any preferences about nutritional content? (low-fat, no trans-fats, low-sodium, high-protein, etc.) */

/* if "breakfast", total daily calories x .20 for max meal calories
if "main course", total daily calories x .25 for max meal calories
if "dessert", total daily calories x .10 for max meal calories
if "side dish", total daily calories x .10 for max meal calories
if "appetizer", total daily calories x .05 for max meal calories
if "drink", total daily calories x .05 for max meal calories*/

/* using the Recipe-Food-Nutrition API:
We're going to use "GET Search Recipes Complex (Deprecated)" to return a random result
By affixing the NUMBER parameter to "1", there will only be one resulting recipe, thus functionally RANDOM (separate from the GET Random Recipe)
By affixing the "INSTRUCTIONS REQUIRED" parameter to "TRUE", the random results will always have the maximum amount of information on the final page
Choice of whether "breakfast", "main course", "dessert", etc. will enter result into the "TYPE" parameter
Same choice as above will set per-meal calorie range (calorieMin X calorieMeal - calorieMax X calorieMeal)
Once per-meal calorie range is determined, final calorieMin and calorieMax will enter into the "minCalories" and "maxCalories" parameters, respectively
Choice of certain kind of food will enter into the "CUISINE" paramater
Choice of ingredients on hand will enter into the "INGREDIENTSINCLUDED" parameter
Choice of specific diet will enter into the "DIET" parameter
Listed allergies and dietary restrictions will enter into the "INTOLERANCES" parameter 
Listed preferences for nutritional content will use calorieMeal to determine acceptable nutritional range per measurement
Acceptable nutritional ranges will be entered into their respective parameters (low-fat #, as determined above, will set "maxFat" parameter, etc.)*/

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