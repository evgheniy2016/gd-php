<?php

namespace BinaryTradeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class GuideController extends Controller
{
    /**
     * @Route("/guide/{slug}", requirements={"id": "[a-z\-\_0-9A-Z]+"}, name="guide.show.page")
     * @Route("/page/{slug}", requirements={"id": "[a-z\-\_0-9A-Z]+"}, name="page.show.page")
     * @Route("/guide/", defaults={"slug": "about"}, name="guide.show")
     * @param string $slug
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showAction($slug)
    {
        $categoriesRepository = $this->getDoctrine()->getRepository('AppBundle:PageCategory');
        $pagesRepository = $this->getDoctrine()->getRepository('AppBundle:Page');
        $categories = $categoriesRepository->findAll();
        $page = $pagesRepository->findOneBy([ 'slug' => $slug ]);

        return $this->render('BinaryTradeBundle:Guide:show.html.twig', array(
            'categories' => $categories,
            'page' => $page
        ));
    }

}
