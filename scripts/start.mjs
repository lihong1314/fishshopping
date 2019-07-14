import webpack from 'webpack'
import config from '../webpack.config.dev'
// import move from './move'

const compiler = webpack(config())

compiler.watch({}, (err, stats) => {

  // move()
  console.log(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }))

})
