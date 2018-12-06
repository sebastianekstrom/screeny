const fs = require("fs");
const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const cmd = require("node-cmd");

const supportedEmulators = require("./emulators");
const { info, success, error } = require("./logger");

module.exports = (url, flags) => {
  if (!url && flags.open) {
    return openFile();
  }

  if (flags.listEmulators) {
    process.exit(
      supportedEmulators.forEach(emulator => {
        return info(emulator);
      })
    );
  }

  if (!url) {
    process.exit(
      error(
        "You need to provide an URL, e.g screeny http:www.example.com. Type screeny --help for more info."
      )
    );
  }

  takeScreenshot(url, flags);
};

const takeScreenshot = (pageURL, flags) => {
  puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    const url = createValidURL(pageURL);

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
            "❌ Please provide a valid emulation device, remember to wrap it around quotes. Type screeny --list-emulators for all supported devices"
          )
        );
      }
    }

    info(`🚚 Visiting ${url}`);

    try {
      await page.goto(url);
    } catch (e) {
      process.exit(
        error(
          "Uh oh...something went wrong when visiting the page, please try again!"
        )
      );
    }

    if (flags.delay) {
      info(`⏰ Waiting for ${flags.delay}ms`);
      await page.waitFor(Number(flags.delay));
    }

    info(`📸 Taking screenshot`);

    const pageTitle = await page.title();
    const fileName = setFileName(pageTitle, flags);

    const path = flags.path ? `${flags.path}/${fileName}` : fileName;

    await page.screenshot({
      path: path,
      type: flags.filetype,
      fullPage: !flags.width && !flags.height
    });

    const imagePath = `${flags.path ? flags.path : process.cwd()}`;

    success(`🎉 Successfully saved ${fileName} to ${imagePath}`);

    if (!fs.existsSync("./.tmp")) {
      fs.mkdirSync("./.tmp");
    }

    fs.writeFileSync("./.tmp/last_saved_image.txt", `${imagePath}/${fileName}`);

    await browser.close();

    if (flags.open) {
      openFile();
    } else {
      success(`🖼  Run screeny --open to view the file`);
    }
  });
};

const setFileName = (pageTitle, flags) => {
  const name = flags.filename
    ? `${flags.filename}.${flags.filetype}`
    : `${pageTitle}.${flags.filetype}`;

  return name.replace(/\s/g, "_").replace(/[^A-Za-z._]/g, "");
};

const emulationDeviceIsValid = device => {
  return supportedEmulators.includes(device);
};

const createValidURL = url => {
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
};

const openFile = () => {
  try {
    const path = fs.readFileSync("./.tmp/last_saved_image.txt", "utf8");
    cmd.run(`open ${path}`);
  } catch (e) {
    process.exit(
      error(
        "Couldn't find the screenshot. Please make sure to take a screenshot before running this command."
      )
    );
  }
};
