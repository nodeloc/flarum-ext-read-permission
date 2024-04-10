<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('groups', 'read_permission')) {
            $schema->table('groups', function (Blueprint $table) {
                $table->integer('read_permission')->nullable()->default(0);
            });
        };
        if (!$schema->hasColumn('discussions', 'read_permission')) {
            $schema->table('discussions', function (Blueprint $table) {
                $table->integer('read_permission')->nullable()->default(0);
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->table('groups', function (Blueprint $table) {
            $table->dropColumn('read_permission');
        });
        $schema->table('discussions', function (Blueprint $table) {
            $table->dropColumn('read_permission');
        });
    },
];
