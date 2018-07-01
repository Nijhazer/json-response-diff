const fetch = require('node-fetch'),
  diff = require('diff-json-structure'),
  chalk = require('chalk');

// Source: http://api-dev.hearstautolab.com/v1/models/model/toyota_camry
// Comparison: https://s3-us-west-2.amazonaws.com/mediumnormal.images/resp.dat
const sourceURI = process.argv[2],
  comparisonURI = process.argv[3];

Promise.all([
  fetch(sourceURI).then(res => res.json()).then(json => Promise.resolve(json.data)),
  fetch(comparisonURI).then(res => res.json()).then(json => Promise.resolve(json.data))
]).then(data => {
  const sourceJSON = data[0],
    comparisonJSON = data[1],
    diffs = diff(sourceJSON, comparisonJSON);
  
    diffs.forEach(diffItem => {
      diffItem.value
        .split('\n')
        .filter(line => !!line)
        .forEach(line => {
          let prefix = ' ',
            color = 'dim';
          if (diffItem.added) {
            prefix = '+';
            color = 'green';
          } else if (diffItem.removed) {
            prefix = '-';
            color = 'red';
          }
          process.stdout.write(chalk[color](`${prefix} ${line}\n`));
      });
    });
    process.stdout.write('\n');
});