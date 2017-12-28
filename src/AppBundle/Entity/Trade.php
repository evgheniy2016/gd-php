<?php

namespace AppBundle\Entity;

use Carbon\Carbon;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Trade
 *
 * @ORM\Table(name="trade")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TradeRepository")
 */
class Trade
{

    // Constants:
    public static $DIRECTION_UP = 'up';
    public static $DIRECTION_DOWN = 'down';

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
     * @ORM\Column(name="direction", type="string", length=8)
     */
    private $direction;

    /**
     * @var string
     *
     * @ORM\Column(name="amount", type="float")
     */
    private $amount;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="string")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="expire_at", type="string")
     */
    private $expireAt;

    /**
     * @var string
     *
     * @ORM\Column(name="period", type="string")
     */
    private $period;

    /**
     * @var string
     *
     * @ORM\Column(name="gainings", type="decimal", precision=20, scale=0)
     */
    private $gainings;

    /**
     * @var bool
     *
     * @ORM\Column(name="finished", type="boolean")
     */
    private $finished = false;

    /**
     * @var string
     *
     * @ORM\Column(name="predefined_direction", type="string", length=8)
     */
    private $predefinedDirection;

    /**
     * @var string
     * @ORM\Column(name="asset", type="string", nullable=false)
     */
    private $asset;

    /**
     * @var string
     * @ORM\Column(name="asset_name", type="string", nullable=false)
     */
    private $assetName;

    /**
     * @var string
     * @ORM\Column(name="asset_price", type="string", length=10, nullable=false)
     */
    private $assetPrice;

    /**
     * @var float
     * @ORM\Column(name="offer_multiplier", type="float", nullable=false)
     */
    private $offerMultiplier;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="trades")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    private $user;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\BalanceHistory", mappedBy="trade")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $balanceHistories;

    public function __construct()
    {
        $this->balanceHistories = new ArrayCollection();
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
     * Set direction
     *
     * @param string $direction
     *
     * @return Trade
     */
    public function setDirection($direction)
    {
        $this->direction = $direction;

        return $this;
    }

    /**
     * Get direction
     *
     * @return string
     */
    public function getDirection()
    {
        return $this->direction;
    }

    /**
     * Set amount
     *
     * @param string $amount
     *
     * @return Trade
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * Get amount
     *
     * @return string
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * Set createdAt
     *
     * @param string $createdAt
     *
     * @return Trade
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return string
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set openedTo
     *
     * @param string $expireAt
     *
     * @return Trade
     */
    public function setExpireAt($expireAt)
    {
        $this->expireAt = $expireAt;

        return $this;
    }

    /**
     * Get openedTo
     *
     * @return string
     */
    public function getExpireAt()
    {
        return $this->expireAt;
    }

    /**
     * @return string
     */
    public function getPeriod(): string
    {
        return $this->period;
    }

    /**
     * @param string $period
     * @return $this
     */
    public function setPeriod(string $period)
    {
        $this->period = $period;

        if ($this->createdAt !== null) {
            $expireAt = Carbon::createFromTimestamp($this->createdAt->getTimestamp());
            $expireAt->addMinutes($period);
            $this->setExpireAt($expireAt);
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getGainings(): string
    {
        return $this->gainings;
    }

    /**
     * @param string $gainings
     */
    public function setGainings(string $gainings)
    {
        $this->gainings = $gainings;
    }

    /**
     * @return bool
     */
    public function isFinished(): bool
    {
        return $this->finished;
    }

    /**
     * @param bool $finished
     */
    public function setFinished(bool $finished)
    {
        $this->finished = $finished;
    }

    /**
     * @return string
     */
    public function getPredefinedDirection(): string
    {
        return $this->predefinedDirection;
    }

    /**
     * @param string $predefinedDirection
     */
    public function setPredefinedDirection(string $predefinedDirection)
    {
        $this->predefinedDirection = $predefinedDirection;
    }

    /**
     * @return string
     */
    public function getAsset(): string
    {
        return $this->asset;
    }

    /**
     * @param string $asset
     * @return $this
     */
    public function setAsset($asset)
    {
        $this->asset = $asset;
        return $this;
    }

    /**
     * @return string
     */
    public function getAssetName(): string
    {
        return $this->assetName;
    }

    /**
     * @param string $assetName
     * @return $this
     */
    public function setAssetName($assetName)
    {
        $this->assetName = $assetName;
        return $this;
    }

    /**
     * @return string
     */
    public function getAssetPrice()
    {
        return $this->assetPrice;
    }

    /**
     * @param string $assetPrice
     * @return $this
     */
    public function setAssetPrice($assetPrice)
    {
        $this->assetPrice = $assetPrice;
        return $this;
    }

    /**
     * @return float
     */
    public function getOfferMultiplier()
    {
        return $this->offerMultiplier;
    }

    /**
     * @param float $offerMultiplier
     * @return $this
     */
    public function setOfferMultiplier($offerMultiplier)
    {
        $this->offerMultiplier = $offerMultiplier;
        return $this;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * @return ArrayCollection
     */
    public function getBalanceHistories()
    {
        return $this->balanceHistories;
    }

    /**
     * @param ArrayCollection $balanceHistories
     * @return $this
     */
    public function setBalanceHistories($balanceHistories)
    {
        $this->balanceHistories = $balanceHistories;
        return $this;
    }

    /**
     * @return string
     */
    public function getCreatedAtString()
    {
        return Carbon::createFromTimestamp((int)($this->createdAt))->format('d.m.Y H:i:s');
    }

    /**
     * @return string
     */
    public function getExpireAtString()
    {
        return Carbon::createFromTimestamp((int)($this->expireAt))->format('d.m.Y H:i:s');
    }

    public function __toString()
    {
        $createdAt = $this->createdAt->format('d.m.Y H:i:s');
        $expireAt = $this->expireAt->format('d.m.Y H:i:s');
        $amount = $this->amount;
        $direction = $this->direction;

        return "Created at ${createdAt}, expire at ${expireAt}, amount is ${amount} and direction is ${direction}";
    }

}

