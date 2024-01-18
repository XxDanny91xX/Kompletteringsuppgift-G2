// Declare a new function named search
async function search() {
  // read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  // read the searchType
  let searchType = document.forms.searchForm.searchType.value;
  // empty the input field
  document.forms.searchForm.term.value = '';
  // read the json
  let rawData = await fetch('/api/words/' + searchTerm + '/' + searchType);
  // convert json to a javascript data structure
  let words = await rawData.json();
  // create an variable name that initially is an empty string
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${words.length} words.</p>
  `;
  // loop through the found songs
  for (let word of words) {
    let meta = word.metadata;
    console.log(word.fileName);
    html += `
      <section>
        <h2 class= "red-title">${meta.title}</h2>
        <p><b>Author:</b> ${meta.Author}</p>
        <p><b>Created by:</b> ${meta.createdBy}</p>  
        <p><b>Modified by:</b> ${word.metadata.modifiedBy}</p>
      </section>
    `;
  }
  // Grab the element/tag with the class searchResults
  let searchResultsElement = document.querySelector('.searchResults');
  // Change the content of the searchResults element
  searchResultsElement.innerHTML = html;
}