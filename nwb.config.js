module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },

  webpack: {
    loaders: {
      css: {
        query: {
          modules: true,
          localIdentName: '[hash:base64:5]'
        }
      }
    }
  }
}
