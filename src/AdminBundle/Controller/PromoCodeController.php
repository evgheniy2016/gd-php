<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\PromoCodeType;
use AppBundle\Entity\PromoCode;
use AppBundle\Entity\User;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class PromoCodeController
 * @package AdminBundle\Controller
 * @Route("/promocode")
 */
class PromoCodeController extends Controller
{
    /**
     * @Route("/", name="promo_code.index", defaults={"page": 1})
     * @Route("/page/{page}", name="promo_code.index.page", defaults={"page": 1}, requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(int $page = 1)
    {
        $promoCodeRepository = $this->getDoctrine()->getRepository('AppBundle:PromoCode');
        $promoCodes = $promoCodeRepository->findAllOrderedByIdDesc();

        $paginationAdapter = new DoctrineORMAdapter($promoCodes);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('AdminBundle:PromoCode:index.html.twig', array(
            'promocodes' => $pagination
        ));
    }

    /**
     * @Route("/create", name="promo_code.create")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createAction(Request $request)
    {
        $promoCode = new PromoCode();
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $form = $this->createForm(PromoCodeType::class, $promoCode, [
                'choices' => $userRepository->findByRole('ROLE_ADMIN')->getQuery()->getResult()
            ])
            ->add('save', SubmitType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $doctrineManager = $this->getDoctrine()->getManager();
            $doctrineManager->persist($promoCode);
            $doctrineManager->flush();

            return $this->redirectToRoute('promo_code.index');
        }

        return $this->render('AdminBundle:PromoCode:create.html.twig', array(
            'create_form' => $form->createView()
        ));
    }

    /**
     * @Route("/{id}/delete", name="promo_code.delete", requirements={"id": "\d+"})
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function deleteAction(int $id)
    {
        $promoCodeRepository = $this->getDoctrine()->getRepository('AppBundle:PromoCode');
        $promoCode = $promoCodeRepository->find($id);
        $this->getDoctrine()->getManager()->remove($promoCode);
        $this->getDoctrine()->getManager()->flush();

        return $this->redirectToRoute('promo_code.index');
    }

}
