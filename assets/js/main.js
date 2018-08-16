let restaurants,
  neighborhoods,
  cuisines;
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});
/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};
/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};
/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};
/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById("cuisines-select");
  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};
/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiemlrYW1hIiwiYSI6ImNqa3RneWh5YTA1MG8zcXAzaGQ3aTc2b2YifQ.UGbjdB9VUGwhLrehNubB-Q',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  document.getElementById("filters-modal").style.display = "none";
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      }
    }
  );
};
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";
  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};
/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  noResultsElement = document.querySelector(".no-restaurant-msg");
  if (restaurants.length === 0) {
    noResultsElement.style.display = "block";
  } else {
    //Make sure the paragraph is not displayed on a new search
    //yielding results after an empty search.
    noResultsElement.style.display = "none";
  }
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
  const filtersContainer = document.getElementById("filters");
  filtersContainer.focus();
  
};
/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement("li");
  li.className = "restaurant-container row-default";
  const imageContainer = document.createElement("div");
  imageContainer.className = "restaurant-img-container";
  const image = document.createElement("img");
  image.className = "restaurant-img";
  image.classList.add("img");
  // image.classList.add("img-hover");
  image.setAttribute("onclick","showImage(this)") ;
  image.alt = `${restaurant.name} restaurant, ${restaurant.shortDesc}`;
  const isIcon = true;
  image.src = DBHelper.imageUrlForRestaurant(restaurant, 128);
  imageContainer.appendChild(image);
  li.append(imageContainer);
  const descriptionItems = document.createElement("div");
  descriptionItems.className = "descriptions";
  const name = document.createElement("h2");
  name.innerHTML = restaurant.name;
  descriptionItems.append(name);
  const neighborhood = document.createElement("p");
  neighborhood.className = "neighborhood";
  neighborhood.innerHTML = restaurant.neighborhood;
  descriptionItems.append(neighborhood);
  const address = document.createElement("p");
  const sepa = document.createElement("br");
  address.appendChild(sepa);
  address.className = "address";
  address.innerHTML = restaurant.address;
  descriptionItems.append(address);
  li.append(descriptionItems);
  const moreContainer = document.createElement("span");
  moreContainer.className = "more-container";
  const more = document.createElement("a");
  const button = document.createElement("button");
  more.appendChild(button);
  const moreBtnTitle = `Read ${restaurant.name}'s restaurant details`;
  button.className = "brn-sm-radius btn-more";
  button.innerHTML = "View details";
  more.setAttribute("aria-label", moreBtnTitle);
  button.title = moreBtnTitle;
  more.href = DBHelper.urlForRestaurant(restaurant);
  descriptionItems.append(more);
  li.append(moreContainer);
  return li;
};
/**
 * Add markers for current restaurants to the map.
 *//*
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

*/
/*
 * Add markers for current restaurants to the map.
*/
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.addEventListener(marker, "click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.marker.push(marker);
  });

};
/*
* Triger search by pressing search button

let trg = document.querySelector(".triger"),
    gered = document.querySelector(".open-search-modal") ;
 trg.addEventListener("click",function(){
    gered.click();
 });*/