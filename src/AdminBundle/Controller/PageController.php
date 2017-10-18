<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\PageType;
use AppBundle\Entity\Page;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class PageController
 * @package AdminBundle\Controller
 * @Route("pages", name="pages")
 */
class PageController extends Controller
{
    /**
     * @Route("/", name="pages.index", defaults={"page": 1})
     * @Route("/page/{page}", name="pages.index.page", defaults={"page": 1}, requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(int $page = 1)
    {
        $pageRepository = $this->getDoctrine()->getRepository('AppBundle:Page');

        $paginationTake = $this->getParameter('pagination')['take'];

        $paginationAdapter = new DoctrineORMAdapter($pageRepository->findAllOrderedByDesc());
        $pagination = new Pagerfanta($paginationAdapter);

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('AdminBundle:Page:index.html.twig', array(
            'pages' => $pagination
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
        $form = $this->createForm(PageType::class, $page)
            ->add('save', SubmitType::class, [ 'attr' => [ 'class' => 'button' ] ]);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $page->setContent($page->getContent()['markdown']);

            $doctrineManager = $this->getDoctrine()->getManager();
            $doctrineManager->persist($page);
            $doctrineManager->flush();

            return $this->redirectToRoute('pages.index');
        }

        return $this->render('@Admin/Page/create.html.twig', [
            'create_form' => $form->createView()
        ]);
    }

    /**
     * @Route("/{id}/delete/", name="pages.delete", requirements={"id": "\d+"})
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deleteAction(int $id)
    {
        $pageRepository = $this->getDoctrine()->getRepository('AppBundle:Page');
        $page = $pageRepository->find($id);
        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->remove($page);
        $doctrineManager->flush();

        return $this->redirectToRoute('pages.index');
    }

}
