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

    /**
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/{id}/delete", requirements={"id": "\d+"}, defaults={"id": 0}, name="bets.delete")
     */
    public function deleteTradeAction(int $id)
    {
        $referer = $_SERVER['HTTP_REFERER'];

        if ($id <= 0 || !$this->isGranted('ROLE_SUPER_ADMIN')) {
            return $this->redirect($referer);
        }

        $tradesRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $trade = $tradesRepository->find($id);

        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->remove($trade);
        $doctrineManager->flush();

        return $this->redirect($referer);
    }

}
