<?php

namespace AdminBundle\Controller;

use AppBundle\Entity\PromoCode;
use AppBundle\Entity\User;
use AppBundle\Form\UserType;
use \Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class AdministratorController
 * @package AdminBundle\Controller
 * @Route("/administrators", name="administrators")
 */
class AdministratorController extends Controller
{
    /**
     * @Route("/", name="administrators.index")
     * @Route("/page/{page}", name="administrators.index.page", defaults={"page": 1}, requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($page = 1)
    {
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        /** @var User[] $administrators */
        $administrators = $usersRepository->paginateByRole('ROLE_ADMIN', 15, $page)->getQuery()->getResult();

        return $this->render('@Admin/Administrator/index.html.twig', array(
            'administrators' => $administrators
        ));
    }

    /**
     * @Route("/create", name="administrators.create")
     */
    public function createAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user)
            ->add('save', SubmitType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $user->setRoles([ "ROLE_USER" ]);

            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
        }

        return $this->render('@Admin/Administrator/create.html.twig', [
            'user' => $user,
            'user_form' => $form->createView()
        ]);
    }

}
