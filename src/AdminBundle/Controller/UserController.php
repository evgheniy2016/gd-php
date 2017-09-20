<?php

namespace AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class UserController
 * @package AdminBundle\Controller
 * @Route("users", name="users")
 */
class UserController extends Controller
{
    /**
     * @Route("/", name="users.index")
     */
    public function indexAction()
    {
        return $this->render('AdminBundle:User:index.html.twig', array(
            // ...
        ));
    }

}
