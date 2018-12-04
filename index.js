#!/usr/bin/env node

const meow = require("meow");
const run = require("./src/run");

const cli = meow(
  `
    Usage
      $ foo <input>
 
    Options
      --width, -w  Browser width
      --height, -h  Browser height
      --path, Path to where the screenshot will be saved
      --filename, Name of the saved file, defaults to page title
      --filetype, Format of the saved file, either 'png' or 'jpeg'. Defaults to 'png'
      --delay, Delay in miliseconds before taking a screenshot
      --emulate, Emulates a device viewport and useragent
      --list-emulators, Lists all supported emulators
 
    Examples
      $ foo https://example.com
      $ foo https://example.com --path /Users/foobar --filename MyScreenshot --delay 500
      $ foo https://example.com --emulate "iPhone 4"
`,
  {
    version: "0.1.0",
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
      }
    }
  }
);

run(cli.input[0], cli.flags);
