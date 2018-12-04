const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const supportedEmulators = require("./emulators");
const { info, success, error } = require("./logger");

module.exports = (url, flags) => {
  if (!url) {
    process.exit(
      console.log(
        "Please prove an URL. E.g $ screenshot-cli http:www.example.com. Type screenshot-cli --help for more options"
      )
    );
  }

  if (flags.listEmulators) {
    process.exit(
      supportedEmulators.forEach(emulator => {
        return info(emulator);
      })
    );
  }

  takeScreenshot(url, flags);
};

const takeScreenshot = (url, flags) => {
  puppeteer.launch().then(async browser => {
    const page = await browser.newPage();

    if ((flags.width || flags.height) && flags.emulate) {
      process.exit(
        error("❌ You can't pass width or height when emulating a device")
      );
    }

    if (flags.width && flags.height) {
      await page.setViewport({
        width: Number(flags.width),
        height: Number(flags.height)
      });
    }

    if (flags.emulate) {
      if (emulationDeviceIsValid(flags.emulate)) {
        await page.emulate(devices[flags.emulate]);
      } else {
        process.exit(
          error(
            "❌ Please provide a valid emulation device, remember to wrap it around quotes. Type screenshot --list-emulators for all supported devices"
          )
        );
      }
    }

    info(`🚚 Visiting ${url}`);

    await page.goto(url);

    if (flags.delay) {
      info(`⏰ Waiting for ${flags.delay}ms`);
      await page.waitFor(Number(flags.delay));
    }

    info(`📸 Taking screenshot`);

    const pageTitle = await page.title();
    const fileType = flags.filetype;
    const fileName = flags.filename
      ? `${flags.filename}.${fileType}`
      : `${pageTitle}_${flags.emulate || ""}.${fileType}`;

    const path = flags.path ? `${flags.path}/${fileName}` : fileName;

    await page.screenshot({
      path: path,
      type: fileType,
      fullPage: !flags.width && !flags.height
    });

    success(`🎉 Successfully saved ${fileName}`);
    await browser.close();
  });
};

const emulationDeviceIsValid = device => {
  return supportedEmulators.includes(device);
};
