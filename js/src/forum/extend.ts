import app from 'flarum/forum/app';
import Extend from 'flarum/common/extenders';
import Discussion from 'flarum/common/models/Discussion';

export default [

  new Extend.Model(Discussion) //
    .attribute<number>('readPermission'),
  
];
