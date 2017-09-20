<?php

namespace AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class PageController
 * @package AdminBundle\Controller
 * @Route("pages", name="pages")
 */
class PageController extends Controller
{
    /**
     * @Route("/", name="pages.index")
     */
    public function indexAction()
    {
        return $this->render('AdminBundle:Page:index.html.twig', array(
            // ...
        ));
    }

}
