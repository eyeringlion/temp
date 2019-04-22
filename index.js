const express = require('express');
const bodyParser = require('body-parser');
const renderLocationKnown = require('./src/utils/renderLocationKnown');
const renderLocationUnknown = require('./src/utils/renderLocationUnknown');
const renderBuilding = require('./src/utils/renderBuilding');
const app = express();

const main = (req, res) => {
  if (
    req.body &&
    req.body.intent &&
    req.body.intent.arguments &&
    req.body.intent.arguments.length > 0
  ) {
    var intentName = req.body.intent.name;
    var intentArguments = req.body.intent.arguments;
    console.log('intentArguments[0].name', intentArguments[0].name);
    console.log(
      'intentArguments[0].stringValue',
      intentArguments[0].stringValue
    );
    if (intentArguments[0].name === 'Location') {
      renderLocationKnown(intentArguments[0].stringValue, res);
    } else if (intentArguments[0].name === 'Building') {
      renderBuilding(intentArguments[0].stringValue, res);
    } else {
      renderLocationUnknown(res);
    }
  } else {
    renderLocationUnknown(res);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  main(req, res);
});

app.post('/', (req, res) => {
  main(req, res);
});

app.get('/webhook-gsa', (req, res) => {
  res.send('~~~Hello World webhook-gsa ~~~');
});

app.get('/actuator/health', (req, res) => {
  res.send('~~~Hello World~~~ actuator/health');
});

app.listen(3000, () => {
  console.log('Server is running, better catch it');
});
