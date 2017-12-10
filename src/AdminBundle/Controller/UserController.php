<?php

namespace AdminBundle\Controller;

use AdminBundle\Form\SaveAndDeleteType;
use AdminBundle\Form\TradeType;
use AdminBundle\Form\UserType;
use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\Trade;
use AppBundle\Entity\User;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
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
     * @Route("/page/{page}", name="users.index.page", defaults={"page": 1}, requirements={"page": "\d+"})
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($page = 1)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $users = $userRepository->findByRole('ROLE_USER');

        $paginationTake = $this->getParameter('pagination')['take'];

        $paginationAdapter = new DoctrineORMAdapter($users);
        $pagination = new Pagerfanta($paginationAdapter);

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('AdminBundle:User:index.html.twig', [
            'users' => $pagination
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
     * @Route("/{id}/balance/page/{page}", name="users.show.balance.page", defaults={"page": 1}, requirements={"id": "\d+", "page": "\d+"})
     * @param int $id
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showBalanceAction(int $id, int $page = 1)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $balanceHistoryRepository = $this->getDoctrine()->getRepository('AppBundle:BalanceHistory');

        $user = $userRepository->find($id);
        $balanceHistory = $balanceHistoryRepository->findForUser($user);

        $paginationAdapter = new DoctrineORMAdapter($balanceHistory);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('@Admin/User/balance.html.twig', [
            'user' => $user,
            'history' => $pagination,
            'currency' => BalanceHistory::$CURRENCY_LABEL
        ]);
    }

    /**
     * @Route("/{id}/trades", name="users.show.trades", defaults={"page": 1}, requirements={"id": "\d+"})
     * @Route("/{id}/trades/page/{page}", name="users.show.trades.page", defaults={"page": 1}, requirements={"id": "\d+", "page": "\d+"})
     * @param int $id
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function showTradesActions(int $id, int $page = 1)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $tradeRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $user = $userRepository->find($id);

        $trades = $tradeRepository->findForUser($user);

        $paginationAdapter = new DoctrineORMAdapter($trades);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        return $this->render('@Admin/User/trades.html.twig', [
            'user' => $user,
            'trades' => $pagination
        ]);
    }

}
