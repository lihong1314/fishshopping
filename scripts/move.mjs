import path from 'path'
import fs from 'fs-extra'

const sourceDir = path.resolve(path.dirname(''), 'lib')
const distDir = path.resolve(path.dirname(''), 'examples/lib')

export default () => {
  console.log('---- copy finished ----')
  fs.copySync(sourceDir, distDir)
}
