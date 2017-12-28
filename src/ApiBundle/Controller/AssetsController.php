<?php

namespace ApiBundle\Controller;

use ApiBundle\Serializers\ArraySerializer;
use ApiBundle\Serializers\AssetSerializer;
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

    /**
     * @param int $id
     * @return JsonResponse
     *
     * @Route("/list/details", requirements={"id": "\d+"}, defaults={"id": 1})
     */
    public function fooAction(int $id)
    {
        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $asset = $assetsRepository->findAll();

        return new JsonResponse((new ArraySerializer($asset, AssetSerializer::class))->serialize());
    }

}
