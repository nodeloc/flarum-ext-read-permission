<?php

namespace Nodeloc\ReadPermission\Attributes;

use Illuminate\Database\ConnectionInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class ReadPermissionAttribute
{   
    protected $settings;
    protected $events;
    protected $db;

    public function __construct(SettingsRepositoryInterface $settings, ConnectionInterface $connection,  Dispatcher $events)
    {
        $this->settings = $settings;
        $this->events = $events;
        $this->db = $connection;
    }
    
    public function __invoke(UserSerializer $serializer, User $user)
    {
        
        
        $attributes = [];

        $attributes['read_permission'] = 0; //default value

        if($user->groups()->count() > 0)
        {
            //get highest permission
            $group = $user->groups()->orderBy('read_permission','desc')->first();
            
            $attributes['read_permission'] = $group->read_permission;
        }
        
        return $attributes;
    }
}
