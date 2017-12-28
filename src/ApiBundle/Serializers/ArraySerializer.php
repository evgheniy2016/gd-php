<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/26/17
 * Time: 1:36 PM
 */

namespace ApiBundle\Serializers;


class ArraySerializer implements SerializerInterface
{

    /**
     * @var \Doctrine\Common\Collections\ArrayCollection|\Doctrine\Common\Collections\Collection|array
     */
    private $collection;

    /**
     * @var string
     */
    private $class;

    /**
     * ArraySerializer constructor.
     *
     * @param \Doctrine\Common\Collections\ArrayCollection|\Doctrine\Common\Collections\Collection|array $collection
     * @param string $class
     */
    public function __construct($collection, $class)
    {
        $this->collection = $collection;
        $this->class = $class;
    }

    /**
     * @inheritdoc
     */
    public function serialize($target = null)
    {
        $serialized = [];
        /** @var SerializerInterface $singleSerializer */
        $singleSerializer = new $this->class;

        foreach ($this->collection as $item) {
            array_push($serialized, $singleSerializer->serialize($item));
        }

        return $serialized;
    }

}