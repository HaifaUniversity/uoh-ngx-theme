const path = require('path');
const fs = require('fs');
const copy = require('./copy');

const SRC_DIR = 'projects/uoh/ngx-theme/src/lib';
const DEST_DIR = 'dist/uoh/ngx-theme';
const DEST_PATH = path.resolve(DEST_DIR, 'theme');

if (!fs.existsSync(DEST_PATH)) {
  fs.mkdirSync(DEST_PATH);
}

copy(path.resolve(SRC_DIR, 'theme'), DEST_PATH);
fs.copyFileSync(path.resolve(SRC_DIR, '_theme.scss'), path.resolve(DEST_DIR, '_theme.scss'));
