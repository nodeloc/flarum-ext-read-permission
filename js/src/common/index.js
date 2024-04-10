import app from 'flarum/common/app';

app.initializers.add('nodeloc/flarum-ext-read-permission', () => {
  console.log('[nodeloc/flarum-ext-read-permission] Hello, forum and admin!');
});
