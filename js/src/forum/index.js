import app from 'flarum/forum/app';
import addComposerItems from './addComposerItems';

app.initializers.add('nodeloc/flarum-ext-read-permission', () => {
  console.log('[nodeloc/flarum-ext-read-permission] Hello, forum!');
  addComposerItems();
});
