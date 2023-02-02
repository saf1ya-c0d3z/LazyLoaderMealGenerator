/* creates a later-populated universal variable for the recipes */
var recipes = JSON.parse(localStorage.getItem("Recipe History")) || [];

/* moves from the Home/Landing page to the first form, attempts(seemingly unsuccessfully) to do a reset on the value of "recipes" variable so that it can repopulate correctly */
$(".HomeSubmitBtn").click(function () {
    localStorage.clear();

    gotoFirstPage();
});

/* moves from the first form to the second form, saving all of the User information entered on the first form to localStorage for later use */
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

/* clears all User values from the first form and returns user to the home/landing page */
$(".CancelBtn").click(function () {
    $(this).closest('.container').find('#UserName').find('textarea').val("");
    $(this).closest('.container').find('#UserAge').find('textarea').val("");
    $(this).closest('.container').find('#UserHeight').find('textarea').val("");
    $(this).closest('.container').find('#UserCurrentWeight').find('textarea').val("");
    $(this).closest('.container').find('#UserIdealWeight').find('textarea').val("");

    backtoHomePage();
});

/* moves from the second form to the third form, does both API calls and uses the results of those calls to populate the final page with all of the necessary information */
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
    /* recipeSelector(); */
    gotoThirdPage();
});

/* clears all User values from the second form, empties all localStorage items, and returns user to the first form page to re-enter their values */
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

/* final page button to send user back to the meal selection form and clear enough of the local storage so that they can generate a brand new recipe on the final page */
$('.newRecipeBtn').click(function () {
    localStorage.removeItem("Ingredient List");
    localStorage.removeItem("Restriction List");
    localStorage.removeItem("Nutritional Content For Meal");
    localStorage.removeItem("API Nutrition Inputs");
    localStorage.removeItem("Nutrition Differences");
    localStorage.removeItem("Final Recipe");
    localStorage.removeItem("YouTube Link");

    backtoSecondPage();
});

/* final page button to send user all the way back to the landing page so they can re-do all of their information, in theory works best if there's a new person using the same computer to then see their own results */
$('.startOverBtn').click(function () {
    localStorage.clear();

    backtoHomePage();
});

/* uses the User's gender, current weight and ideal weight to set a daily goal range between minimum and maximum calorie intake */
function setCalorieMax() {
    /* ratio of current weight divided by ideal weight = multiplier for calorie deficit*/
    var userInfo = [];
    var userInfo = JSON.parse(localStorage.getItem("User Info"));
    var yourWeight = userInfo[3];
    var idealWeight = userInfo[4];
    var yourGender = "";
    yourGender = userInfo[5];
    console.log(yourGender);
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

    if (yourGender == "man") {
        genderMultiplier = 15;
    } else if (yourGender == "woman") {
        genderMultiplier = 10;
    } else if (yourGender == "nonbinary") {
        genderMultiplier = 12.5;
    } else if (yourGender == "transman") {
        genderMultiplier = 14;
    } else if (yourGender == "transwoman") {
        genderMultiplier = 11;
    };
    
    console.log(yourGender);

    /* sets a maximum calorie intake for the day for a normal weight loss rate */
    var calorieMax = Math.round(idealWeight * genderMultiplier);
    console.log("Max ideal intake for a " + yourGender + " who weighs " + yourWeight + " pounds is " + calorieMax + " calories per day!")

    /* sets a minimum calorie intake for the day for an accelerated weight loss rate */
    var calorieMin = Math.round(calorieMax * calorieMultiplier);
    console.log("For increased efficiency in reaching " + idealWeight + " pounds, you should set a goal of " + calorieMin + " calories per day!")

    var newInfo = [calorieMin, calorieMax]
    console.log("Thus, your ideal calorie range is " + calorieMin + " - " + calorieMax + " calories per day!")

    var moreInfo = userInfo.concat(newInfo);
    localStorage.setItem("Extended User Info", JSON.stringify(moreInfo));
};

