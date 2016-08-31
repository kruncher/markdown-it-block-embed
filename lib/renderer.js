// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


function renderer(tokens, idx, options, _env) {
  let videoToken = tokens[idx];

  let service = videoToken.info.service;
  let videoID = videoToken.info.videoID;
  let videoDimensionsInfo = videoToken.info.videoDimensionsInfo;

  return service.getEmbedCode(videoID, videoDimensionsInfo);
}


module.exports = renderer;
