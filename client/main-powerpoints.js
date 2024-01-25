// Declare a new function named search
async function search() {
  // read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  // read the searchType
  let searchType = document.forms.searchForm.searchType.value;
  console.log(searchType);
  // empty the input field
  document.forms.searchForm.term.value = '';
  // read the json
  let rawData = await fetch('/api/powerpoints/' + searchTerm + '/' + searchType);
  // convert json to a javascript data structure
  let powerpoints = await rawData.json();
  // create an variable name that initially is an empty string
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${powerpoints.length} PowerPoints.</p>
  `;
  // loop through the found information
  for (let powerpoint of powerpoints) {
    let meta = powerpoint.metadata;
    //console.log(powerpoint.metadata);
    console.log(meta.original)
    let site = meta.original.includes('http') ? meta.original.split('//')[1].split('/')[0]:meta.original;
    let link = 'https://' + site;
    html += `
      <section>
        <h2 class="red-title">${(meta.title + '').slice(0,50)}</h2>
        <p><b>Company:</b> ${meta.company}</p>
        <p><b>Date Created:</b> ${meta.creation_date.split('T')[0]}</p>  
        <p><b>Original published on the web site: </b><a target="_blank" href="${link}">${site}</a></p>  
        <p>
        <a href="powerpoints/${powerpoint.fileName}">Download PowerPoint</a>
        </p>
      </section>
    `;
  }
  // Grab the element/tag with the class searchResults
  let searchResultsElement = document.querySelector('.searchResults');
  // Change the content of the searchResults element
  searchResultsElement.innerHTML = html;
}