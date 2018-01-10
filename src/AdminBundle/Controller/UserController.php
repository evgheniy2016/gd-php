<?php

namespace AdminBundle\Controller;

use AdminBundle\AdminBundle;
use AdminBundle\Form\BalanceHistoryType;
use AdminBundle\Form\SaveAndDeleteType;
use AdminBundle\Form\TradeType;
use AdminBundle\Form\UserType;
use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\Note;
use AppBundle\Entity\Trade;
use AppBundle\Entity\User;
use Carbon\Carbon;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\SubmitButton;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

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
     *
     * @throws \Exception
     */
    public function indexAction($page = 1, Request $request)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        $users = null;
        $filterByPromoCode = false;

        $promoCode = $request->get('promo', null);
        if ($promoCode !== null) {
            $filterByPromoCode = true;
            $promoCodeRepository = $this->getDoctrine()->getRepository('AppBundle:PromoCode');
            $promoCode = $promoCodeRepository->findOneBy([ 'code' => $promoCode ]);
        }

        if (in_array('ROLE_MANAGER', $currentUser->getRoles())) {
            $users = $userRepository->findByRoleAndPromoCode(['ROLE_USER'], $filterByPromoCode ? [ $promoCode ] : $currentUser->getPromoCodes());
        } else if (in_array('ROLE_SUPER_ADMIN', $currentUser->getRoles())) {
            if ($promoCode !== null && $filterByPromoCode) {
                $users = $userRepository->findByRoleAndPromoCode(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MANAGER'], [ $promoCode ]);
            } else {
                $users = $userRepository->findByRole(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MANAGER']);
            }
        } else {
            throw new \Exception("You not allowed to view this data");
        }

        $paginationTake = $this->getParameter('pagination')['take'];

        $paginationAdapter = new DoctrineORMAdapter($users);
        $pagination = new Pagerfanta($paginationAdapter);

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage($page);

        $promoArray = [];
        if ($filterByPromoCode) {
            $promoArray = [ 'promo' => $request->get('promo') ];
        }

        return $this->render('AdminBundle:User:index.html.twig', [
            'users' => $pagination,
            'filter_by_promo_code' => $filterByPromoCode,
            'params' => $promoArray
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

        if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
            $form->remove('roles')->remove('save');
        }

        $form->remove('promoCodes');

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
                return $this->redirectToRoute('users.index');
            }

            $user->generateApiKey();

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

        if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
            $form->remove('roles')->remove('save');
        }

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
                return $this->redirectToRoute('users.show', [ 'id' => $id ]);
            }

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

    /**
     * @Route("/{id}/give-a-bonus", name="users.show.give_a_bonus", requirements={"id": "\d+"})
     * @param int $id
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function giveABonusAction(int $id, Request $request)
    {
        $userRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $userRepository->find($id);

        $balanceHistory = new BalanceHistory();
        $balanceHistory->setType('bonus');
        $balanceHistory->setUser($user);

        $form = $this->createForm(BalanceHistoryType::class, $balanceHistory);
        $form->remove('type')->remove('user');
        $form->add('save', SubmitType::class, [
            'attr' => [
                'class' => 'button'
            ]
        ]);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $currentBalance = (float)($user->getBalance());
            $currentBalance += $balanceHistory->getAmount();
            $user->setBalance($currentBalance);
            $user->setBalanceUpdatedAt(Carbon::now()->getTimestamp());

            $this->getDoctrine()->getManager()->persist($balanceHistory);
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('notice', 'app.bonus.created');
        }

        return $this->render('@Admin/User/give_a_bonus.html.twig', [
            'user' => $user,
            'form' => $form->createView()
        ]);
    }

    /**
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/{id}/notes", name="users.show.notes", requirements={"id": "\d+"})
     */
    public function notesAction(int $id, UserInterface $currentUser)
    {
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $notesRepository = $this->getDoctrine()->getRepository('AppBundle:Note');
        $user = $usersRepository->find($id);
        $notes = $notesRepository->getUserNotesOrderedByIdDesc($user)->getQuery()->getResult();

        $key = sha1(json_encode([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'salt' => $currentUser->getSalt()
        ]));

        return $this->render('@Admin/User/notes.html.twig', [
            'user' => $user,
            'key' => $key,
            'notes' => $notes
        ]);
    }

    /**
     * @param int $id
     * @param Request $request
     * @param UserInterface $currentUser
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     * @Route("/{id}/notes/create", requirements={"id": "\d+"}, name="users.note.create")
     */
    public function createNoteAction(int $id, Request $request, UserInterface $currentUser)
    {
        $content = $request->get('content');
        $key = $request->get('key');

        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $usersRepository->find($id);

        $verificationKey = sha1(json_encode([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'salt' => $currentUser->getSalt()
        ]));

        if ($verificationKey !== $key) {
            $this->addFlash('notice', 'app.verification.failed');
            return $this->redirectToRoute('users.show.notes', [ 'id' => $user->getId() ]);
        }

        $note = new Note();
        $note->setContent($content);
        $note->setUser($user);

        $doctrineManager = $this->getDoctrine()->getManager();

        $doctrineManager->persist($note);
        $doctrineManager->flush();
        return $this->redirectToRoute('users.show.notes', [ 'id' => $user->getId() ]);
    }

    /**
     * @param int $id
     * @param int $noteId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     *
     * @Route("/{id}/note/{noteId}", requirements={"id": "\d+", "noteId": "\d+"}, name="users.note.delete")
     */
    public function deleteNoteAction(int $id, int $noteId)
    {
        if (!$this->isGranted('ROLE_SUPER_ADMIN')) {
            return $this->redirectToRoute('users.show.notes', [ 'id' => $id ]);
        }

        $notesRepository = $this->getDoctrine()->getRepository('AppBundle:Note');
        $note = $notesRepository->find($noteId);

        if ($note->getUser()->getId() !== $id) {
            return $this->redirectToRoute('users.show.notes', [ 'id' => $id ]);
        }

        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->remove($note);
        $doctrineManager->flush();

        return $this->redirectToRoute('users.show.notes', [ 'id' => $id ]);
    }

    /**
     * @Route("/{id}/trades/{tid}/direction", requirements={"id": "\d+", "tid": "\d+"}, name="users.trades.predefined_direction")
     * @param Request $request
     * @param $id
     * @param $tid
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function setPredefinedDirectionAction(Request $request, int $id, int $tid)
    {
        $tradeRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $trade = $tradeRepository->find($tid);
        if ($trade->getUser()->getId() != $id) {
            return $this->redirectToRoute('users.index');
        }

        $trade->setPredefinedDirection($request->get('predefined_direction'));
        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->persist($trade);
        $doctrineManager->flush();

        $referer = $_SERVER['HTTP_REFERER'];
        return $this->redirect($referer);
    }

}
