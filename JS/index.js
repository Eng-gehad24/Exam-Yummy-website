"use strict";
$("document").ready(function () {
  let sideBar = $("aside");
  let navBar = $("aside nav");
  let navBarWidth = navBar.outerWidth();
  let showHideMenu = $("#showHideMenu");
  let searchBtn = $("#search");
  let categoryBtn = $("#category");
  let areaBtn = $("#area");
  let ingredientsBtn = $("#ingredients");
  let contactBtn = $("#contact");
  let formRegex = {
    name: /^[a-zA-Z]+\s*[a-zA-Z]+$/,
    email: /^\w+@\w{2,10}\.\w+$/,
    phone: /^(\+2)?01[0125]\d{8}$/,
    age: /^[1-9][0-9]?$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  };
  let meals;
  let categories;
  let body = document.body;

  function loadingBuilder(element = body) {
    let loadingContainer = document.createElement("div");
    loadingContainer.className = "loader";

    let loadingInner = document.createElement("div");
    loadingInner.classList.add("sk-folding-cube");

    let loadingIcon1 = document.createElement("div");
    loadingIcon1.classList.add("sk-cube1", "sk-cube");

    let loadingIcon2 = document.createElement("div");
    loadingIcon2.classList.add("sk-cube2", "sk-cube");

    let loadingIcon3 = document.createElement("div");
    loadingIcon3.classList.add("sk-cube3", "sk-cube");

    let loadingIcon4 = document.createElement("div");
    loadingIcon4.classList.add("sk-cube4", "sk-cube");

    loadingInner.appendChild(loadingIcon1);
    loadingInner.appendChild(loadingIcon2);
    loadingInner.appendChild(loadingIcon3);
    loadingInner.appendChild(loadingIcon4);

    loadingContainer.appendChild(loadingInner);

    element.prepend(loadingContainer);

    $(".sk-folding-cube").fadeOut(1000, function () {
      $(".loader").fadeOut(500, function () {
        $("body").css({ overflow: "auto" });
        $(".loader").remove();
      });
    });
  }

  loadingBuilder();

  sideBar.css("left", `${-navBarWidth}px`);
  let linkMarginBlock = $("nav ul li").css("margin-block");

  showHideMenu.click(toggleSideBar);

  function toggleSideBar() {
    if (sideBar.css("left") == "0px") {
      sideBar.animate({ left: -navBarWidth }, 500);
      showHideMenu.removeClass("fa-xmark").addClass("fa-bars");
      $("nav > ul li").animate(
        { marginBlock: linkMarginBlock, opacity: 0 },
        700
      );
    } else {
      sideBar.animate({ left: 0 }, 500);
      showHideMenu.removeClass("fa-bars").addClass("fa-xmark");
      $("nav ul li").animate({ marginBlock: "0px", opacity: 1 }, 700);
    }
  }

  async function getMealsData(file, query, userInput, loadingcontainer) {
    let initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    let initialData = await initialResponse.json();
    if (initialData.meals !== null) {
      displayMealData(initialData.meals);
    }
    return initialData;
  }

  getMealsData("search.php", "s", "");

  let container = document.getElementById("container");
  let row = document.createElement("div");
  row.classList.add("row", "gy-4");

  function displayMealData(mealsData) {
    for (let i = 0; i < mealsData.length; i++) {
      let mealName = document.createElement("h3");
      let mealNameText = document.createTextNode(mealsData[i].strMeal);
      mealName.appendChild(mealNameText);
      mealName.className = "meal-name";

      let mealInfo = document.createElement("div");
      mealInfo.className = "meal-info";

      mealInfo.appendChild(mealName);

      let mealImage = document.createElement("img");
      mealImage.setAttribute("src", `${mealsData[i].strMealThumb}`);
      mealImage.setAttribute("alt", `${mealsData[i].strMeal} Image`);
      mealImage.classList.add("w-100");

      let mealItem = document.createElement("div");
      mealItem.className = "meal";
      mealItem.setAttribute("data-meal-name", mealsData[i].strMeal);
      mealItem.appendChild(mealImage);
      mealItem.appendChild(mealInfo);

      let mealContainer = document.createElement("div");
      mealContainer.classList.add("col-lg-3", "col-md-6");
      mealContainer.appendChild(mealItem);

      row.appendChild(mealContainer);
    }
    container.appendChild(row);

    if (row.previousElementSibling) {
      if (row.previousElementSibling.classList.contains("search")) {
        loadingBuilder(row);
      }
    }

    meals = $(".meal");
    meals.click(showMealInfo);
  }

  function displayCategories(Categories) {
    for (let i = 0; i < Categories.length; i++) {
      let categoryName = document.createElement("h3");
      let categoryNameText = document.createTextNode(
        Categories[i].strCategory
      );
      categoryName.appendChild(categoryNameText);
      categoryName.className = "category-name";

      let categoryDescription = document.createElement("p");
      let categoryDescriptionText = document.createTextNode(
        Categories[i].strCategoryDescription.split(" ").splice(0, 15).join(" ")
      );
      categoryDescription.appendChild(categoryDescriptionText);
      categoryDescription.className = "category-description";

      let categoryInfo = document.createElement("div");
      categoryInfo.className = "category-info";

      categoryInfo.appendChild(categoryName);
      categoryInfo.appendChild(categoryDescription);

      let categoryImage = document.createElement("img");
      categoryImage.setAttribute("src", `${Categories[i].strCategoryThumb}`);
      categoryImage.setAttribute("alt", `${Categories[i].strCategory} Image`);
      categoryImage.classList.add("w-100");

      let categoryItem = document.createElement("div");
      categoryItem.className = "category";
      categoryItem.setAttribute("data-category-name", categoryName.textContent);
      categoryItem.appendChild(categoryImage);
      categoryItem.appendChild(categoryInfo);

      let categoryContainer = document.createElement("div");
      categoryContainer.classList.add("col-lg-3", "col-md-6");
      categoryContainer.appendChild(categoryItem);

      row.appendChild(categoryContainer);
    }
    container.appendChild(row);
    categories = $(".category");
    categories.click(async function (e) {
      let categoryQuery = $(e.currentTarget).data("categoryName");
      row.innerHTML = "";
      let categoryMeals = await getMealsData(
        "filter.php",
        "c",
        categoryQuery,
        body
      );
    });
  }

  async function getMealDetails(file, query, userInput) {
    let initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    loadingBuilder(body);
    let initialData = await initialResponse.json();
    return initialData;
  }

  async function showMealInfo(e) {
    let currentMeal = $(e.currentTarget).data("meal-name");
    let mealDetails = await getMealDetails("search.php", "s", currentMeal);
    container.innerHTML = "";
    row.innerHTML = "";

    let mealImage = document.createElement("img");
    mealImage.src = mealDetails.meals[0].strMealThumb;
    mealImage.alt = `${mealDetails.meals[0].strMeal} Image`;
    mealImage.className = "w-100";

    let mealName = document.createElement("h3");
    mealName.textContent = mealDetails.meals[0].strMeal;
    mealName.className = "meal-name";

    let mealBrief = document.createElement("div");
    mealBrief.classList.add("col-lg-4", "meal-brief");
    mealBrief.appendChild(mealImage);
    mealBrief.appendChild(mealName);

    let instructionHeading = document.createElement("h3");
    instructionHeading.textContent = "Instructions";

    let instructionParagraph = document.createElement("p");
    instructionParagraph.textContent = mealDetails.meals[0].strInstructions;

    let area = document.createElement("div");
    area.className = "area";

    let areaHeading = document.createElement("h4");
    areaHeading.textContent = "Area:";

    let areaIcon = document.createElement("i");
    areaIcon.classList.add("fa-solid", "fa-location-dot", "fa-fw", "me-2");

    areaHeading.prepend(areaIcon);

    let areaSpan = document.createElement("span");
    areaSpan.textContent = mealDetails.meals[0].strArea;

    area.appendChild(areaHeading);
    area.appendChild(areaSpan);

    let category = document.createElement("div");
    category.className = "category";

    let categoryHeading = document.createElement("h4");
    categoryHeading.textContent = "Category:";

    let categoryIcon = document.createElement("i");
    categoryIcon.classList.add("fa-solid", "fa-tag", "fa-fw", "me-2");

    categoryHeading.prepend(categoryIcon);

    let categorySpan = document.createElement("span");
    categorySpan.textContent = mealDetails.meals[0].strCategory;

    category.appendChild(categoryHeading);
    category.appendChild(categorySpan);

    let recipes = document.createElement("div");
    recipes.className = "recipes";

    let recipesHeading = document.createElement("h4");
    recipesHeading.textContent = "Recipes:";

    let recipesIcon = document.createElement("i");
    recipesIcon.classList.add("fa-solid", "fa-utensils", "fa-fw", "me-2");

    recipesHeading.prepend(recipesIcon);
    recipes.appendChild(recipesHeading);

    let mealDetailsMap = new Map(Object.entries(mealDetails.meals[0]));

    for (let i = 1; i <= mealDetailsMap.size; i++) {
      let currentMeasure = mealDetailsMap.get(`strMeasure${i}`);
      if (
        currentMeasure !== null &&
        currentMeasure !== "" &&
        currentMeasure !== undefined &&
        currentMeasure !== " "
      ) {
        let recipesSpan = document.createElement("span");
        recipesSpan.textContent = `${currentMeasure} ${mealDetailsMap.get(
          `strIngredient${i}`
        )}`;
        recipes.appendChild(recipesSpan);
      }
    }

    let availableTags = mealDetailsMap.get("strTags");
    let tags;
    if (
      availableTags !== null &&
      availableTags !== "" &&
      availableTags !== " " &&
      availableTags !== undefined
    ) {
      tags = document.createElement("div");
      tags.className = "tags";

      let tagsHeading = document.createElement("h4");
      tagsHeading.textContent = "Tags:";

      let tagsIcon = document.createElement("i");
      tagsIcon.classList.add("fa-solid", "fa-hashtag", "fa-fw", "me-2");

      tagsHeading.prepend(tagsIcon);
      tags.appendChild(tagsHeading);

      let tagsArr = availableTags.split(",");
      for (let tag of tagsArr) {
        let tagSpan = document.createElement("span");
        tagSpan.textContent = tag;
        tags.appendChild(tagSpan);
      }
    }

    let sourceBtn = document.createElement("button");
    sourceBtn.classList.add("btn", "btn-source");

    let sourceIcon = document.createElement("i");
    sourceIcon.classList.add("fa-solid", "fa-circle-info", "me-2");

    let sourceLink = document.createElement("a");
    sourceLink.textContent = "Source";
    sourceLink.href = mealDetails.meals[0].strSource;

    sourceBtn.appendChild(sourceIcon);
    sourceBtn.appendChild(sourceLink);

    let youtubeBtn = document.createElement("button");
    youtubeBtn.classList.add("btn", "btn-youtube");

    let youtubeIcon = document.createElement("i");
    youtubeIcon.classList.add("fa-brands", "fa-youtube", "me-2");

    let youtubeLink = document.createElement("a");
    youtubeLink.textContent = "Youtube";
    youtubeLink.href = mealDetails.meals[0].strYoutube;

    youtubeBtn.appendChild(youtubeIcon);
    youtubeBtn.appendChild(youtubeLink);

    let sources = document.createElement("div");
    sources.className = "sources";

    sources.appendChild(sourceBtn);
    sources.appendChild(youtubeBtn);

    let mealDetailsContainer = document.createElement("div");
    mealDetailsContainer.classList.add("meal-details", "col-lg-8");
    mealDetailsContainer.appendChild(instructionHeading);
    mealDetailsContainer.appendChild(instructionParagraph);
    mealDetailsContainer.appendChild(area);
    mealDetailsContainer.appendChild(category);
    mealDetailsContainer.appendChild(recipes);
    if (tags !== undefined) {
      mealDetailsContainer.appendChild(tags);
    }
    mealDetailsContainer.appendChild(sources);

    row.appendChild(mealBrief);
    row.appendChild(mealDetailsContainer);
    container.appendChild(row);
  }

  searchBtn.click(function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    let searchByNameInput = document.createElement("input");
    searchByNameInput.setAttribute("placeholder", "Search By Name");
    searchByNameInput.classList.add("form-control", "search-by-name");

    let searchByFirstLetter = document.createElement("input");
    searchByFirstLetter.setAttribute("placeholder", "Search By First Letter");
    searchByFirstLetter.classList.add("form-control", "search-by-first-letter");
    searchByFirstLetter.setAttribute("maxlength", "1");

    let rowSearch = document.createElement("div");
    rowSearch.classList.add("row", "gy-4", "search");
    rowSearch.appendChild(searchByNameInput);
    rowSearch.appendChild(searchByFirstLetter);

    container.prepend(rowSearch);

    searchByNameInput.addEventListener("keyup", function () {
      row.innerHTML = "";
      getMealsData("search.php", "s", `${searchByNameInput.value}`);
    });

    searchByFirstLetter.addEventListener("keyup", function () {
      row.innerHTML = "";
      getMealsData(
        "search.php",
        "f",
        `${searchByFirstLetter.value.split("")[0]}`
      );
    });

    searchByNameInput.addEventListener("blur", function () {
      searchByNameInput.value = "";
    });

    searchByFirstLetter.addEventListener("blur", function () {
      searchByFirstLetter.value = "";
    });
  });

  async function getCategories(file) {
    let initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}`
    );
    loadingBuilder();
    let initialData = await initialResponse.json();
    return initialData;
  }

  categoryBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    let allCategories = await getCategories("categories.php");
    displayCategories(allCategories.categories);
    container.appendChild(row);
  });

  async function getArea(file, query, userInput) {
    let initialResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${file}?${query}=${userInput}`
    );
    loadingBuilder();
    let initialData = await initialResponse.json();
    return initialData;
  }

  function areaBuilder(areas) {
    for (let area of areas) {
      let areaIcon = document.createElement("i");
      areaIcon.classList.add("fa-solid", "fa-house", "area-icon");

      let areaName = document.createElement("h3");
      areaName.setAttribute("class", "area-name");
      areaName.textContent = area.strArea;

      let areaContainer = document.createElement("div");
      areaContainer.classList.add("area-container", "col-lg-3", "col-md-6");
      areaContainer.setAttribute("data-area", areaName.textContent);
      areaContainer.appendChild(areaIcon);
      areaContainer.appendChild(areaName);
      areaContainer.addEventListener("click", showAreaMeals);

      row.appendChild(areaContainer);
    }
  }

  areaBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    let allAreas = await getArea("list.php", "a", "list");
    areaBuilder(allAreas.meals);
    container.appendChild(row);
  });

  async function showAreaMeals(e) {
    container.innerHTML = "";
    row.innerHTML = "";
    let area = e.currentTarget.dataset.area;
    let mealsOfArea = await getArea("filter.php", "a", area);
    displayMealData(mealsOfArea.meals);
    container.appendChild(row);
  }


  function ingredientsBuilder(ingredients) {
    for (let i = 0; i < 20; i++) {
      let ingredientIcon = document.createElement("i");
      ingredientIcon.classList.add(
        "fa-solid",
         "fa-drumstick-bite",
        "ingredient-icon"
      );

      let ingredientName = document.createElement("h3");
      ingredientName.setAttribute("class", "ingredient-name");
      ingredientName.textContent = ingredients[i].strIngredient;

      let ingredientDescription = document.createElement("p");
      ingredientDescription.classList.add(
        "ingredient-description",
        "text-center"
      );
      ingredientDescription.textContent = ingredients[i].strDescription
        .split(" ")
        .splice(0, 12)
        .join(" ");

      let ingredientContainer = document.createElement("div");
      ingredientContainer.classList.add(
        "ingredient-container",
        "col-lg-3",
        "col-md-6"
      );
      ingredientContainer.setAttribute(
        "data-ingredient",
        ingredientName.textContent
      );
      ingredientContainer.appendChild(ingredientIcon);
      ingredientContainer.appendChild(ingredientName);
      ingredientContainer.appendChild(ingredientDescription);
      ingredientContainer.addEventListener("click", showIngradientMeals);

      row.appendChild(ingredientContainer);
    }
  }

  ingredientsBtn.click(async function () {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";
    let allIngredients = await getArea("list.php", "i", "list");
    ingredientsBuilder(allIngredients.meals);
    container.appendChild(row);
  });

  async function showIngradientMeals(e) {
    container.innerHTML = "";
    row.innerHTML = "";
    let ingredient = e.currentTarget.dataset.ingredient;
    let mealsOfIngredient = await getArea("filter.php", "i", ingredient);
    displayMealData(mealsOfIngredient.meals);
    container.appendChild(row);
  }

  contactBtn.click((e) => {
    toggleSideBar();
    container.innerHTML = "";
    row.innerHTML = "";

    let contactUsHeading = document.createElement("h2");
    contactUsHeading.textContent = "Contact Us";

    let formContainer = document.createElement("div");
    formContainer.className = "form";

    let nameContainer = document.createElement("div");
    nameContainer.className = "name";

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "Enter Your Name");
    nameInput.setAttribute("id", "name");
    nameInput.setAttribute("class", "form-control");

    let nameLabel = document.createElement("label");
    nameLabel.textContent = "Your Name";
    nameLabel.setAttribute("for", "name");

    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInput);

    let emailContainer = document.createElement("div");
    emailContainer.className = "email";

    let emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Enter your Email");
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("class", "form-control");

    let emailLabel = document.createElement("label");
    emailLabel.textContent = "Your Email";
    emailLabel.setAttribute("for", "email");

    emailContainer.appendChild(emailLabel);
    emailContainer.appendChild(emailInput);

    let phoneContainer = document.createElement("div");
    phoneContainer.className = "phone";

    let phoneInput = document.createElement("input");
    phoneInput.setAttribute("type", "text");
    phoneInput.setAttribute("placeholder", "Enter Your Phone");
    phoneInput.setAttribute("id", "phone");
    phoneInput.setAttribute("class", "form-control");

    let phoneLabel = document.createElement("label");
    phoneLabel.textContent = "Your Phone";
    phoneLabel.setAttribute("for", "phone");

    phoneContainer.appendChild(phoneLabel);
    phoneContainer.appendChild(phoneInput);

    let ageContainer = document.createElement("div");
    ageContainer.className = "age";

    let ageInput = document.createElement("input");
    ageInput.setAttribute("type", "number");
    ageInput.setAttribute("placeholder", "Enter Your Age");
    ageInput.setAttribute("id", "age");
    ageInput.setAttribute("class", "form-control");

    let ageLabel = document.createElement("label");
    ageLabel.textContent = "Your Age";
    ageLabel.setAttribute("for", "age");

    ageContainer.appendChild(ageLabel);
    ageContainer.appendChild(ageInput);

  
    let passwordContainer = document.createElement("div");
    passwordContainer.className = "password";

    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Enter Your Password");
    passwordInput.setAttribute("id", "password");
    passwordInput.setAttribute("class", "form-control");

    let passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password";
    passwordLabel.setAttribute("for", "password");
    
 

    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordInput);

    let confirmContainer = document.createElement("div");
    confirmContainer.className = "confirm";

    let confirmInput = document.createElement("input");
    confirmInput.setAttribute("type", "password");
    confirmInput.setAttribute("id", "confirm");
    confirmInput.setAttribute("class", "form-control");

    let confirmLabel = document.createElement("label");
    confirmLabel.textContent = "Confirm Password";
    confirmLabel.setAttribute("for", "confirm");

    confirmContainer.appendChild(confirmLabel);
    confirmContainer.appendChild(confirmInput);

    let submitBtn = document.createElement("button");
    submitBtn.classList.add("btn", "btn-source", "rounded-pill");
    submitBtn.setAttribute("disabled", "true");
    submitBtn.textContent = "Submit";

    formContainer.appendChild(contactUsHeading);
    formContainer.appendChild(nameContainer);
    formContainer.appendChild(emailContainer);
    formContainer.appendChild(phoneContainer);
    formContainer.appendChild(ageContainer);
    formContainer.appendChild(passwordContainer);
    formContainer.appendChild(confirmContainer);
    formContainer.appendChild(submitBtn);

    row.appendChild(contactUsHeading);
    row.appendChild(formContainer);

    container.appendChild(row);

    let inputs = document.querySelectorAll(".form input");

    for (let input of inputs) {
      input.addEventListener("keyup", function () {
        if (input.id !== "confirm") {
          validateInput(this, formRegex[`${this.id}`]);
        } else {
          isConfirm(passwordInput, confirmInput);
        }
        let validInputs = document.querySelectorAll(".is-valid");
        if (validInputs.length == 6) {
          submitBtn.removeAttribute("disabled");
        } else {
          submitBtn.setAttribute("disabled", "true");
        }
      });
    }
  });

  function validateInput(input, regex) {
    let value = input.value;
    if (regex.test(value)) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  }

  function isConfirm(passInput, confirmInput) {
    if (confirmInput.value == passInput.value) {
      confirmInput.classList.add("is-valid");
      confirmInput.classList.remove("is-invalid");
    } else {
      confirmInput.classList.add("is-invalid");
      confirmInput.classList.remove("is-valid");
    }
  }
});
