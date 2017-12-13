<?php

namespace BinaryTradeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class GuideController extends Controller
{
    /**
     * @Route("/guide/{id}", requirements={"id": "\d+"}, name="guide.show.page")
     * @Route("/guide/", defaults={"id": 0}, name="guide.show")
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showAction($id)
    {
        return $this->render('BinaryTradeBundle:Guide:show.html.twig', array(
            'id' => $id
        ));
    }

}
