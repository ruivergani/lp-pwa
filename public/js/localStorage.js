//get elements referenced in code
let txtName = document.getElementById('name_recipe');
let txtIngredients = document.getElementById('ingredients') ;
let txtDisplay = document.getElementById("all_recipes"); // textarea to display
let btnAdd = document.getElementById('add_recipe');

// Add event listener to button
btnAdd.addEventListener('click', addEntry);

// Reference to directory
let directory = [];

// If directory exists
if ("directory" in localStorage) {
    directory = JSON.parse(localStorage.getItem('directory'));
    showEntries();
}
// Show all entries from LocalStorage
function showEntries() {
    txtDisplay.value = "";
    for (let i = 0; i < directory.length; i++) {
        txtDisplay.value += `${directory[i].name}\t${directory[i].ingredients}\n\n`;
    }
}
function addEntry() {
    // create the JSON file to store data
    const entry = {
        "name": txtName.value,
        "ingredients": txtIngredients.value
    };
    directory.push(entry);
    localStorage.setItem('directory', JSON.stringify(directory));
    showEntries();
}

