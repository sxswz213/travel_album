module.exports = {
  chainWebpack: config => {
    config.module
      .rule('audio')
      .test(/\.(mp3|m4a|wav|flac|ogg)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'media/[name].[hash:8].[ext]'
      });
  },
  lintOnSave:false
}