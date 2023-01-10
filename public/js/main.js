const recipes = document.querySelector('.s-recipes');

document.addEventListener('DOMContentLoaded', function() { // wait for DOM content to load
  // Nav Menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // Add Recipe Form Button
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

// Preloader Effect
const preloader = document.getElementById('preloader');
// After window is loaded
window.onload = () => {
  // Hide the preloader div
  preloader.style.display = "none";
}
// Initialize the elements
$(document).ready(function(){
  // Select Materialize
  $('select').formSelect();
  // Collapsible Feature
  $('.collapsible').collapsible();
});

// AOS Animate 
AOS.init({
  duration : 1000, // duration of the animation
  once: true       // execute only once
});


// Database Configuration

// Offline Data
db.enablePersistence()
  .catch(err => {
    if(err.code == 'failed-precondition'){
      // probably multiple tabs open at once
      console.log('persistence failed');
    }
    else if(err.code == 'unimplemented'){
      // lack of browser support
      console.log('Persistence is not available');
    }
  });

// Realtime listener
db.collection('recipes').onSnapshot((snapshot) => {
  console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    //console.log(change, change.doc.data(), change.doc.id);
    if(change.type === 'added'){
      // add document data to the web page
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if(change.type === 'removed'){
      // remove the document data from web page
      removeRecipe(change.doc.id); // id of the doc removed
    }
  })
});

// Render Recipe function
const renderRecipe = (data, id) => {
  // Create template HTML with data
  const html = `
      <!-- Card Panel for each item -->
      <div class="card-panel recipe white row" data-id="${id}">
        <!-- Use suitable and optimised media of the correct format -->
        <picture>
          <!-- Min Width: 200px-->
          <source srcset="./img/dish.svg" media="(min-width: 200px)" type="image/webp">
          <!-- Fallback image -->
          <img src="./img/fallback_dish.png" alt="Noodles dish" title="Noodles dish" loading="lazy">
        </picture>
        <div class="recipe-details">
          <div class="recipe-title">${data.title}</div>
          <div class="recipe-ingredients">${data.ingredients}</div>
        </div>
        <div class="recipe-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
      </div>
  `;
  recipes.innerHTML += html;
}

// Add New Recipe
const form = document.querySelector('.add-recipe');
form.addEventListener('submit', evt => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('recipes').add(recipe)
    .catch(err => console.error(err));
  
  form.title.value = '';
  form.ingredients.value = '';
});

// Delete Recipe
const recipeContainer = document.querySelector('.s-recipes');
recipeContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id =  evt.target.getAttribute('data-id'); //  get the id attribute
    db.collection('recipes').doc(id).delete();
  }
});

// Remove Recipe function
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
}