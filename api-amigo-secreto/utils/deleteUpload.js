const path = require('path');
const fs = require('fs');

function deleteUpload(webPath) {
  try {
    if (!webPath) return;

    const urlPath = webPath.startsWith('/') ? webPath : '/' + webPath;

    if (!urlPath.startsWith('/uploads')) return;

    const abs = path.resolve(__dirname, '../../frontend/public' + urlPath);

    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (error) {
    return error;
  }
}

module.exports = { deleteUpload };
