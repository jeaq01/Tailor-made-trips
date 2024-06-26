function createSearchBox(search) {
  const searchBoxEl = $('#search-box');
  var options = {
    searchOptions: {
      key: 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD',
      language: 'en-GB',
      limit: 5,
    },
    autocompleteOptions: {
      key: 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD',
      language: 'en-GB',
    },
  };
  var ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
  var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
  document.body.append(searchBoxHTML);
}
