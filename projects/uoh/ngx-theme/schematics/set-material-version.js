const fs = require('fs');
const chalk = require('chalk');
const request = require('request');

const readJSON = filePath => {
  const data = fs.readFileSync(filePath, 'utf8');

  return JSON.parse(data);
};

const readPackageVersion = (configPath, package) => {
  const config = readJSON(configPath);

  if (config.dependencies && config.dependencies[package]) {
    return config.dependencies[package];
  }

  if (config.peerDependencies && config.peerDependencies[package]) {
    return config.peerDependencies[package];
  }

  return undefined;
};

const setSchematicsMaterialVersion = (filePath, version) => {
  // Set the fallback material version: the version used as peer dependency in this project.
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const content = data.replace('~0.0.0-PLACEHOLDER', version);
    fs.writeFile(filePath, content, 'utf8', err => {
      if (err) throw err;
      console.log(chalk.yellow.bold(`The material version ${version} was set in the schematics file ${filePath}.`));
    });
  });

  // Set the list of material versions from material.angular.io.
  request('https://material.angular.io/assets/versions.json', (error, response, body) => {
    if (error && response.statusCode !== 200) throw error;
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;
      const results = JSON.parse(body);
      const versionsArray = results.map(item => item.title);
      const versions = JSON.stringify(versionsArray);
      const content = data.replace(`[]; // MAT_VERSIONS_PLACEHOLDER`, `${versions};`);
      fs.writeFile(filePath, content, 'utf8', err => {
        if (err) throw err;
        console.log(
          chalk.yellow.bold(`The list of material versions ${versions} was set in the schematics file ${filePath}.`)
        );
      });
    });
  });
};

const setMaterialVersion = (configPath, schematicsFile) => {
  const version = readPackageVersion(configPath, '@angular/material');
  setSchematicsMaterialVersion(schematicsFile, version);
};

setMaterialVersion('package.json', '../../../dist/uoh/ngx-theme/schematics/ng-add/index.js');
