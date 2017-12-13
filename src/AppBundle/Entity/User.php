<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 */
class User implements UserInterface
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
     * @ORM\Column(name="username", type="string", length=255, unique=true)
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(name="first_name", type="string", length=255, unique=false, nullable=true)
     */
    private $firstName;

    /**
     * @var string
     * @ORM\Column(name="last_name", type="string", length=255, unique=false, nullable=true)
     */
    private $lastName;

    /**
     * @var string
     * @ORM\Column(name="country", type="string", length=8, unique=false, nullable=true)
     */
    private $country;

    /**
     * @var string
     * @ORM\Column(name="phone", type="string", length=15, unique=false, nullable=true)
     */
    private $phone;

    /**
     * @var string
     * @ORM\Column(name="city", type="string", length=48, unique=false, nullable=true)
     */
    private $city;

    /**
     * @var string
     * @ORM\Column(name="address", type="string", length=255, unique=false, nullable=true)
     */
    private $address;

    /**
     * @var string
     * @ORM\Column(name="zip_code", type="string", length=16, unique=false, nullable=true)
     */
    private $zipCode;

    /**
     * @var string
     * @ORM\Column(name="currency", type="string", length=8, unique=false, nullable=true)
     */
    private $currency;

    /**
     * @var string
     *
     * @ORM\Column(name="password", type="string", length=255)
     */
    private $password;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255, unique=true)
     */
    private $email;

    /**
     * @var array
     *
     * @ORM\Column(name="roles", type="json_array")
     */
    private $roles;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\PromoCode", mappedBy="author")
     */
    private $promoCodes;

    /**
     * @var string
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\PromoCode", inversedBy="users")
     */
    private $promoCode;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\BalanceHistory", mappedBy="user")
     * @ORM\OrderBy({"id": "desc"})
     */
    private $balanceHistory;

    /**
     * @var string
     *
     * @ORM\Column(name="balance", type="decimal", precision=10, scale=0)
     */
    private $balance = 0;

    /**
     * @var Collection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Trade", mappedBy="user")
     */
    private $trades;

    /**
     * @var string
     */
    private $updatedPassword = null;

    public function __construct()
    {
        $this->promoCodes = null;
        $this->balanceHistory = new ArrayCollection();
        $this->trades = new ArrayCollection();
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
     * Set username
     *
     * @param string $username
     *
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->firstName ?? "";
    }

    /**
     * @param string $firstName
     * @return $this
     */
    public function setFirstName(string $firstName)
    {
        $this->firstName = $firstName;
        return $this;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName ?? "";
    }

    /**
     * @param string $lastName
     * @return $this
     */
    public function setLastName(string $lastName)
    {
        $this->lastName = $lastName;
        return $this;
    }

    /**
     * @return string
     */
    public function getCountry(): string
    {
        return $this->country ?? "";
    }

    /**
     * @param string $country
     * @return $this
     */
    public function setCountry(string $country)
    {
        $this->country = $country;
        return $this;
    }

    /**
     * @return string
     */
    public function getPhone(): string
    {
        return $this->phone ?? "";
    }

    /**
     * @param string $phone
     * @return $this
     */
    public function setPhone(string $phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * @return string
     */
    public function getCity(): string
    {
        return $this->city ?? "";
    }

    /**
     * @param string $city
     * @return $this
     */
    public function setCity(string $city)
    {
        $this->city = $city;
        return $this;
    }

    /**
     * @return string
     */
    public function getAddress(): string
    {
        return $this->address ?? "";
    }

    /**
     * @param string $address
     * @return $this
     */
    public function setAddress(string $address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * @return string
     */
    public function getZipCode(): string
    {
        return $this->zipCode ?? "";
    }

    /**
     * @param string $zipCode
     * @return $this
     */
    public function setZipCode(string $zipCode)
    {
        $this->zipCode = $zipCode;
        return $this;
    }

    /**
     * @return string
     */
    public function getCurrency(): string
    {
        return $this->currency ?? "";
    }

    /**
     * @param string $currency
     * @return $this
     */
    public function setCurrency(string $currency)
    {
        $this->currency = $currency;
        return $this;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set roles
     *
     * @param array $roles
     *
     * @return User
     */
    public function setRoles($roles)
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Get roles
     *
     * @return array
     */
    public function getRoles()
    {
        return $this->roles;
    }

    /**
     * Get promo codes
     *
     * @return ArrayCollection
     */
    public function getPromoCodes()
    {
        return $this->promoCodes;
    }

    /**
     * Set promo code
     *
     * @param PromoCode $promoCode
     *
     * @return User
     */
    public function setPromoCode(PromoCode $promoCode)
    {
        $this->promoCode = $promoCode;

        return $this;
    }

    /**
     * Get promo code
     *
     * @return string
     */
    public function getPromoCode()
    {
        return $this->promoCode;
    }

    /**
     * Returns the salt that was originally used to encode the password.
     *
     * This can return null if the password was not encoded using a salt.
     *
     * @return string|null The salt
     */
    public function getSalt()
    {
        // TODO: Implement getSalt() method.
    }

    /**
     * Removes sensitive data from the user.
     *
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getPromoCodesAsStringList()
    {
        $promoCodes = $this->promoCodes->map(function (PromoCode $promoCode) {
            return $promoCode->getCode();
        })->toArray();
        return implode(' ', $promoCodes);
    }

    /**
     * @return Collection
     */
    public function getBalanceHistory(): Collection
    {
        return $this->balanceHistory;
    }

    /**
     * @param Collection $balanceHistory
     */
    public function setBalanceHistory(Collection $balanceHistory)
    {
        $this->balanceHistory = $balanceHistory;
    }

    /**
     * @return string
     */
    public function getBalance(): string
    {
        return $this->balance;
    }

    /**
     * @param string $balance
     */
    public function setBalance(string $balance)
    {
        $this->balance = $balance;
    }

    /**
     * @return Collection
     */
    public function getTrades(): Collection
    {
        return $this->trades;
    }

    /**
     * @param Collection $trades
     */
    public function setTrades(Collection $trades)
    {
        $this->trades = $trades;
    }

    /**
     * @return string
     */
    public function getUpdatedPassword(): string
    {
        return $this->updatedPassword ?? '';
    }

    /**
     * @param string $updatedPassword
     */
    public function setUpdatedPassword(string $updatedPassword)
    {
        $this->updatedPassword = $updatedPassword;
    }

    public function __toString()
    {
        $username = $this->username;
        $email = $this->email;
        return "${username} (${email})";
    }

    public function toArray()
    {
        return [
            'username' => $this->getUsername()
        ];
    }

}

