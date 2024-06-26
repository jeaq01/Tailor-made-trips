$(document).ready(function () {
  const apiKey = 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD'; // TomTom API key
  const searchUrl = 'https://api.tomtom.com/search/2/search/'; // URL for search API
  const placesUrl = 'https://api.tomtom.com/search/2/poiSearch/'; // URL for POI search API
  const autocompleteUrl = 'https://api.tomtom.com/search/2/autocomplete/'; // URL for autocomplete API

  let map; // Variable to store the map instance
  let markers = []; // Array to store map markers

  // Autocomplete function for the city search input
  $('#city-search').on('input', function () {
    let query = $(this).val();
    if (query.length > 2) {
      // Start fetching suggestions after 3 characters
      $.getJSON(`${autocompleteUrl}${query}.json`, {
        key: apiKey,
        typeahead: true,
        limit: 5, // Limit suggestions to 5 results
      })
        .done(function (data) {
          let suggestions = $('#suggestions');
          suggestions.empty(); // Clear previous suggestions
          data.results.forEach((result) => {
            let suggestionItem = $('<div></div>')
              .addClass('suggestion-item')
              .text(result.address.freeformAddress); // Display address
            suggestionItem.on('click', function () {
              $('#city-search').val(result.address.freeformAddress); // Set the clicked suggestion in input
              suggestions.empty(); // Clear suggestions
            });
            suggestions.append(suggestionItem); // Append suggestion to the list
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
      $('#suggestions').empty(); // Clear suggestions if query is less than 3 characters
    }
  });

  // Event handler for search button click on index.html
  $('#search-button').on('click', function () {
    let city = $('#city-search').val();
    if (city) {
      localStorage.setItem('selectedCity', city); // Save the selected city to local storage
      localStorage.removeItem('favorites'); // Clear the favorites from local storage
      window.location.href = 'results.html'; // Redirect to results page
    } else {
      alert('Please enter a location'); // Alert if no location is entered
    }
  });

  // Check if city is selected on results.html
  let city = localStorage.getItem('selectedCity');
  if (!city) {
    alert('No city selected'); // Alert if no city is selected
    window.location.href = 'index.html'; // Redirect back to index page
    return;
  }

  // Set the city name in the results page
  $('#city-name').text(city);

  let selectedCategories = []; // Array to store selected POI categories

  // Event handler for selecting POI button
  $('#select-poi-button').on('click', function () {
    $('#poi-form').trigger('reset'); // Clear the form
    $('.poi-card').removeClass('selected'); // Deselect all POI cards
    $('#poiModal').show(); // Show the POI modal
    $(this).hide(); // Hide the select POI button
  });

  // Event handler for selecting POI categories
  $('.poi-card').on('click', function () {
    $(this).toggleClass('selected'); // Toggle selection
    let category = $(this).data('category');
    if ($(this).hasClass('selected')) {
      selectedCategories.push(category); // Add to selected categories
    } else {
      selectedCategories = selectedCategories.filter((cat) => cat !== category); // Remove from selected categories
    }
  });

  // Event handler for fetching POIs
  $('#fetch-pois-button').on('click', function () {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category'); // Alert if no categories are selected
      return;
    }

    $('#poiModal').hide(); // Hide the POI modal
    $('#poi-results').empty(); // Clear previous POI results
    clearMarkers(); // Clear previous markers
    fetchPOIs(city, selectedCategories); // Fetch POIs for the selected categories
  });

  // Function to fetch POIs based on city and categories
  function fetchPOIs(city, categories) {
    $.getJSON(`${searchUrl}${city}.json`, {
      key: apiKey,
      limit: 1, // Limit to one result to get city coordinates
    })
      .done(function (data) {
        if (data.results.length > 0) {
          let cityData = data.results[0];
          let { lat, lon } = cityData.position;

          // Save city data with all attributes to local storage
          localStorage.setItem('cityData', JSON.stringify(cityData));

          // Initialize map if not already initialized
          if (!map) {
            initMap(lat, lon);
          } else {
            map.setCenter([lon, lat]); // Set map center to the city location
          }

          categories.forEach((category) => {
            fetchCategoryPOIs(lat, lon, category); // Fetch POIs for each category
          });
        } else {
          alert('City not found'); // Alert if city is not found
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          'Error fetching city coordinates:',
          textStatus,
          errorThrown
        );
      });
  }

  // Function to fetch POIs for a specific category
  function fetchCategoryPOIs(lat, lon, category) {
    $.getJSON(`${placesUrl}${category}.json`, {
      key: apiKey,
      limit: 10, // Limit to 10 POIs
      lat: lat,
      lon: lon,
    })
      .done(function (data) {
        let poiResults = $('#poi-results');
        let categoryList = $('<ul></ul>').attr('id', `category-${category}`);
        poiResults.append(`<h4>${category}</h4>`);
        poiResults.append(categoryList);
        data.results.forEach((poi) => {
          let listItem = $('<li></li>')
            .text(
              `${poi.poi.name} - ${poi.address.freeformAddress} - ${
                poi.poi.phone ? poi.poi.phone : ''
              } - ${poi.poi.description ? poi.poi.description : ''}`
            )
            .data('poi', poi);
          listItem.on('click', function () {
            $(this).toggleClass('selected');
            if ($(this).hasClass('selected')) {
              addToFavorites(poi); // Add to favorites if selected
            } else {
              removeFromFavorites(poi); // Remove from favorites if deselected
            }
          });
          categoryList.append(listItem); // Append POI to the category list
          addMarker(poi); // Add marker to the map
        });
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          `Error fetching POIs for category ${category}:`,
          textStatus,
          errorThrown
        );
      });
  }

  // Function to initialize the map
  function initMap(lat, lon) {
    map = tt.map({
      key: apiKey,
      container: 'map',
      center: [lon, lat],
      zoom: 12,
    });
  }

  // Function to add a marker to the map
  function addMarker(poi) {
    let marker = new tt.Marker()
      .setLngLat([poi.position.lon, poi.position.lat])
      .addTo(map);
    markers.push(marker); // Add marker to the array
  }

  // Function to clear all markers from the map
  function clearMarkers() {
    markers.forEach((marker) => marker.remove()); // Remove each marker
    markers = []; // Clear the markers array
  }

  // Function to add a POI to favorites
  function addToFavorites(poi) {
    let favoritesList = $('#favorites-list');
    let favoriteItem = $('<li></li>')
      .text(
        `${poi.poi.name} - ${poi.address.freeformAddress} - ${
          poi.poi.phone ? poi.poi.phone : ''
        } - ${poi.poi.description ? poi.poi.description : ''}`
      )
      .data('poi', poi);
    favoriteItem.on('click', function () {
      $(this).remove();
      removeFromFavorites(poi); // Remove from favorites if clicked
    });
    favoritesList.append(favoriteItem); // Append favorite item to the list
    saveFavorites(); // Save favorites to local storage
  }

  // Function to remove a POI from favorites
  function removeFromFavorites(poi) {
    let favoritesList = $('#favorites-list');
    favoritesList
      .find('li')
      .filter(function () {
        return $(this).data('poi').id === poi.id;
      })
      .remove();
    saveFavorites(); // Save favorites to local storage
  }

  // Function to save favorites to local storage
  function saveFavorites() {
    let favorites = [];
    $('#favorites-list')
      .find('li')
      .each(function () {
        favorites.push($(this).data('poi')); // Add each POI to the favorites array
      });
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save favorites to local storage
  }

  // Initialize favorites list from local storage on page load
  let storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let favoritesList = $('#favorites-list');
  storedFavorites.forEach((poi) => {
    let favoriteItem = $('<li></li>')
      .text(
        `${poi.poi.name} - ${poi.address.freeformAddress} - ${
          poi.poi.phone ? poi.poi.phone : ''
        } - ${poi.poi.description ? poi.poi.description : ''}`
      )
      .data('poi', poi);
    favoriteItem.on('click', function () {
      $(this).remove();
      removeFromFavorites(poi); // Remove from favorites if clicked
    });
    favoritesList.append(favoriteItem); // Append favorite item to the list on page load
  });
});
