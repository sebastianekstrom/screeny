import fs from 'fs'
import React, { Component } from 'react'
import { Box, Color, Text } from 'ink'
import puppeteer from 'puppeteer'
import { createValidURL, setFileName, openFile } from './utils'
import Status from './components/Status'

const DEFAULT_DIMENSIONS = {
  width: 800,
  height: 700,
}

class Screeny extends Component {
  state = {
    visiting: {
      inProgress: false,
      done: false,
      visible: false,
    },
    screenshot: {
      inProgress: false,
      done: false,
      visible: false,
      fileName: null,
    },
    delay: {
      inProgress: false,
      done: false,
      visible: false,
    },
    dimensions: {
      inProgress: false,
      done: false,
      visible: false,
    },
    done: false,
    error: false,
    url: null,
    page: null,
  }

  componentDidMount = async () => {
    if (!this.props.url && this.props.open) {
      return openFile()
    }

    if (!this.props.url) {
      return this.fail('Please provide a valid URL', '')
    }

    await this.run()
    this.props.onExit()
  }

  fail = (message, error) => {
    this.setState({
      error: message,
    })
    this.props.onExit()
    throw new Error(error)
  }

  gotoURL = async () => {
    const { url, page } = this.state

    this.setState({
      visiting: {
        inProgress: true,
        visible: true,
      },
    })

    try {
      await page.goto(url)
      this.setState({
        visiting: {
          done: true,
          inProgress: false,
        },
      })
    } catch (error) {
      this.fail(
        'Uh oh...something went wrong when visiting the page, please try again!',
        error,
      )
    }
  }

  takeScreenshot = async () => {
    const { page } = this.state
    const pageTitle = await page.title()
    const fileName = setFileName(pageTitle, this.props.fileName)
    const path = this.props.path ? `${this.props.path}/${fileName}` : fileName

    this.setState({
      screenshot: {
        inProgress: true,
        display: true,
      },
    })

    if (this.props.path && !fs.existsSync(this.props.path)) {
      fs.mkdirSync(this.props.path)
    }

    await page.screenshot({
      path: path,
      fullPage: !this.props.width && !this.props.height,
    })

    if (!fs.existsSync('./.tmp')) {
      fs.mkdirSync('./.tmp')
    }

    fs.writeFileSync('./.tmp/last_saved_image.txt', path)

    this.setState({
      screenshot: {
        inProgress: false,
        done: true,
        fileName: fileName,
      },
      done: true,
    })

    if (this.props.open) {
      openFile()
    }
  }

  setDelay = async () => {
    const { page } = this.state

    this.setState({
      delay: {
        inProgress: true,
        display: true,
      },
    })

    await page.waitFor(Number(this.props.delay))

    this.setState({
      delay: {
        inProgress: false,
        done: true,
      },
    })
  }

  setBrowserDimensions = async () => {
    const { width, height } = this.props

    this.setState({
      dimensions: {
        inProgress: true,
        display: true,
      },
    })

    await this.state.page.setViewport({
      width: width ? Number(width) : DEFAULT_DIMENSIONS.width,
      height: height ? Number(height) : DEFAULT_DIMENSIONS.height,
    })

    this.setState({
      dimensions: {
        inProgress: false,
        done: true,
      },
    })
  }

  run = () => {
    return puppeteer.launch().then(async browser => {
      const page = await browser.newPage()
      const url = createValidURL(this.props.url)

      this.setState({
        url: url,
        page: page,
      })

      await this.gotoURL()

      if (this.props.width || this.props.height) {
        await this.setBrowserDimensions()
      }

      if (this.props.delay) {
        await this.setDelay()
      }

      await this.takeScreenshot()
      await browser.close()
    })
  }

  render() {
    const { url } = this.props
    const { visiting, dimensions, delay, screenshot, done, error } = this.state

    return (
      <Box padding={2} flexDirection="column">
        <Status
          label="Visiting"
          value={createValidURL(url)}
          visible={visiting.visible}
          displaySpinner={visiting.inProgress}
        />

        <Status
          label="Setting browser size"
          value={`Width: ${this.props.width ||
            DEFAULT_DIMENSIONS.width}px, Height: ${this.props.height ||
            DEFAULT_DIMENSIONS.height}px`}
          visible={dimensions.visible}
          displaySpinner={dimensions.inProgress}
        />

        <Status
          label={`Waiting for ${this.props.delay}ms`}
          displaySpinner={delay.inProgress}
          visible={delay.visible}
          value={delay.done && 'Done!'}
        />

        <Status
          label="Taking a screenshot"
          displaySpinner={screenshot.inProgress}
          visible={screenshot.visible}
          value={screenshot.done && 'Done!'}
        />

        <Box marginTop={1}>
          <Status
            label={`Successfully saved ${screenshot.fileName}`}
            displaySpinner={!done}
            visible={done}
          />
        </Box>

        <Box marginTop={1}>
          <Status label="Run screeny --open to view the file" visible={done} />
        </Box>

        {error && (
          <Box>
            <Color red>{error}</Color>
          </Box>
        )}
      </Box>
    )
  }
}

export default Screeny
