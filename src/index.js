#!/usr/bin/env node
import React from 'react'
import meow from 'meow'
import { render } from 'ink'
import updateNotifier from 'update-notifier'

import screeny from './screeny'

// Notify updater
const pkg = require(`../package.json`)

updateNotifier({ pkg }).notify()

const cli = meow(
  `
    Usage
      $ screeny <url> <options>

    Options
      --width, -w  Browser width. If neither width or height are set, a full size screenshot will be taken
      --height, -h  Browser height. If neither width or height are set, a full size screenshot will be taken
      --path, Path to where the screenshot will be saved
      --fileName, Name of the saved file, defaults to page title
      --delay, Delay in miliseconds before taking a screenshot
      --open, Open the screenshot

    Examples
      $ screeny example.com
      $ screeny example.com --path /Users/foobar --filename MyScreenshot --delay 500
      $ screeny --open
`,
  {
    flags: {
      width: {
        type: 'string',
        alias: 'w',
      },
      height: {
        type: 'string',
        alias: 'h',
      },
      path: {
        type: 'string',
      },
      fileName: {
        type: 'string',
      },
      delay: {
        type: 'string',
      },
      open: {
        type: 'boolean',
      },
    },
  },
)

const main = () => {
  const onExit = () => {
    process.exit()
  }
  const { width, height, path, fileName, delay, open } = cli.flags
  const url = cli.input[0]

  // Uses `React.createElement` instead of JSX to avoid transpiling this file
  render(
    React.createElement(screeny, {
      url,
      onExit,
      delay,
      width,
      height,
      path,
      fileName,
      open,
    }),
  )
}

main()