/* uses the User's goal range of calories and their choice of meal to determine a new range for that meal in particular, with snacks, drinks and desserts being smaller than dinner */
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

    var minMealCalories = Math.round(minCalories * mealMultiplier);
    var maxMealCalories = Math.round(maxCalories * mealMultiplier);
    var mealCalories = [minMealCalories, maxMealCalories];
    console.log("Based on your choice, your ideal calorie range for this meal is " + minMealCalories + " - " + maxMealCalories + " calories!")
    
    /* adds only to new array for singular variables that are relevant to the next bit of code */
    var mealInfo = JSON.parse(localStorage.getItem("User Meal Info"));
    var moreInfo = mealInfo.concat(mealCalories);
    localStorage.setItem("User Meal Info", JSON.stringify(moreInfo));
};

/* any user submission which is not formatted in a way which the API call can use in the search link is reformatted so that they will now work in link format */
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

/* uses the User's goal ranger of calories for the current meal to set minimum and maximum values for all the major nutritional metrics (carbs, protein, fat) depending on their choice of nutritional restrictions such as low-fat or ketogenic */
function setMealParameters() {
    var nutritionInfo = [];
    var nutritionInfo = JSON.parse(localStorage.getItem("Nutrition List"));
    /* added minMultipliers so that min # defaults to 0 */
    var minfatMultiplier = 0.00;
    var maxfatMultiplier = 0.0389;
    /* make sure to go back through and remove all the SODIUM mentions, that is a request-breaking parameter and is not included in nearly any of the possible API results anyhow */
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

    var minProtein = Math.round(minCalories * minproteinMultiplier);
    var maxProtein = Math.round(maxCalories * maxproteinMultiplier);
    var minFat = Math.round(minCalories * minfatMultiplier);
    var maxFat = Math.round(maxCalories * maxfatMultiplier);
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

    var nutritionGrams = [minProtein, maxProtein, minFat, maxFat, realminCarbs, realmaxCarbs, minSugar, maxSugar];
    localStorage.setItem("Nutritional Content For Meal", JSON.stringify(nutritionGrams));
};

