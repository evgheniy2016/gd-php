<?php

namespace AdminBundle\Controller;

use AdminBundle\Service\SidebarService;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="admin.default")
     */
    public function indexAction()
    {

        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $tradesRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');

        $usersCount = $usersRepository->getTotalCount();
        $openedTradesCount = $tradesRepository->getTotalCount();

        return $this->render('AdminBundle:Default:index.html.twig', [
            'users_count' => $usersCount,
            'opened_trades_count' => $openedTradesCount
        ]);
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
