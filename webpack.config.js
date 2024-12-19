export default {
	entry: './public/scripts/app/app.js',
	mode: 'production',
output: {
  publicPath: '/',
  path: path.resolve(__dirname, 'dist'), // Çıkış klasörü olarak dist kullanabilirsiniz
  filename: 'bundle.js'
},

};