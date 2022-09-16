// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: [
//     'vuetify'
//   ]
// })

module.exports = {
  productionSourceMap: false,  
  outputDir: '../dist',
  assetsDir: 'static',
  indexPath: 'public/index.html'
};