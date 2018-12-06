# screeny

Take screenshots directly from your terminal! Created with [Puppeteer](https://github.com/GoogleChrome/puppeteer).

![CLI](https://user-images.githubusercontent.com/1921046/49611714-af8be800-f9a2-11e8-9210-d485c8d3f9f0.gif)

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
--open, Open the screenshot
```

### View the screenshot

To view the screenshot after it's taken, pass the `--open` flag:

```
screeny example.com --open
```

You can also run this command directly after taking a screenshot and `screeny` will open the last screenshot you've taken:

```
screeny example.com
screeny --open
```

## License

This project is licensed under the MIT License
