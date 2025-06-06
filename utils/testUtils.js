
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const tmp = require('tmp');

function renameFileTo(oldPath, newFilename, extension = '') {
  const projectPath = path.dirname(oldPath);
  const newPath = path.join(projectPath, newFilename + extension);
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.renameSync(oldPath, newPath);
  return newPath;
}

function createTempFileWith(content, filename, extension) {
  const info = tmp.fileSync({ postfix: extension });
  let filePath = info.name;
  fs.writeSync(info.fd, content);
  fs.closeSync(info.fd);
  if (filename) {
    filePath = renameFileTo(filePath, filename, extension);
  }
  return filePath;
}
exports.createTempFileWith = createTempFileWith;

// Test transform files need a js extension to work with @babel/register
// .ts or .tsx work as well
function createTransformWith(content, ext='.js') {
  return createTempFileWith(
    'module.exports = function(fileInfo, api, options) { ' + content + ' }',
    undefined,
    ext
  );
}
exports.createTransformWith = createTransformWith;

function getFileContent(filePath) {
  return fs.readFileSync(filePath).toString();
}
exports.getFileContent = getFileContent;
