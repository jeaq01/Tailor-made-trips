$(document).ready(function () {
  const apiKey = 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD';

  // Initialize TomTom Search Box
  const options = {
    searchOptions: {
      key: apiKey,
      language: 'en-GB',
      limit: 15,
      typeahead: true,
      maxFuzzyLevel: 2,
    },
    autocompleteOptions: {
      key: apiKey,
      language: 'en-GB',
    },
  };

  const ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
  const searchBoxHTML = ttSearchBox.getSearchBoxHTML();
  $('#search-box-container').html(searchBoxHTML);

  // Remove border from search box and make it full width
  $('.tt-search-box-input').css({
    border: 'none',
    width: '100%',
  });

  // Handle selection from dropdown and populate the input box
  $(document).on('click', '.tt-search-box-suggestion', function () {
    const selectedLocation = $(this).text();
    $('.tt-search-box-input').val(selectedLocation);
  });

  // Handle the search button click
  $('#search-button').on('click', function () {
    const city = $('.tt-search-box-input').val();
    if (city) {
      localStorage.setItem('selectedCity', city);
      addRecentSearch(city);
      window.location.href = 'results.html';
    } else {
      const message = $('.message');
      message.text('Please enter a location.');
    
    }
  });
});
