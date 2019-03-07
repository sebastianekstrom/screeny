import fs from 'fs'
import cmd from 'node-cmd'

export const createValidURL = url => {
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    return `https://${url}`
  }

  return url
}

export const setFileName = (pageTitle, fileName) => {
  const name = fileName ? `${fileName}.png` : `${pageTitle}.png`
  return name.replace(/\s/g, '_').replace(/[^A-Za-z._]/g, '')
}

export const openFile = () => {
  try {
    const path = fs.readFileSync('./.tmp/last_saved_image.txt', 'utf8')
    cmd.run(`open ${path}`)
  } catch (e) {
    process.exit(
      error(
        "Couldn't find the screenshot. Please make sure to take a screenshot before running this command.",
      ),
    )
  }
}
