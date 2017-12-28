<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\AssetType;
use AppBundle\Entity\Asset;
use AppBundle\Entity\AssetCharacteristic;
use Doctrine\Common\Collections\ArrayCollection;
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
            $doctrineManager = $this->getDoctrine()->getManager();
            foreach ($asset->getCharacteristics() as $characteristic) {
                $characteristic->setAsset($asset);
                $doctrineManager->persist($characteristic);
            }

            $doctrineManager->persist($asset);
            $doctrineManager->flush();

            return $this->redirectToRoute('assets.index');
        }

        return $this->render('AdminBundle:Asset:create.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * @Route("/{id}/edit", requirements={"id", "\d+"}, name="assets.edit")
     * @param Request $request
     * @param int $id
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function editAction(Request $request, int $id)
    {
        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $asset = $assetsRepository->find($id);

        $form = $this->createForm(AssetType::class, $asset);
        $form->add('save', SubmitType::class, [
            'attr' => [
                'class' => 'button'
            ]
        ]);

        $originalCharacteristics = new ArrayCollection();
        foreach ($asset->getCharacteristics() as $characteristic) {
            $originalCharacteristics->add($characteristic);
        }

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $doctrineManager = $this->getDoctrine()->getManager();

            foreach ($originalCharacteristics as $characteristic) {
                if ($asset->getCharacteristics()->contains($characteristic) === false) {
                    $doctrineManager->remove($characteristic);
                }
            }

            foreach ($asset->getCharacteristics() as $characteristic) {
                if ($characteristic->getId() === null) {
                    $characteristic->setAsset($asset);
                    $doctrineManager->persist($characteristic);
                }
            }

            $doctrineManager->persist($asset);
            $doctrineManager->flush();

            return $this->redirectToRoute('assets.edit', [ 'id' => $asset->getId() ]);
        }

        return $this->render('AdminBundle:Asset:create.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/{id}/delete", requirements={"id": "\d+"}, defaults={"id": 0}, name="assets.delete")
     */
    public function deleteAction(int $id)
    {
        if ($id < 1 || !$this->isGranted('ROLE_SUPER_ADMIN')) {
            return $this->redirectToRoute('assets.index');
        }

        $assetsRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $asset = $assetsRepository->find($id);

        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->remove($asset);
        $doctrineManager->flush();

        $referer = $_SERVER['HTTP_REFERER'];
        return $this->redirect($referer);
    }

}
