// Declare a new function named search
async function search() {
  // read the user input from the term field in the form searchForm
  let searchTerm = document.forms.searchForm.term.value;
  // read the searchType
  let searchType = document.forms.searchForm.searchType.value;
  // empty the input field
  document.forms.searchForm.term.value = '';
  // read the json
  let rawData = await fetch('/api/pdfs/' + searchTerm + '/' + searchType);
  // convert json to a javascript data structure
  let pdfs = await rawData.json();
  // create an variable name that initially is an empty string
  let html = `
    <p>You searched for "${searchTerm}"...</p>
    <p>Found ${pdfs.length} PDFs.</p>
  `;
  // loop through the found songs
  for (let pdf of pdfs) {
    let meta = pdf.metadata.info;
    console.log(pdf.fileName);
    html += `
      <section>
        <h2 class= "red-title">${meta.Title}</h2>
        <p><b>Author:</b> ${meta.Author}</p>
        <p><b>Creator:</b> ${meta.Creator}</p>  
        <p><b>Amount Pages:</b> ${pdf.metadata.numpages}</p>
        <p><a target="_blank" href="pdfs/${pdf.fileName}">Open PDF</a>
        </p>
      </section>
    `;
  }
  // Grab the element/tag with the class searchResults
  let searchResultsElement = document.querySelector('.searchResults');
  // Change the content of the searchResults element
  searchResultsElement.innerHTML = html;
}