<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Asset
 *
 * @ORM\Table(name="asset")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AssetRepository")
 */
class Asset
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
     * @ORM\Column(name="pid", type="string", length=16, unique=true)
     */
    private $pid;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=128, unique=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=16)
     */
    private $type;

    /**
     * @var string
     *
     * @ORM\Column(name="trade_from", type="string", length=6)
     */
    private $tradeFrom;

    /**
     * @var string
     *
     * @ORM\Column(name="trade_until", type="string", length=6)
     */
    private $tradeUntil;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\AssetCharacteristic", mappedBy="asset")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $characteristics;

    public function __construct()
    {
        $this->characteristics = new ArrayCollection();
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
     * Set pid
     *
     * @param string $pid
     *
     * @return Asset
     */
    public function setPid($pid)
    {
        $this->pid = $pid;

        return $this;
    }

    /**
     * Get pid
     *
     * @return string
     */
    public function getPid()
    {
        return $this->pid;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Asset
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Asset
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getTradeFrom()
    {
        return $this->tradeFrom;
    }

    /**
     * @param $tradeFrom
     * @return Asset
     */
    public function setTradeFrom($tradeFrom)
    {
        $this->tradeFrom = $tradeFrom;
        return $this;
    }

    /**
     * @return string
     */
    public function getTradeUntil()
    {
        return $this->tradeUntil;
    }

    /**
     * @param \DateTime $tradeUntil
     * @return Asset
     */
    public function setTradeUntil($tradeUntil)
    {
        $this->tradeUntil = $tradeUntil;
        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getCharacteristics(): Collection
    {
        return $this->characteristics;
    }

    /**
     * @param ArrayCollection $characteristics
     * @return $this
     */
    public function setCharacteristics($characteristics)
    {
        $this->characteristics = $characteristics ?? new ArrayCollection();
        return $this;
    }

    public function removeCharacteristic(AssetCharacteristic $assetCharacteristic)
    {
        $this->characteristics->removeElement($assetCharacteristic);
    }

    public function getTimeIntervals()
    {
        $intervals = $this->getCharacteristics()
            ->map(function (AssetCharacteristic $item) {
                return $item->getTime();
            })->getValues();
        return implode(';', $intervals);
    }

    public function __toString()
    {
        return $this->getName();
    }

}

