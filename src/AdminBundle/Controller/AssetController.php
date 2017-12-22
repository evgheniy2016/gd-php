<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\AssetType;
use AppBundle\Entity\Asset;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class AssetController
 * @package AdminBundle\Controller
 * @Route("/assets")
 */
class AssetController extends Controller
{
    /**
     * @Route("/", name="assets.index", defaults={"page": 1})
     * @Route("/page/{page}", name="assets.index.page", requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(int $page)
    {
        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $assets = $assetsRepository->findAllOrderById();

        $paginationAdapter = new DoctrineORMAdapter($assets);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('AdminBundle:Asset:index.html.twig', array(
            'assets' => $pagination
        ));
    }

    /**
     * @Route("/create", name="assets.create")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createAction(Request $request)
    {
        $asset = new Asset();
        $form = $this->createForm(AssetType::class, $asset);
        $form->add('save', SubmitType::class, [
            'attr' => [
                'class' => 'button'
            ]
        ]);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->persist($asset);
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('assets.index');
        }

        return $this->render('AdminBundle:Asset:create.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * @Route("/edit")
     */
    public function editAction()
    {
        return $this->render('AdminBundle:Asset:edit.html.twig', array(
            // ...
        ));
    }

    /**
     * @Route("/delete")
     */
    public function deleteAction()
    {
        return $this->render('AdminBundle:Asset:delete.html.twig', array(
            // ...
        ));
    }

}
