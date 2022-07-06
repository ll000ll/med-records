const fs = require("fs")

const fileSweeper = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err
      })
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  fileSweeper,
}
