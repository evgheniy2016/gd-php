<?php

namespace ApiBundle\Controller;

use AppBundle\Entity\Asset;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class AssetsController
 * @package ApiBundle\Controller
 *
 * @Route("assets")
 */
class AssetsController extends Controller
{

    /**
     * @Route("/list")
     */
    public function listAction()
    {
        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');

        $assets = $assetsRepository->findAll();
        $assets = array_map(function(Asset $asset) {
            return (int)($asset->getPid());
        }, $assets);

        return new JsonResponse([
            'response' => 'success',
            'assets' => $assets
        ]);
    }

}
