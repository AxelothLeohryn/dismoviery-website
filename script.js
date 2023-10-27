// Mobile Nav

const toggleButton = document.getElementById('toggle-button');
const dropDownMenu = document.getElementById('dropdown-menu');
const toggleButtonIcon = document.getElementById('toggle-button-icon');

toggleButton.addEventListener('click', (event) => {
    dropDownMenu.classList.toggle('open');
    toggleButtonIcon.classList = dropDownMenu.classList.contains('open') ? 
    "fa-solid fa-xmark" : "fa-solid fa-bars"
})