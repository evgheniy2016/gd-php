<?php

namespace AdminBundle\Controller;

use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
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
     * @Route("/", name="bets.index", defaults={"page": 1})
     * @Route("/page/{page}", name="bets.index.page", requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(int $page)
    {
        $tradesRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $bets = $tradesRepository->findOpenedTrades();

        $driver = new DoctrineORMAdapter($bets);
        $pagination = new Pagerfanta($driver);
        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('AdminBundle:Bets:index.html.twig', array(
            'bets' => $pagination
        ));
    }

}
