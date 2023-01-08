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


  // Database Configuration
  db.collection('recipes')
