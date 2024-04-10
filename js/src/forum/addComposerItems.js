import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import classList from 'flarum/common/utils/classList';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';

import CreateReadPermissionModal from './components/CreateReadPermissionModal';

export const addToComposer = (composer) => {
  composer.prototype.addReadPermission = function () {
    app.modal.show(CreateReadPermissionModal, {
      selectGroup: this.composer.fields.selectGroup,
      onsubmit: (selectGroup) => (this.composer.fields.selectGroup = selectGroup),
    });
  };

  // Add button to DiscussionComposer header
  extend(composer.prototype, 'headerItems', function (items) {
    const discussion = this.composer.body?.attrs?.discussion;
    items.add(
      'readPermission',
      <a className="ComposerBody-readPermission" onclick={this.addReadPermission.bind(this)}>
        <span className={classList('readPermissionLabel', !this.composer.fields.selectGroup && 'none')}>
          {app.translator.trans(`nodeloc-read-permission.forum.composer_discussion.${this.composer.fields.selectGroup ? 'edit' : 'add'}_readPermission`)}
        </span>
      </a>,
      4
    );

  });

  extend(composer.prototype, 'data', function (data) {
    if (this.composer.fields.selectGroup) {
      data.readPermission = this.composer.fields.selectGroup.data.attributes.readPermission;
    }
  });
};

export default () => {
  addToComposer(DiscussionComposer);
};
