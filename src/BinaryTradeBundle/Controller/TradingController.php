<?php

namespace BinaryTradeBundle\Controller;

use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\Trade;
use BinaryTradeBundle\Service\TradingService;
use Carbon\Carbon;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\SecurityBundle\Tests\Functional\Bundle\AclBundle\Entity\Car;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints\DateTime;

class TradingController extends Controller
{
    /**
     * @Route("/trade", name="trade")
     */
    public function tradeAction()
    {
        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $assets = $assetsRepository->findAllOrderById()->getQuery()->getResult();

        return $this->render('BinaryTradeBundle:Trading:trade.html.twig', array(
            'assets' => $assets
        ));
    }

}
