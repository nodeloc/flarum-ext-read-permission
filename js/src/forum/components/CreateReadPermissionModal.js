import app from 'flarum/forum/app';

import Button from 'flarum/common/components/Button';
import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import Select from "flarum/common/components/Select";
import Dropdown from 'flarum/common/components/Dropdown';
import icon from 'flarum/common/helpers/icon';
import Group from 'flarum/common/models/Group';

export default class CreateReadPermissionModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    if(this.attrs.selectGroup){
      this.group = this.attrs.selectGroup;
    }else{
      this.group = app.store.getById('groups', Group.MEMBER_ID);
    }
  }

  title() {
    return app.translator.trans('nodeloc-read-permission.forum.modal.add_title');
  }

  className() {
    return 'ReadPermissionDiscussionModal Modal--medium';
  }

  content() {
    return [
      <div className="Modal-body">
        <div className="ReadPermissionDiscussionModal-form">{this.fields().toArray()}</div>
      </div>,
    ];
  }

  fields() {
    const items = new ItemList();
    const icons = {
      3: 'fas fa-user',
    };
    items.add(
      'readPermission',
      <div className="Form-group">
        <label
          className="label">{app.translator.trans('nodeloc-read-permission.forum.modal.readPermission_placeholder')}</label>
        <Dropdown label={[icon(this.group.icon() || icons[this.group.id()]), '\t', this.group.namePlural(), ' - ', this.group.data.attributes.readPermission]} buttonClassName="Button Button--danger">
        {app.store
          .all('groups')
          .filter((g) => g.id() != 2)
          .sort((a, b) => a.data.attributes.readPermission - b.data.attributes.readPermission)
          .map((g) =>
            Button.component(
              {
                active: this.group.id() === g.id(),
                icon: g.icon() || icons[g.id()],
                onclick: () => {
                  this.group = g; // 更新 group 的值为当前被点击的组
                },
              },
              [g.namePlural(), ' - ', g.data.attributes.readPermission] // 在组名和 read_permission 之间添加文字
              )
          )}
        </Dropdown>
      </div>,
      100
    );

    items.add(
      'submit',
      <div className="Form-group">
        {Button.component(
          {
            type: 'submit',
            className: 'Button Button--primary ReadPermissionModal-SubmitButton',
            loading: this.loading,
          },
          app.translator.trans('nodeloc-read-permission.forum.modal.submit')
        )}
      </div>,
      -10
    );
    return items;
  }

  onsubmit(e) {
    e.preventDefault();

    const data = this.group;

    if (data === null) {
      return;
    }
    const promise = this.attrs.onsubmit(data);

    if (promise instanceof Promise) {
      this.loading = true;

      promise.then(this.hide.bind(this), (err) => {
        console.error(err);
        this.onerror(err);
        this.loaded();
      });
    } else {
      app.modal.close();
    }
  }
}
