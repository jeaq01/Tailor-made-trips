$(document).ready(function () {
  const apiKey = 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD';
  const autocompleteUrl = 'https://api.tomtom.com/search/2/autocomplete/';

  // Event handler for input in the search box
  $('.tt-search-box-input').on('input', function () {
    const query = $(this).val();
    if (query.length > 2) {
      $.getJSON(`${autocompleteUrl}${query}.json`, {
        key: apiKey,
        typeahead: true,
        autocomplete: true,
        limit: 10,
      })
        .done(function (data) {
          const suggestions = $('#suggestions');
          suggestions.empty();
          data.results.forEach((result) => {
            const suggestionItem = $('<div></div>')
              .addClass('suggestion-item')
              .text(result.address.freeformAddress)
              .on('click', function () {
                $('.tt-search-box-input').val(result.address.freeformAddress);
                suggestions.empty();
              });
            suggestions.append(suggestionItem);
          });
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.error(
            'Error fetching autocomplete suggestions:',
            textStatus,
            errorThrown
          );
        });
    } else {
      $('#suggestions').empty();
    }
  });
});
