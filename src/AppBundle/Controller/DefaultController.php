<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/_")
     */
    public function indexAction(Request $request)
    {
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $administrators = $usersRepository->paginateByRole('ROLE_ADMIN', 15, 1)->getQuery()->getResult();

        $message = \Swift_Message::newInstance()
            ->setSubject('Hello Email')
            ->setFrom('noreply@goldenforex.com')
            ->setTo('alexey.rudkovskiy@mitk.com.ua')
            ->setBody(
                $this->renderView(
                    '@App/Emails/email.html.twig',
                    array('name' => 'Alexey')
                )
            );

        $this->get('mailer')->send($message);

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/foo")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fooAction()
    {
        return $this->render('test.html.twig', []);
    }

}
