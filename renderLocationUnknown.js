const countryNames = require('.././data/countryNames');
const cardBody = require('.././components/cardBody');
const dropdown = require('.././components/dropdown');

module.exports = function(res) {
  const contents = [];
  const locationDropdown = dropdown(
    'Find Workspace In',
    'All Countries',
    countryNames,
    'Location',
    'WeWork'
  );
  contents.push(locationDropdown);

  res.json(cardBody(contents));
};
