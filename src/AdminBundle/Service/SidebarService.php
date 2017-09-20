<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 9/20/17
 * Time: 11:56 AM
 */

namespace AdminBundle\Service;


use Symfony\Component\HttpFoundation\RequestStack;

class SidebarService
{

    /**
     * @var RequestStack
     */
    private $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function getCurrentRoute()
    {
        return $this->requestStack->getCurrentRequest()->get('_route');
    }

}