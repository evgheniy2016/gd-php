<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * PageCategory
 *
 * @ORM\Table(name="page_category")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PageCategoryRepository")
 */
class PageCategory
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
     * @ORM\Column(name="name", type="string", length=128, unique=true)
     */
    private $name;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Page", mappedBy="category")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $pages;


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
     * Set name
     *
     * @param string $name
     *
     * @return PageCategory
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
     * @return ArrayCollection
     */
    public function getPages()
    {
        return $this->pages;
    }

    /**
     * @param ArrayCollection $pages
     * @return $this
     */
    public function setPages(ArrayCollection $pages)
    {
        $this->pages = $pages;
        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }

}

