<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\PageCategoryType;
use AppBundle\Entity\PageCategory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/category")
 */
class CategoryController extends Controller
{
    /**
     * @Route("/", name="category.index")
     */
    public function indexAction()
    {
        $categoriesRepository =  $this->getDoctrine()->getRepository('AppBundle:PageCategory');
        $categories = $categoriesRepository->findBy([], [ 'id' => 'desc' ]);

        return $this->render('AdminBundle:Category:index.html.twig', [
            'categories' => $categories
        ]);
    }

    /**
     * @Route("/create", name="category.create")
     */
    public function createAction(Request $request)
    {
        $category = new PageCategory();
        $form = $this->createForm(PageCategoryType::class, $category)
            ->add('save', SubmitType::class, [ 'attr' => [ 'class' => 'button' ] ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $doctrineManager = $this->getDoctrine()->getManager();

            $doctrineManager->persist($category);
            $doctrineManager->flush();

            return $this->redirectToRoute('category.index');
        }

        return $this->render('AdminBundle:Category:create.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * @Route("/{id}/delete", name="category.delete")
     */
    public function deleteAction(int $id)
    {
        $categoriesRepository = $this->getDoctrine()->getRepository('AppBundle:PageCategory');
        $category = $categoriesRepository->find($id);
        $this->getDoctrine()->getManager()->remove($category);
        $this->getDoctrine()->getManager()->flush();

        return $this->redirectToRoute('category.index');
    }

}
