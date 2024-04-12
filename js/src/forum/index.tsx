import app from 'flarum/forum/app';
import {extend, override} from 'flarum/extend';
import Link from 'flarum/common/components/Link';
import listItems from 'flarum/common/helpers/listItems';
import highlight from 'flarum/common/helpers/highlight';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import Post from 'flarum/forum/components/Post';
import type Mithril from 'mithril';
import addDiscussionBadge from './addDiscussionBadge';

import addComposerItems from './addComposerItems';
import ReadFailedModal from './components/ReadFailedModal';

export {default as extend} from './extend';

app.initializers.add('nodeloc/flarum-ext-read-permission', () => {
  addDiscussionBadge();
  // console.log('[nodeloc/flarum-ext-read-permission] Hello, forum!');
  addComposerItems();

  // detect link permission
  // index, discussion list, filter result
  override(DiscussionListItem.prototype, 'mainView', function (): Mithril.Children {
    const discussion = this.attrs.discussion;

    //detect discussion read permission
    let showPermissionModal = false;
    if (discussion.attribute('readPermission') > 0 && app.session?.user) {
      // writer or admin
      // tips: need to give moderator high permission
      showPermissionModal = true;
      if (app.session?.user?.isAdmin() || app.session.user! === discussion.user()) {
        showPermissionModal = false;
      }
      // check user permission
      if (parseInt(app.session.user!.attribute('read_permission')) >= discussion.attribute('readPermission')) {
        showPermissionModal = false;
      }
    }

    this.permissionModal = function (e) {
      e.preventDefault();
      // solution1: modal box
      app.modal.show(ReadFailedModal, {readPermission: discussion.attribute('readPermission')});
    }

    if (showPermissionModal) {
      return (
        <a href='javacript:void();' onclick={this.permissionModal.bind(this)} className="DiscussionListItem-main">
          <h2 className="DiscussionListItem-title">{highlight(discussion.title(), this.highlightRegExp)}</h2>
          <ul className="DiscussionListItem-info">{listItems(this.infoItems().toArray())}</ul>
        </a>
      );

    } else {
      const jumpTo = this.getJumpTo();
      return (
        <Link href={app.route.discussion(discussion, jumpTo)} className="DiscussionListItem-main">
          <h2 className="DiscussionListItem-title">{highlight(discussion.title(), this.highlightRegExp)}</h2>
          <ul className="DiscussionListItem-info">{listItems(this.infoItems().toArray())}</ul>
        </Link>
      );
    }
  });

  //DiscussionPage
  override(DiscussionPage.prototype, 'view', function (this: DiscussionPage, originalFunc: () => Mithril.Children): Mithril.Children {

    this.detectPermission = function (): boolean {
      const discussion = this.discussion;

      if (!discussion) return;

      let showPermissionModal = false;

      if (discussion.attribute('readPermission') > 0) {
        // writer or admin
        // tips: need to give moderator high permission
        showPermissionModal = true;
        if (app.session?.user?.isAdmin() || app.session.user! === discussion.user()) {
          showPermissionModal = false;
        }
        // check user permission
        if (app.session && app.session.user && parseInt(app.session.user!.attribute('read_permission')) >= discussion.attribute('readPermission')) {
          showPermissionModal = false;
        }
        return showPermissionModal;
      }
    }

    if (this.detectPermission()) {
      return (
        <div className="DiscussionPage">
          <div className="DiscussionPage-discussion">
            <header class="Hero DiscussionHero DiscussionHero--colored text-contrast--dark">
              <div class="container">
                <ul class="DiscussionHero-items">
                  <li class="item-title">
                    <h1
                      class="DiscussionHero-title">{app.translator.trans('nodeloc-read-permission.forum.low-permission')} 本帖需要权限 >= {this.discussion.attribute('readPermission')}.</h1>
                  </li>
                </ul>
              </div>
            </header>
          </div>
        </div>
      );
    } else {
      return originalFunc();
    }

  });


  override(Post.prototype, 'view', function (this: Post, originalFunc) {
    // console.log(this.attrs.post);
    if (this.attrs.post) {
      const discussion = this.attrs.post.discussion();
      let needPermission = false;
      if (this.attrs.post.attribute('readPermission') > 0) {
        // writer or admin
        // tips: need to give moderator high permission
        needPermission = true;
        if (app.session?.user?.isAdmin() || app.session.user! === discussion.user()) {
          needPermission = false;
        }
        // check user permission
        if ( app.session && app.session.user && parseInt(app.session.user!.attribute('read_permission')) >= this.attrs.post.attribute('readPermission')) {
          needPermission = false;
        }
      }

      if (needPermission) {
        return app.translator.trans('nodeloc-read-permission.forum.low-permission');
      } else {
        return originalFunc();
      }
    }

  });

});
