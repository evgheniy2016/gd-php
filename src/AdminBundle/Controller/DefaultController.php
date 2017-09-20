<?php

namespace AdminBundle\Controller;

use AdminBundle\Service\SidebarService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="default.foo")
     */
    public function indexAction()
    {
        return $this->render('AdminBundle:Default:index.html.twig');
    }

    /**
     * @Route("/foo/{page}")
     */
    public function fooAction($page)
    {
        return $this->render('@Admin/Default/foo.html.twig', [
            'page' => $page
        ]);
    }

}
