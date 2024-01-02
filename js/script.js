/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering

Student: Doris Keller, Pfäffikon SZ, Switzerland
*/

/**
 * Global variables
 * @type {HTMLElement} `studentList`- a reference to the list container
 * @type {array} `studentsData` - an array of student objects
 * @type {number} `itemsPerPage` - number of max students to be displayed on each page
 */

const studentList = document.querySelector(".student-list");
const linkList =  document.querySelector(".link-list");
const studentsData = data;
const itemsPerPage = 9;

/**
 * @function showPage(array)
 * @description <Creates and displays a page of a given number of students by looping over the students array, using the page number to select the students to display>
 * @parameter {array} `list` - an array of objects with data to display on the page
 * @parameter {number} `page` - page number
 * @constant {number} `startIndex`, `endIndex` - the first and last student for a page
 * @returns a html list with a given number of students
 */

const showPage = (list, page) => {
   const startIndex = page * itemsPerPage - itemsPerPage;
   const endIndex = page * itemsPerPage;
   studentList.innerHTML = "";

   for (let i = 0; i < list.length; i++) {
      const {name: {first, last}, email, registered: {date}, picture: {large: img}} = list[i];
      if (i >= startIndex && i < endIndex) {
         const html = `
            <li class="student-item cf">
               <div class="student-details">
                  <img class="avatar" src="${img}" alt="`Image showing a portrait of ${first} ${last}`">
                  <h3>${first} ${last}</h3>
                  <span class="email">${email}</span>
               </div>
               <div class="joined-details">
                  <span class="date">Joined ${date}</span>
               </div>
            </li>
         `;
         studentList.insertAdjacentHTML("beforeend", html);
      }
   }
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

/**
 * @function `addPagination`
 * @description <Renders pagination buttons to the page. Clicking on a button calls the `showPage()` function with the text content of the button as the page argument>
 * @parameter {array} `list` - student list
 * @constant {number} `maxBtns` - Number of pagination buttons
 * @constant {html} `linkList` - reference to the link-list container
 * @event - adds an event listener to the linklist to handle the pagination
 */

const addPagination = list => {
   const maxBtns = Math.ceil(list.length / itemsPerPage);
   linkList.innerHTML = "";
   
   for (i = 1; i <= maxBtns; i++) {
      const html = `<li><button type="button">${i}</button>`;
      linkList.insertAdjacentHTML("beforeend", html);
   } 
   const firstBtn = linkList.querySelector("li button");
   firstBtn.classList.add("active");

   linkList.addEventListener("click", e => {
      const clickedBtn = e.target;
      const pageNr = clickedBtn.textContent;
      if (clickedBtn.tagName === "BUTTON") {
         const activeBtn = linkList.querySelector(".active");
         activeBtn.classList.remove("active");
         clickedBtn.classList.add("active");
         showPage(list, pageNr);
      }
   });
}

/**
 * @function searchFunction
 * @description <Filters matching names with user input in array of objects and displays results calling showPage() and addPagination() with said results>
 * @param {array} list - array of objects to search in
 * @param {HTMLElmeent} label - get user input
 */

const searchFunction = (list, label) => {
   const userInput = label.querySelector("input").value.toLowerCase();
   const filteredList = [];
   list.forEach(item => {
       const fullName = `${item.name.first} ${item.name.last}`.toLowerCase();
       if(fullName.includes(userInput)) {
          filteredList.push(item);
       }
   });
   if (filteredList.length > 0) {
      showPage(filteredList, 1);
      addPagination(filteredList);
   } else {
      linkList.innerHTML = "";
      studentList.innerHTML = `<h3>Sorry, we didn't found any results matching "${userInput}"</h3>`;
   }
   return filteredList;
}

/**
 * @function searchBar()
 * @description <Creates a searchbar and calls the searchFunction() with the original list of students as a callback in two event listeners (search field and button)>
 * @param {array} list 
 */

const searchBar = list => {
   const createEl = (el, a1, val1, a2=null, val2=null) => {
      el = document.createElement(el);
      el.setAttribute(a1, val1);
      if (a2 !== null) {
         el.setAttribute(a2, val2);
      }
      return el;
   }

   const header = document.querySelector(".header");
   const label = createEl("label", "for", "search", "class", "student-search");
   const span = document.createElement("span");
   span.textContent = "Search by name";
   const input = createEl("input", "id", "search", "placeholder", "Search by name...");
   const searchBtn = createEl("button", "type", "button");
   const img = createEl("img", "src", "./img/icn-search.svg", "alt", "Search icon");
   
   searchBtn.append(img);
   label.append(span, input, searchBtn);
   header.append(label);

   label.addEventListener("click", e => {
      if(e.target.closest("button")) {
         //to test if button works, uncomment the following line:
         //console.log(searchFunction(list, label));
         searchFunction(list, label);
      }
   });

   label.addEventListener("keyup", e => {
      if(e.target.tagName === "INPUT") {
         searchFunction(list, label);
      }
   });
}

// Call functions
showPage(studentsData, 1);
addPagination(studentsData);
searchBar(studentsData);