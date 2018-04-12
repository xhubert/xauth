'use strict';

const shortUuid = require('short-uuid');
const translator = shortUuid(shortUuid.constants.flickrBase58);

module.exports = {
  shortId: () => {
    const result = translator.new();
    return result;
  },
};
