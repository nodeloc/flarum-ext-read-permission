<?php

namespace Nodeloc\ReadPermission\Listeners;

use Flarum\Discussion\Event\Saving;

class SaveReadPermissionToDiscussion
{
     /**
     * @param Saving $event
     */
    public function handle(Saving $event)
    {
        if (isset($event->data['attributes']['readPermission'])) {
            $discussion = $event->discussion;
            $discussion->read_permission = $event->data['attributes']['readPermission'];
        }
    }
}
