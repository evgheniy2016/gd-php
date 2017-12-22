<?php

namespace AdminBundle\Controller;

use AppBundle\Entity\PromoCode;
use AppBundle\Entity\User;
use AdminBundle\Form\UserType;
use Pagerfanta\Adapter\ArrayAdapter;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use \Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\SubmitButton;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ArgumentResolver\RequestValueResolver;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

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
        $administrators = $usersRepository->findByRole(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']);
        $paginationAdapter = new DoctrineORMAdapter($administrators);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        dump($pagination);

        return $this->render('@Admin/Administrator/index.html.twig', array(
            'administrators' => $pagination
        ));
    }

    /**
     * @Route("/create", name="administrators.create")
     */
    public function createAction(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user)
            ->add('save', SubmitType::class, [ 'attr' => [ 'class' => 'button' ] ]);

        $form->remove('promoCodes');
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $encodedPassword = $this->get('security.password_encoder')->encodePassword($user, $user->getPassword());
            $user->setPassword($encodedPassword);
            $user->generateApiKey();

            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('administrators.index');
        }

        return $this->render('@Admin/Administrator/create.html.twig', [
            'user' => $user,
            'user_form' => $form->createView()
        ]);
    }

    /**
     * @Route("/{id}/edit", name="administrators.edit", requirements={"id", "\d+"})
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function editAction(Request $request, $id)
    {
        $doctrine = $this->getDoctrine();
        $userRepository = $doctrine->getRepository('AppBundle:User');
        $administrator = $userRepository->find($id);
        $currentPassword = $administrator->getPassword();

        $form = $this->createForm(UserType::class, $administrator)
            ->add('save', SubmitType::class, [ 'attr' => [ 'class' => 'button' ] ])
            ->add('delete', SubmitType::class, [ 'attr' => [ 'class' => 'button button-danger' ] ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($administrator->getPassword() !== null) {
                $administrator->setUpdatedPassword($administrator->getPassword());
            } else {
                $administrator->setPassword($currentPassword);
            }

            $doctrineManager = $doctrine->getManager();

            /** @var SubmitButton $clickedButton */
            $clickedButton = $form->getClickedButton();
            if ($clickedButton->getName() === 'delete') {
                $doctrineManager->remove($administrator);
            } else {
                $doctrineManager->persist($administrator);
            }
            $doctrineManager->flush();

            return $this->redirectToRoute('administrators.index');
        }

        return $this->render('@Admin/Administrator/edit.html.twig', [
            'user' => $administrator,
            'edit_form' => $form->createView()
        ]);
    }

}
