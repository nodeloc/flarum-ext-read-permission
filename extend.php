<?php

/*
 * This file is part of nodeloc/flarum-ext-read-permission.
 *
 * Copyright (c) 2024 Nodeloc.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Nodeloc\ReadPermission;

use Flarum\Api\Serializer\GroupSerializer;
use Flarum\Extend;
use Flarum\Group\Group;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),
    new Extend\Locales(__DIR__ . '/locale'),
    (new Extend\Event())
        ->listen(\Flarum\Group\Event\Saving::class, Listeners\SaveReadPermissionToDatabase::class)
        ->listen(\Flarum\Discussion\Event\Saving::class, Listeners\SaveReadPermissionToDiscussion::class),
    (new Extend\ApiSerializer(GroupSerializer::class))
        ->attribute('readPermission', function (GroupSerializer $serializer, Group $group) {
            return $group->read_permission;
        }),
    (new Extend\Settings())
        ->default('nodeloc-read-permission.group', Group::MEMBER_ID),
];
