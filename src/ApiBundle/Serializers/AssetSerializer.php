<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/26/17
 * Time: 1:34 PM
 */

namespace ApiBundle\Serializers;


use AppBundle\Entity\Asset;
use AppBundle\Entity\AssetCharacteristic;

class AssetSerializer implements SerializerInterface
{

    /**
     * @var Asset
     */
    private $asset = null;

    public function __construct(Asset $asset = null)
    {
        $this->asset = $asset;
    }

    /**
     * @inheritdoc
     */
    public function serialize($target = null) {
        $asset = $this->asset ?? $target;

        $characteristicsSerializer = new ArraySerializer($asset->getCharacteristics(), AssetCharacteristicSerializer::class);

        return [
            'name' => $asset->getName(),
            'pid' => $asset->getPid(),
            'type' => $asset->getType(),
            'times' => $characteristicsSerializer->serialize()
        ];
    }

}