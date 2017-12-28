<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/26/17
 * Time: 1:35 PM
 */

namespace ApiBundle\Serializers;


interface SerializerInterface
{

    /**
     * @param mixed $target
     * @return array
     */
    public function serialize($target = null);

}