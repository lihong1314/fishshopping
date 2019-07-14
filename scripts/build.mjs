import webpack from 'webpack'
import config from '../webpack.config.prod'
// const move = require('./move')

webpack(config(), (err, stats) => {
  // move()
  console.log(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }),
    '打包完成'
  )
})
