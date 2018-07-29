const path = require('path');
const fs = require('fs');
const copy = require('./copy');

const SRC_DIR = 'projects/uoh/ngx-theme/src/assets';
const DEST_DIR = 'dist/uoh/ngx-theme/assets';
const SRC_PATH = path.resolve(SRC_DIR);
const DEST_PATH = path.resolve(DEST_DIR);

if (!fs.existsSync(DEST_PATH)) {
  fs.mkdirSync(DEST_PATH);
}

copy(SRC_PATH, DEST_PATH);