/* calls the nutrition API to enter all possible user variables and give back up to 5 matching recipes, API link itself is set by a long if/else so that only the parameters actually filled by the User are included in the search link */
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

    /* instructions */
    /* makes nutritionAPIcall link variable that removes parameters that are not included in User selections so that no empty selection prevents successful return of results */
    if (userDiet == "nodiet") {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if (userRestrictions == "") {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if (userIngredients == "") {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if (userCuisine == "") {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userRestrictions == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userIngredients == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userRestrictions == "") && (userIngredients == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userRestrictions == "") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userIngredients == "") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userDiet == "nodiet") && (userRestrictions = "") && (userIngredients == "") && (userCuisine = "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userRestrictions == "") && (userIngredients)) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userRestrictions == "") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userIngredients == "") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else if ((userRestrictions == "") && (userIngredients == "") && (userCuisine == "")) {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    } else {
        var nutritionAPIcall = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?limitLicense=false&offset=0&number=5&intolerances=${userRestrictions}&maxSugar=${maxSugar}&diet=${userDiet}&ranking=1&minFat=${minFat}&addRecipeInformation=true&minSodium=0&minCalories=${minCalories}&minProtein=${minProtein}&maxProtein=${maxProtein}&minCarbs=${minCarbs}&cuisine=${userCuisine}&includeIngredients=${userIngredients}&maxCalories=${maxCalories}&minSugar=${minSugar}&type=${userMeal}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`
    };

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '297a433770msh51ab7b6b5fc5ad2p1043b5jsnc5affd639b98',
		    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    fetch(nutritionAPIcall, options).then(response => { 
        console.log(response)
        return response.json()
    }).then(json => {
        console.log(json.results)
        var recipeInfo = json.results
        localStorage.removeItem("Recipe History");
        recipes = [];
        for (i=0; i < recipeInfo.length; i++) {
            var recipeName = recipeInfo[i].title;
            var recipeURL = recipeInfo[i].sourceUrl;
            var recipeImage = recipeInfo[i].image;
            var recipeServings = recipeInfo[i].servings;
            var recipeCalories = recipeInfo[i].calories;
            var recipeCarbs = recipeInfo[i].carbs;
            var recipeFat = recipeInfo[i].fat;
            var recipeProtein = recipeInfo[i].protein;

            var recipeStats = {recipeName, recipeURL, recipeImage, recipeServings, recipeCalories, recipeCarbs, recipeFat, recipeProtein};
            recipes.push(recipeStats)
            console.log(recipeStats);
            localStorage.setItem(("Recipe Result Stats " + recipeName), JSON.stringify(recipeStats));
            localStorage.setItem("Recipe History", JSON.stringify(recipes))         
    };
        recipeSelector();
        gotoThirdPage();
    }).catch(err => console.error(err));
};

/* sets function to go through recipe results and find the best match */
function recipeSelector() {
    console.log(recipes);
    var nutritionDifferences = [];
    localStorage.setItem("Nutritional Differences", JSON.stringify(nutritionDifferences));

    var mappedRecipes = [];
    /* sorting results for the best-fit recipe */
    for (i=0; i < recipes.length; i++) {
        var nutritionArray = JSON.parse(localStorage.getItem("Nutritional Content For Meal"))
        var calorieArray = JSON.parse(localStorage.getItem("User Meal Info"))
        console.log(recipes[i].recipeName)
        var proteinValue = parseInt(recipes[i].recipeProtein.trim('g'))
        var proteinIdeal = nutritionArray[1];
        var fatValue = parseInt(recipes[i].recipeFat.trim('g'))
        var fatIdeal = nutritionArray[3]
        var carbValue = parseInt(recipes[i].recipeCarbs.trim('g'))
        var carbIdeal = nutritionArray[5]
        var calorieValue = parseInt(recipes[i].recipeCalories)
        var calorieIdeal = calorieArray[4]

        var calorieDiff = Math.abs(calorieIdeal - calorieValue)
        console.log(calorieDiff, "calorie difference")
        var carbDiff = Math.abs(carbIdeal - carbValue)
        console.log(carbDiff, "carb difference")
        var fatDiff = Math.abs(fatIdeal - fatValue)
        console.log(fatDiff, "fat difference")
        var proteinDiff = Math.abs(proteinIdeal - proteinValue)
        console.log(proteinDiff, "protein difference")
        var totalDiff = (calorieDiff + carbDiff + fatDiff + proteinDiff)
        console.log(totalDiff, "total difference")

        var diffArray = JSON.parse(localStorage.getItem("Nutritional Differences"));
        var newDiff = diffArray.concat(totalDiff);
        localStorage.setItem("Nutritional Differences", JSON.stringify(newDiff));
        var recipeObj = {index: i, totalDiff}
        mappedRecipes.push(recipeObj)
    };

    var nutritiondiffRanked = JSON.parse(localStorage.getItem("Nutritional Differences"));
    nutritiondiffRanked.sort(function(a, b){
        return a - b
    });

    var lowestDiff = nutritiondiffRanked[0];
    var matchedRecipe = mappedRecipes.find(function(recipe) {
        return recipe.totalDiff === lowestDiff
    });

    console.log(recipes[matchedRecipe.index]);
    localStorage.setItem("Final Recipe", JSON.stringify(recipes[matchedRecipe.index]));
    getYouTubeRecipe(recipes[matchedRecipe.index].recipeName);
};

/* uses the best match from the recipeSelector to youtube Search for the top video result of someone preparing something of the same name (not perfect, but helpful) */
function getYouTubeRecipe(recipeName) {
    console.log(recipeName, "for youtube!")
    var youtubeLink = [];

    fetch(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search.json?engine=youtube&search_query=${recipeName.replace(/\s/g, "+")}&api_key=47f91d20e86214759ff5a104adce7c6094367e1ecec383cda41859f34cdddea9`)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data.video_results[0].link);
        localStorage.setItem("YouTube Link", JSON.stringify(data.video_results[0].link));
        var finalRecipe = JSON.parse(localStorage.getItem("Final Recipe"));
        var youtubeLink = JSON.parse(localStorage.getItem("YouTube Link"));
        populateFinalPage(youtubeLink, finalRecipe)
    });
};

