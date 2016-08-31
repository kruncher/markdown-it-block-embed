// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


function defaultUrlFilter(url, _videoID, _serviceName, _options) {
  return url;
}


class VideoServiceBase {

  constructor(name, options, env) {
    this.name = name;
    this.options = Object.assign(this.getDefaultOptions(), options);
    this.env = env;
  }

  getDefaultOptions() {
    return {};
  }

  extractVideoID(reference) {
    return reference;
  }

  getVideoUrl(_videoID) {
    throw new Error("not implemented");
  }

  getFilteredVideoUrl(videoID) {
    let filterUrlDelegate = typeof this.env.options.filterUrl === "function"
        ? this.env.options.filterUrl
        : defaultUrlFilter;
    let videoUrl = this.getVideoUrl(videoID);
    return filterUrlDelegate(videoUrl, this.name, videoID, this.env.options);
  }

  getEmbedCode(videoID, videoDimensionsInfo) {
    let containerClassNames = [ ];
    if (this.env.options.containerClassName) {
      containerClassNames.push(this.env.options.containerClassName);
    }
    // config for 'viewport' element
    const mediaViewportClassName = `${this.env.options.containerClassName}__viewport`;
    let mediaViewportExists = false;
    const mediaViewportAttributeList = [];

    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
    containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);

    let iframeAttributeList = [];
    iframeAttributeList.push([ "type", "text/html" ]);
    iframeAttributeList.push([ "src", this.getFilteredVideoUrl(videoID) ]);
    iframeAttributeList.push([ "frameborder", 0 ]);

    // collect default player dimensions from config and allow override from player instance, if available
    let playerWidth = videoDimensionsInfo.Width || this.options.width;
    let playerHeight = videoDimensionsInfo.Height || this.options.height;
    // ouptut width and height if we are configured to do so (and values are valid)
    if (this.env.options.outputPlayerSize === true && (playerWidth || playerHeight)) {
      if (playerWidth !== undefined && playerWidth !== null) {
        iframeAttributeList.push([ "width", playerWidth ]);
      }
      if (playerHeight !== undefined && playerHeight !== null) {
        iframeAttributeList.push([ "height", playerHeight ]);
      }
    } else if (this.env.options.outputPlayerAspectRatio === true) {
      // output aspect ratio on media viewport element if we are configured to do so
      // get explicit aspect ratio
      let aspectRatio = videoDimensionsInfo.AspectRatio;
      if (!aspectRatio && playerWidth && playerHeight) {
        // calculate aspect ratio from dimensions
        aspectRatio = (playerHeight / playerWidth) * 100;
      }
      // only proceed if we have aspect ratio data
      if (aspectRatio) {
        // need extra container
        mediaViewportExists = true;
        // aspect ratio is achieved with padding and must go hand-in-hand with other styles (e.g. absolute positioning)
        mediaViewportAttributeList.push([ "style", `padding-top: ${aspectRatio}%` ]);
      }
    }

    if (this.env.options.allowFullScreen === true) {
      iframeAttributeList.push([ "webkitallowfullscreen" ]);
      iframeAttributeList.push([ "mozallowfullscreen" ]);
      iframeAttributeList.push([ "allowfullscreen" ]);
    }

    let iframeAttributes = iframeAttributeList
      .map(pair =>
        pair[1] !== undefined
            ? `${pair[0]}="${pair[1]}"`
            : pair[0]
      )
      .join(" ");

    const mediaViewportAttributes = mediaViewportAttributeList
      .map(pair =>
        pair[1] !== undefined
            ? `${pair[0]}="${pair[1]}"`
            : pair[0]
      )
      .join(" ");

    return `<div class="${containerClassNames.join(" ")}">`
            + (mediaViewportExists ? `<div class="${mediaViewportClassName}" ${mediaViewportAttributes}>` : "")
            + `<iframe ${iframeAttributes}></iframe>`
           + (mediaViewportExists ? `</div>` : "")
         + `</div>\n`;
  }

}


module.exports = VideoServiceBase;
