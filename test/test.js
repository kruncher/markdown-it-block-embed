// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

const path = require("path");
const generate = require("markdown-it-testgen");

const CustomService = require("./fakes/CustomService");


function setupMarkdownIt() {
  return require("markdown-it")({
    html: true,
    linkify: true,
    typography: true
  });
}

function testFixture(fixtureName, options) {
  let md = setupMarkdownIt().use(require("../lib"), options);
  generate(path.join(__dirname, `fixtures/${fixtureName}.txt`), md);
}

function testFixtureWithExampleService(fixtureName, options) {
  let vanillaOptions = {
    services: {
      // Testing with fake service to avoid coupling with specific services.
      "example": CustomService
    }
  };
  testFixture(fixtureName, Object.assign({}, vanillaOptions, options));
}


describe("markdown-it-video", function () {

  describe("vanilla embed tag syntax", function () {
    testFixtureWithExampleService("tag-syntax");
  });

  describe("with custom class names", function () {
    testFixtureWithExampleService("custom-class-names", {
      containerClassName: "custom-container",
      serviceClassPrefix: "custom-container--service-"
    });
  });

  describe("without size attributes", function () {
    testFixtureWithExampleService("without-size-attributes", {
      example: { width: 123, height: 456 },
      outputPlayerSize: false
    });
  });

  describe("without allowfullscreen attributes", function () {
    testFixtureWithExampleService("without-allowfullscreen-attributes", {
      allowFullScreen: false
    });
  });

  describe("with filtered url", function () {
    testFixtureWithExampleService("filtered-url", {
      filterUrl: (url, serviceName, videoID, options) => `${url}?a=${serviceName}&b=${videoID}&c=${options.containerClassName}`
    });
  });

  describe("with instance size attributes", function () {
    testFixtureWithExampleService("instance-size-attributes", {
      allowFullScreen: true,
      allowInstancePlayerSizeDefinition: true
    });
  });

  describe("providing custom services", function () {
    testFixture("custom-service", {
      services: {
        "custom": CustomService,
        "youtube": CustomService
      },
      custom: {
        magicNumber: 123
      }
    });
  });

  for (let serviceName of [ "prezi", "vimeo", "vine", "youtube" ]) {
    describe(`service: ${serviceName}`, function () {
      testFixture(`services/${serviceName}`);
    });
  }

});
