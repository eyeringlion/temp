const fetch = require('node-fetch');
const fs = require('fs');
const manifestTemplate = require('./manifestTemplate.json');
const geogroupings_url =
  'https://api-proxy.wework.com/locations/api/v1/geogroupings';
const buildings_url = 'https://api-proxy.wework.com/locations/api/v2/buildings';

const fetGeogroupings = async () => {
  let response = await fetch(geogroupings_url);
  let data = await response.json();
  return data.geogroupings;
};

const fetBuildings = async () => {
  let response = await fetch(buildings_url);
  let data = await response.json();
  return data.buildings;
};

fetGeogroupings().then(geogroupings => {
  const map = {};
  const countryNames = [];
  const intentOptions = [];
  geogroupings.forEach(({ name, slug, type }) => {
    map[name] = { slug, type };
    if (type === 'Countrygeo') {
      countryNames.push(name);
    }
    intentOptions.push({ value: name });
  });

  fs.writeFile(
    './src/data/locationNameToDetail.json',
    JSON.stringify(map),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('locationNameToDetail.json was saved!');
    }
  );

  fs.writeFile(
    './src/data/countryNames.json',
    JSON.stringify(countryNames),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('countryNames.json was saved!');
    }
  );

  // generate manifest.json
  manifestTemplate.intents[1].parameters[0].enumType.options = intentOptions;
  fs.writeFile(
    './src/data/manifest.json',
    JSON.stringify(manifestTemplate),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('manifest.json was saved!');
    }
  );
});

fetBuildings().then(buildings => {
  const map = {};
  buildings.forEach(({ name, slug }) => {
    map[name] = { slug };
  });

  fs.writeFile(
    './src/data/buildingNameToDetail.json',
    JSON.stringify(map),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log('buildingNameToDetail.json was saved!');
    }
  );
});
