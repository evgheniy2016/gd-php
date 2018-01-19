<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * AssetCharacteristic
 *
 * @ORM\Table(name="asset_characteristic")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AssetCharacteristicRepository")
 */
class AssetCharacteristic
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="time", type="string", length=16)
     */
    private $time;

    /**
     * @var float
     *
     * @ORM\Column(name="multiplier", type="float")
     */
    private $multiplier;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Trade", mappedBy="assetCharacteristic")
     */
    private $trades;

    /**
     * @var Asset
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Asset", inversedBy="characteristics")
     * @ORM\JoinColumn(name="asset_id", referencedColumnName="id", onDelete="cascade")
     */
    private $asset;

    public function __construct()
    {
        $this->asset = null;
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set time
     *
     * @param string $time
     *
     * @return AssetCharacteristic
     */
    public function setTime($time)
    {
        $this->time = $time;

        return $this;
    }

    /**
     * Get time
     *
     * @return string
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * Set multiplier
     *
     * @param float $multiplier
     *
     * @return AssetCharacteristic
     */
    public function setMultiplier($multiplier)
    {
        $this->multiplier = $multiplier;

        return $this;
    }

    /**
     * Get multiplier
     *
     * @return float
     */
    public function getMultiplier()
    {
        return $this->multiplier;
    }

    /**
     * @return Asset
     */
    public function getAsset(): Asset
    {
        return $this->asset;
    }

    /**
     * @param Asset $asset
     * @return $this
     */
    public function setAsset(Asset $asset)
    {
        $this->asset = $asset;
        return $this;
    }

    public function __toString()
    {
        return $this->getTime() . ': ' . $this->getMultiplier();
    }

}

