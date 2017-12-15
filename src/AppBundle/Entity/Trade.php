<?php

namespace AppBundle\Entity;

use Carbon\Carbon;
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
     * @ORM\Column(name="amount", type="decimal", precision=20, scale=0)
     */
    private $amount;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="expire_at", type="datetime")
     */
    private $expireAt;

    /**
     * @var string
     *
     * @ORM\Column(name="period", type="decimal", precision=10, scale=0)
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
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="trades")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    private $user;


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
     * @param \DateTime $createdAt
     *
     * @return Trade
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        if ($this->period !== null) {
            $expireAt = Carbon::createFromTimestamp($this->createdAt->getTimestamp());
            $expireAt->addMinutes($this->period);
            $this->setExpireAt($expireAt);
        }

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set openedTo
     *
     * @param \DateTime $expireAt
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
     * @return \DateTime
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
     * @return string
     */
    public function getCreatedAtString()
    {
        return $this->getCreatedAt()->format('d.m.Y H:i:s');
    }

    /**
     * @return string
     */
    public function getExpireAtString()
    {
        return $this->getCreatedAt()->format('d.m.Y H:i:s');
    }

    public function __toString()
    {
        $createdAt = $this->createdAt->format('d.m.Y H:i:s');
        $expireAt = $this->expireAt->format('d.m.Y H:i:s');
        $amount = $this->amount;
        $direction = $this->direction;

        return "Created at ${createdAt}, expire at ${expireAt}, amount is ${amount} and direction is ${direction}";
    }

    /**
     * @return string
     */
    public function getAssetLabel(): string
    {
        $asset = explode(':', $this->asset)[1];
        $asset = strtoupper($asset);
        $asset = str_replace('-', '/', $asset);
        return $asset;
    }

}

