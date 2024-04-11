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

use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\GroupSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend;
use Flarum\Group\Group;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;

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
    
    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->attribute('readPermission', function (DiscussionSerializer $serializer, $model) {
            return $model->read_permission;
        }),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->attribute('readPermission', function (PostSerializer $serializer, Post $post) {
            return $post->discussion->read_permission;
        }),

    (new Extend\ApiSerializer(CurrentUserSerializer::class))
        ->attributes(Attributes\ReadPermissionAttribute::class),

    (new Extend\Settings())
        ->default('nodeloc-read-permission.group', Group::MEMBER_ID),
];
