<?php

namespace BinaryTradeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        return $this->render('BinaryTradeBundle:Default:index.html.twig');
    }

    /**
     * @Route("/foo")
     */
    public function fooAction()
    {
        $users = $this->getDoctrine()->getRepository('AppBundle:User')->findAll();
        $data = [];
        foreach ($users as $user) {
            array_push($data, $user->getFirstName());
        }
        return new JsonResponse($data);
    }

}
