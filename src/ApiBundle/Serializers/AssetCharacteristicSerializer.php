<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/26/17
 * Time: 1:36 PM
 */

namespace ApiBundle\Serializers;


use AppBundle\Entity\AssetCharacteristic;

class AssetCharacteristicSerializer implements SerializerInterface
{

    /**
     * @var AssetCharacteristic
     */
    private $characteristic;

    /**
     * AssetCharacteristicSerializer constructor.
     *
     * @param AssetCharacteristic $characteristic
     */
    public function __construct($characteristic = null)
    {
        $this->characteristic = $characteristic;
    }

    /**
     * @inheritdoc
     */
    public function serialize($target = null)
    {
        if ($target !== null) {
            $this->characteristic = $target;
        }

        return [
            'time' => $this->characteristic->getTime(),
            'multiplier' => $this->characteristic->getMultiplier()
        ];
    }

}