const fetch = require('node-fetch');
const buildingNameToDetail = require('.././data/buildingNameToDetail.json');
const cardBody = require('.././components/cardBody');
const textBlock = require('.././components/textBlock');
const base_building_url =
  'https://api-proxy.wework.com/locations/api/v2/buildings/';

const fetchBuilding = async slug => {
  const url = base_building_url + slug;
  let response = await fetch(url);
  let data = await response.json();
  return data;
};

module.exports = function(buildingName, res) {
  const buildingDetail = buildingNameToDetail[buildingName];
  fetchBuilding(buildingDetail.slug).then(json => {
    const building = json.building;
    const contents = [];
    const label = textBlock(building.line1);
    contents.push(label);

    res.json(cardBody(contents));
  });
};
