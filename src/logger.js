const chalk = require("chalk");

module.exports = {
  error: (...args) => console.error(chalk.red.bold(...args)),
  log: (...args) => console.log(chalk.white(...args)),
  info: (...args) => console.info(chalk.blue.bold(...args)),
  success: (...args) => console.info(chalk.green(...args))
};
