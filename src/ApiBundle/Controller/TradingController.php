<?php

namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class TradingController
 * @package ApiBundle\Controller
 *
 * @Route("trading")
 */
class TradingController extends Controller
{

    /**
     * @param Request $request
     * @return JsonResponse
     *
     * @Route("/place-a-bet")
     */
    public function placeABetAction(Request $request)
    {
        return new JsonResponse([

        ]);
    }

}
