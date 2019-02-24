const path = require(`path`);

module.exports = {
  mode: `development`, // Режим сборки
  entry: `./src/main.js`, // Точка входа приложения
  output: { // Настройка выходного файла
    filename: `bundle.js`,
    path: path.join(_dirname, `public`)
  },
  devtool: `source-map`,
  module: { // Расширяем функциональность лоадерами
    rules: [{
      test: /\.js$/, // Проверка типов файлов, над которыми будет работать лоадерами
      use: `babel-loader` // Лоадер, который будет применен
    }]
  },
  devServer: {
    contentBase: path.join(_dirname, `public`), // Где искать сборку
    publicPath: `http://localhost:8080/`, // Веб адрес сборки
    hot: true, // Автоматическая перезагрузка страницы
    compress: true // Сжатие
  }
};
