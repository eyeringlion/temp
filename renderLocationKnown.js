const fetch = require('node-fetch');
const cardBody = require('.././components/cardBody');
const dropdown = require('.././components/dropdown');
const carousel = require('.././components/carousel');
// const chipInput = require('.././components/chipInput');
const buttonCard = require('../components/buttonCard');
const textBlock = require('.././components/textBlock');
const buildingCard = require('.././components/buildingCard');
const button = require('.././components/button');
const locationNameToDetail = require('.././data/locationNameToDetail.json');
const base_location_url =
  'https://api-proxy.wework.com/locations/api/v1/geogroupings/';
const base_building_url =
  'https://api-proxy.wework.com/locations/api/v2/buildings/';

const fetchLocation = async slug => {
  const url = base_location_url + slug;
  let response = await fetch(url);
  let data = await response.json();
  return data;
};

const fetchBuildings = async buildings => {
  const promises = buildings.map(async building => {
    const url = base_building_url + building.id;
    const response = await fetch(url);
    const data = response.json();
    return data;
  });
  const data = await Promise.all(promises);
  return data;
};

module.exports = function(location, res) {
  const locationDetail = locationNameToDetail[location];
  fetchLocation(locationDetail.slug).then(json => {
    let children = [];
    let buildings = [];
    let parent;
    if (json.geogrouping) {
      children = json.geogrouping.children;
      buildings = json.geogrouping.buildings;
      parent = json.geogrouping.parent;
    }
    const contents = [];
    if (locationDetail.type === 'Countrygeo' && children.length > 0) {
      const allMarketgeo = children.map(child => child.name);
      const locationDropdown = dropdown(
        'Find Workspace In',
        'All Cities',
        allMarketgeo,
        'Location',
        'WeWork'
      );
      contents.push(locationDropdown);
    } else {
      if (children.length > 0) {
        const cards = children.map(child =>
          buttonCard(textBlock(child.name), child.name)
        );
        const buttonCarousel = carousel(100, 100, cards);
        contents.push(buttonCarousel);
      }
    }

    // else if (parent) {
    // contents.push(
    //   button(parent.name, 1, 'https://www.wework.com/l/' + parent.slug)
    // );
    // }
    if (buildings.length > 0) {
      buildings = buildings.filter((building, index) => index < 5);
      fetchBuildings(buildings).then(array => {
        const cards = array.map(item => buildingCard(item.building));
        const buildingCarousel = carousel(
          240,
          300,
          cards,
          'https://www.wework.com/l/' + locationDetail.slug
        );
        contents.push(buildingCarousel);
        const allLocationsBtn = button(
          'View more in ' + location,
          0,
          'https://www.wework.com/l/' + locationDetail.slug
        );
        contents.push(allLocationsBtn);
        res.json(cardBody(contents));
      });
    }
  });
};
