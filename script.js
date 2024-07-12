document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const mealList = document.getElementById('meal');
    const mealDetailsContent = document.querySelector('.meal-details-content');
    const recipeCloseBtn = document.getElementById('recipe-close-btn');
  
    // Event listeners
    searchInput.addEventListener('input', debounce(getMealList, 300));
    searchBtn.addEventListener('click', getMealList);
    mealList.addEventListener('click', getMealRecipe);
    recipeCloseBtn.addEventListener('click', () => {
      mealDetailsContent.parentElement.classList.remove('showRecipe');
    });
  
    // Fetch meal list based on the ingredient
    async function getMealList() {
      const searchInputTxt = searchInput.value.trim();
      if (!searchInputTxt) {
        mealList.innerHTML = '';
        return;
      }
  
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
        const data = await response.json();
  
        let html = "";
        if (data.meals) {
          data.meals.forEach(meal => {
            html += `
              <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                  <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                  <h3>${meal.strMeal}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
              </div>
            `;
          });
          mealList.classList.remove('notFound');
        } else {
          html = "Sorry, we didn't find any meal!";
          mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
      } catch (error) {
        console.error('Error fetching meal list:', error);
        mealList.innerHTML = "An error occurred while fetching meals. Please try again later.";
        mealList.classList.add('notFound');
      }
    }
  
    // Fetch recipe details of the selected meal
    async function getMealRecipe(e) {
      e.preventDefault();
      if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.closest('.meal-item');
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
          const data = await response.json();
          displayMealRecipe(data.meals[0]);
        } catch (error) {
          console.error('Error fetching meal recipe:', error);
          mealDetailsContent.innerHTML = "An error occurred while fetching the recipe. Please try again later.";
        }
      }
    }
  
    // Display meal recipe in a modal
    function displayMealRecipe(meal) {
      const html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
      `;
      mealDetailsContent.innerHTML = html;
      mealDetailsContent.parentElement.classList.add('showRecipe');
    }
  
    // Debounce function to limit API calls
    function debounce(func, delay) {
      let debounceTimer;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      }
    }
  });
  