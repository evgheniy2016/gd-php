<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\SaveAndDeleteType;
use AdminBundle\Form\TradeType;
use AdminBundle\Form\UserType;
use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\Trade;
use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\SubmitButton;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class UserController
 * @package AdminBundle\Controller
 * @Route("users", name="users")
 */
class UserController extends Controller
{
    /**
     * @Route("/", name="users.index")
     * @Route("/page/{page}", name="administrators.index.page", defaults={"page": 1}, requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($page = 1)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $users = $userRepository->paginateByRole('ROLE_USER', 15, $page)->getQuery()->getResult();

        return $this->render('AdminBundle:User:index.html.twig', [
            'users' => $users
        ]);
    }

    /**
     * @Route("/create", name="users.create")
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function createAction(Request $request)
    {
        $user = new User();
        $user->setRoles([ 'ROLE_USER' ]);
        $form = $this->createForm(UserType::class, $user)
            ->add('save', SubmitType::class);

        $form->remove('promoCodes');

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $doctrineManager = $this->getDoctrine()->getManager();
            $doctrineManager->persist($user);
            $doctrineManager->flush();

            return $this->redirectToRoute('users.index');
        }

        return $this->render('@Admin/User/create.html.twig', [
            'create_form' => $form->createView()
        ]);
    }

    /**
     * @Route("/{id}/edit", name="users.edit", requirements={"id": "\d+"})
     * @param Request $request
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function editAction(Request $request, int $id)
    {
        $doctrine = $this->getDoctrine();
        $userRepository = $doctrine->getRepository('AppBundle:User');
        $user = $userRepository->find($id);

        $currentPassword = $user->getPassword();

        $form = $this->createForm(UserType::class, $user)
            ->add('save', SubmitType::class, [ 'attr' => [ 'class' => 'button' ] ])
            ->remove('promoCodes');

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            if ($user->getPassword() !== null) {
                $user->setUpdatedPassword($user->getPassword());
            } else {
                $user->setPassword($currentPassword);
            }

            $doctrineManager = $doctrine->getManager();
            $doctrineManager->persist($user);
            $doctrineManager->flush();

            return $this->redirectToRoute('users.index');
        }

        return $this->render('@Admin/User/edit.html.twig', [
            'edit_form' => $form->createView(),
            'user' => $user
        ]);
    }

    /**
     * @Route("/{id}", name="users.show", requirements={"id": "\d+"})
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showAction(Request $request, int $id)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $userRepository->find($id);

        return $this->render('@Admin/User/show.html.twig', [
            'user' => $user
        ]);
    }

    /**
     * @Route("/{id}/balance", name="users.show.balance", requirements={"id": "\d+"})
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showBalanceAction(int $id)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $userRepository->find($id);

        return $this->render('@Admin/User/balance.html.twig', [
            'user' => $user,
            'history' => $user->getBalanceHistory(),
            'currency' => BalanceHistory::CURRENCY_LABEL
        ]);
    }

    /**
     * @Route("/{id}/trades", name="users.show.trades", requirements={"id": "\d+"})
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showTradesActions(int $id)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $userRepository->find($id);

        return $this->render('@Admin/User/trades.html.twig', [
            'user' => $user,
            'trades' => $user->getTrades()
        ]);
    }

}
