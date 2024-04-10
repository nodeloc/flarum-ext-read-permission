<?php

namespace Nodeloc\ReadPermission\Listeners;

use Flarum\Group\Event\Saving;
use Illuminate\Support\Arr;

class SaveReadPermissionToDatabase
{
    private $key = 'attributes.readPermission';
    public function handle(Saving $event)
    {
        if (!Arr::has($event->data, $this->key)) {
            return;
        }

        $read_permission = Arr::get($event->data, $this->key);

        if (strlen(trim($read_permission)) == 0) {
            $read_permission = NULL;
        }

        $group = $event->group;

        $group->read_permission = $read_permission;
        $group->save();
    }
}
