const fs = require('fs');

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
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const content = data.replace('~0.0.0-PLACEHOLDER', version);
    fs.writeFile(filePath, content, 'utf8', err => {
      if (err) throw err;
      console.log(`The material version ${version} was set in the schematics file ${filePath}.`);
    });
  });
};

const setMaterialVersion = (configPath, schematicsFile) => {
  const version = readPackageVersion(configPath, '@angular/material');
  setSchematicsMaterialVersion(schematicsFile, version);
};

setMaterialVersion('package.json', '../../../dist/uoh/ngx-theme/schematics/ng-add/index.js');
