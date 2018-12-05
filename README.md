# screeny

Take screenshots directly from your terminal! Created with [Puppeteer](https://github.com/GoogleChrome/puppeteer).

## Installation

Run the following command:

```
yarn global add screeny
```

## Usage

### Taking a screenshot

```
screeny example.com
```

### Options

```
screeny example.com --path ~/Desktop/images --filename screenshot --delay 500
```

### Available options

```
--width, -w,  Browser width
--height, -h,  Browser height
--path, Path to where the screenshot will be saved
--filename, Name of the saved file, defaults to page title
--filetype, Format of the saved file, either 'png' or 'jpeg'. Defaults to 'png'
--delay, Delay in miliseconds before taking a screenshot
--emulate, Emulates a device viewport and useragent
--list-emulators, Lists all supported emulators
```

## License

This project is licensed under the MIT License
