<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\PageType;
use AppBundle\Entity\Page;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class PageController
 * @package AdminBundle\Controller
 * @Route("pages", name="pages")
 */
class PageController extends Controller
{
    /**
     * @Route("/", name="pages.index")
     */
    public function indexAction()
    {
        return $this->render('AdminBundle:Page:index.html.twig', array(
            // ...
        ));
    }

    /**
     * @Route("/create", name="pages.create")
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createAction(Request $request)
    {
        $page = new Page();
        $form = $this->createForm(PageType::class, $page);

        return $this->render('@Admin/Page/create.html.twig', [
            'create_form' => $form->createView()
        ]);
    }

}
