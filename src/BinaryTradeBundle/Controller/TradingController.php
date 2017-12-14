<?php

namespace BinaryTradeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class TradingController extends Controller
{
    /**
     * @Route("/trade", name="trade")
     */
    public function tradeAction()
    {
        return $this->render('BinaryTradeBundle:Trading:trade.html.twig', array(
            // ...
        ));
    }

}
