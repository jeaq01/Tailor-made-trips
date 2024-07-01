$(document).ready(function () {
  const apiKey = 'vCw9Yk3R6SV4nTTFvABzK5c0op7GAbzD';
  let map;

  // Check if city is selected on results.html
  const city = localStorage.getItem('selectedCity');
  if (!city) {
    alert('No city selected');
    window.location.href = 'index.html';
    return;
  }

  // Set the city name in the results page
  $('#city-name').text(city);

  let selectedCategories = [];

  // Handle selection of POI categories
  $('.poi-card').on('click', function () {
    $(this).toggleClass('selected');
  });

  // Event handler for "Fetch Points of Interest" button
  $('#fetch-pois-button').on('click', function () {
    selectedCategories = [];
    $('.poi-card.selected').each(function () {
      selectedCategories.push($(this).data('category'));
    });

    // Modified this block to show user error on screen (instead of alert box), if user does not select at least 1 poi
    if (selectedCategories.length === 0) {
      const message = document.querySelector('message');
      message.textContent = 'Please select at least one category';
      message.style.color = 'red';
      return;
    }

    // Hide the modal after fetching POIs
    $('#poiModal').hide();

    fetchPOIs(city, selectedCategories);
  });

  // Function to fetch POIs based on city and categories
  function fetchPOIs(city, categories) {
    const searchUrl = 'https://api.tomtom.com/search/2/search/';

    $.getJSON(`${searchUrl}${city}.json`, {
      key: apiKey,
      limit: 1,
    })
      .done(function (data) {
        if (data.results.length > 0) {
          const cityData = data.results[0];
          const { lat, lon } = cityData.position;

          if (!map) {
            initMap(lat, lon);
          } else {
            map.setCenter([lon, lat]);
          }

          categories.forEach((category) => {
            fetchCategoryPOIs(lat, lon, category);
          });

          // Show the Favorites section after fetching POIs
          $('#favorites').show();
        } else {
          alert('City not found');
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
    const placesUrl = 'https://api.tomtom.com/search/2/poiSearch/';

    $.getJSON(`${placesUrl}${category}.json`, {
      key: apiKey,
      limit: 10,
      lat: lat,
      lon: lon,
    })
      .done(function (data) {
        const poiResults = $('#poi-results');
        const categoryList = $('<ul></ul>').attr('id', `category-${category}`);
        poiResults.append(`<h3>${category}</h3>`);
        poiResults.append(categoryList);
        data.results.forEach((poi) => {
          const listItem = $('<li></li>')
            .text(
              `${poi.poi.name} - ${poi.address.freeformAddress} - ${
                poi.poi.phone ? poi.poi.phone : ''
              } - ${poi.poi.description ? poi.poi.description : ''}`
            )
            .data('poi', poi);
          listItem.on('click', function () {
            $(this).toggleClass('selected');
            if ($(this).hasClass('selected')) {
              addToFavorites(poi);
            } else {
              removeFromFavorites(poi);
            }
          });
          categoryList.append(listItem);
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

  // Function to add POI to favorites
  function addToFavorites(poi) {
    const favoritesList = $('#favorites-list');
    const listItem = $('<li></li>')
      .text(
        `${poi.poi.name} - ${poi.address.freeformAddress} - ${
          poi.poi.phone ? poi.poi.phone : ''
        } - ${poi.poi.description ? poi.poi.description : ''}`
      )
      .data('poi', poi);
    favoritesList.append(listItem);
  }

  // Function to remove POI from favorites
  function removeFromFavorites(poi) {
    $('#favorites-list li').each(function () {
      const item = $(this);
      if (item.data('poi').id === poi.id) {
        item.remove();
      }
    });
  }
});
