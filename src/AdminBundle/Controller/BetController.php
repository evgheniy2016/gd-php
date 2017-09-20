<?php

namespace AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * Class BetController
 * @package AdminBundle\Controller
 * @Route("bets", name="bets")
 */
class BetController extends Controller
{
    /**
     * @Route("/", name="bets.index")
     */
    public function indexAction()
    {
        return $this->render('AdminBundle:Bets:index.html.twig', array(
            // ...
        ));
    }

}
