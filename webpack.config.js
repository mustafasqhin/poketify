const path = require('path'); // Eğer ES module kullanıyorsanız: import path from 'path';

export default {
  entry: './public/scripts/app/app.js', // Giriş dosyanız
  mode: 'production', // Üretim modu
  output: {
    publicPath: '/',
    path: path.resolve(process.cwd(), 'public/scripts/app/bundle'), // Çıkış dizini
    filename: 'bundle.js' // Çıkış dosyasının adı
  },
};
