import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class ReadFailedModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
  }

  className() {
    return 'ReadModal Modal--small';
  }

  title() {
    return (<div className="failedTitle">{app.translator.trans('nodeloc-read-permission.forum.read-failed')}</div>);
  }

  content() {
    //
    return (
      <div className="Modal-body">
        <div className="modalText">{app.translator.trans('nodeloc-read-permission.forum.read-failed-detail')}</div>
      </div>
    );
  }
}
