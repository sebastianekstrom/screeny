#!/usr/bin/env node

const meow = require("meow");
const run = require("./src/run");
const pJson = require("./package.json");

const cli = meow(
  `
    Usage
      $ screeny <url> <options>

    Options
      --width, -w  Browser width. If neither width or height are set, a full size screenshot will be taken
      --height, -h  Browser height. If neither width or height are set, a full size screenshot will be taken
      --path, Path to where the screenshot will be saved
      --filename, Name of the saved file, defaults to page title
      --filetype, Format of the saved file, either 'png' or 'jpeg'. Defaults to 'png'
      --delay, Delay in miliseconds before taking a screenshot
      --emulate, Emulates a device viewport and useragent
      --list-emulators, Lists all supported emulators
      --open, Open the screenshot

    Examples
      $ screeny example.com
      $ screeny example.com --path /Users/foobar --filename MyScreenshot --delay 500
      $ screeny example.com --emulate "iPhone 4"
      $ screeny --open
`,
  {
    version: `${pJson.version}`,
    flags: {
      width: {
        type: "string",
        alias: "w"
      },
      height: {
        type: "string",
        alias: "h"
      },
      path: {
        type: "string"
      },
      filename: {
        type: "string"
      },
      filetype: {
        type: "string",
        default: "png"
      },
      delay: {
        type: "string"
      },
      emulate: {
        type: "string"
      },
      listEmulators: {
        type: "boolean"
      },
      open: {
        type: "boolean"
      }
    }
  }
);

run(cli.input[0], cli.flags);