/* uses the final results of the recipeSelector and getYouTubeRecipe functions to populate the final page with all of the variable information returned by both APIs */
function populateFinalPage(youtubeLink, finalRecipe) {
    var exam = youtubeLink;
    var finalyoutubeLink = [];
    console.log(youtubeLink, "testing");
    finalyoutubeLink = exam.replace("watch?v=", "embed/");
    console.log(finalyoutubeLink, "youtube link for embed!");

    var finalRecipeInfo = [];
    finalRecipeInfo = finalRecipe;
    console.log(finalRecipeInfo, "recipe info for appending!");

    var finalrecipeName = finalRecipeInfo.recipeName
    var finalrecipeURL = finalRecipeInfo.recipeURL
    var finalrecipeIMG = finalRecipeInfo.recipeImage
    var finalrecipeServings = finalRecipeInfo.recipeServings
    var finalrecipeCalories = finalRecipeInfo.recipeCalories
    var finalrecipeCarbs = finalRecipeInfo.recipeCarbs
    var finalrecipeFat = finalRecipeInfo.recipeFat
    var finalrecipeProtein = finalRecipeInfo.recipeProtein

    document.getElementById('recipeimg').innerHTML = `<img src=${finalrecipeIMG} alt="Image of the recipe!">`

    document.getElementById('recipename').innerHTML = `${finalrecipeName}`

    document.getElementById('recipelink').innerHTML = `<a href="${finalrecipeURL}">${finalrecipeURL}</a>`

    document.getElementById('recipeinfo').innerHTML = `This recipe for ${finalrecipeName} fits closely to your chosen preferences with a total calorie count of ${finalrecipeCalories}, carbohydrate content of ${finalrecipeCarbs}, fat content of ${finalrecipeFat}, and protein content of ${finalrecipeProtein}, as well as being within the diet you specified!`

    document.getElementById('recipeservings').innerHTML = `This recipe makes ${finalrecipeServings} servings.`

    document.getElementById('youtubevideo').innerHTML = `<iframe title='YouTube video player' type=\'text/html\' width='1080' height='760' src=${finalyoutubeLink} frameborder='0' allowFullScreen></iframe>`

    /* gotoThirdPage(); */
};

/* function to add when clicking the "start" or "get started" button on the landing page to go to firstPage */
function gotoFirstPage() {
    var landingPageContainer = document.querySelector(".landingPage");
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

/* function to return user to the first form to re-enter their information */
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

/* function to add to "start over" button on the final page to clear all info and return to the HomePage */
function backtoHomePage() {
    var thirdPageContainer = document.getElementById("thirdPage");
    thirdPageContainer.setAttribute("style", "display:none");
    var secondPageContainer = document.getElementById("secondPage");
    secondPageContainer.setAttribute("style", "display:none");
    var firstPageContainer = document.getElementById("firstPage");
    firstPageContainer.setAttribute("style", "display:none");
    var landingPageContainer = document.querySelector(".landingPage");
    landingPageContainer.setAttribute("style", "display:block");
    var landingHeaderContainer = document.getElementById("landingHeader");
    landingHeaderContainer.setAttribute("style", "display:block");
    var mainHeaderContainer = document.getElementById("initialHeader");
    mainHeaderContainer.setAttribute("style", "display:none")
    var secondHeaderContainer = document.getElementById("finalHeader");
    secondHeaderContainer.setAttribute("style", "display:none !important");
};