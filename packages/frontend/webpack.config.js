module.exports = (environment) =>
  require(`./webpack/webpack.config.${environment}.js`);
