import glob from 'glob'
import path from 'path'
import { srcRoot, pagePath, componentPath } from './config.mjs'
const { join } = path

const getEntriesByPath = dirPath => {
  return glob
    .sync('*/', {
      cwd: join(srcRoot, dirPath)
    })
    .reduce((entries, dir) => {
      const js = glob.sync(join(dirPath, dir, '*.js'), {
        cwd: srcRoot
      })
      if (js.length === 1) {
        return Object.assign(entries, {
          [join(dirPath, dir, dir).replace( (process.platform === 'win32' ?  /\\$/ : /\/$/) , '')]: js[0]
        })
      } else {
        console.log(
          `-- The directory of ${join(dirPath, dir)} must be unique --`
        )
        return entries
      }
    }, {})
}

export default {
  entries: Object.assign(
    {
      app: './src/app.js'
    },
    getEntriesByPath(pagePath),
    getEntriesByPath(componentPath)
  )
}