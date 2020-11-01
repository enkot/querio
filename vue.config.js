module.exports = {
  pages: {
    devtools: {
      template: 'public/browser-extension.html',
      entry: './src/devtools/main.js',
      title: 'Devtools'
    }
  },
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        devtools: true
      },
      componentOptions: {
        devtools: {
          entry: 'src/devtools/main.js'
        },
        background: {
          entry: 'src/background.js'
        }
      }
    }
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
}
