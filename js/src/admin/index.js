import app from 'flarum/admin/app';
import {extend} from 'flarum/common/extend';
import EditGroupModal from "flarum/admin/components/EditGroupModal";
import Model from "flarum/common/Model";
import Group from "flarum/common/models/Group";
app.initializers.add('nodeloc/flarum-ext-read-permission', () => {
  Group.prototype.readPermission = Model.attribute('readPermission');
  extend(EditGroupModal.prototype, 'fields', function(items) {
    this.readPermission = this.group.readPermission() || '';
    // add item before hidden label and after icon
    items.replace('hidden', null, 5);
    items.add(
      'readPermission',
      <div className="Form-group">
        <label>{app.translator.trans('nodeloc-read-permission.admin.readPermission')}</label>
        <div className="helpText">
          {app.translator.trans('nodeloc-read-permission.admin.readPermissionHelper')}
        </div>
        <input className="FormControl"
          name="readPermission"
          type="number"
          placeholder='0'
          value={this.group.readPermission()}
        />
      </div>,
      10
    );
  });
  extend(EditGroupModal.prototype, 'submitData', function(data) {
    data.readPermission = $('input[name="readPermission"]').val();
  });

});
