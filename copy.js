const fs = require('fs');
const path = require('path');

module.exports = (src, dest) => {
  const copy = (src, dest) => {
    const files = fs.readdirSync(src);
    files.forEach(file => {
      const filePath = src + path.sep + file;
      const destPath = dest + path.sep + file;
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          console.log('Creating folder: ' + destPath);
          fs.mkdirSync(destPath);
        }
        copy(filePath, destPath);
      } else {
        try {
          console.log('Copying file: ' + destPath);
          fs.copyFileSync(filePath, destPath);
        } catch (e) {
          console.warn("Could't copy the file: " + destPath);
        }
      }
    });
  };

  copy(src, dest);
};
