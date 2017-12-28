<?php

namespace ApiBundle\Controller;

use AdminBundle\Form\UserType;
use BinaryTradeBundle\Form\VerificationFilesType;
use BinaryTradeBundle\Models\VerificationFiles;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class TradesController
 * @package ApiBundle\Controller
 * @Route("trades")
 */
class TradesController extends Controller
{

    /**
     * @param UserInterface $user
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/positions", name="api.trades.positions.index", defaults={"page": 1})
     * @Route("/positions/{page}", name="api.trades.positions.page", requirements={"page": "\d+"})
     */
    public function positionsAction(UserInterface $user, int $page)
    {
        $tradesRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $users = $usersRepository->find(1);

        $trades = $tradesRepository->findOpenedTradesForUser($users);

        $paginationAdapter = new DoctrineORMAdapter($trades);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage((int) $page);

        return $this->render('@Api/Trades/history.html.twig', [
            'trades' => $pagination,
            'pagination_url' => 'api.trades.positions.page'
        ]);
    }

    /**
     * @param UserInterface $user
     * @param int $page
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/history", name="api.trades.history.index", defaults={"page": 1})
     * @Route("/history/{page}", name="api.trades.history.page", requirements={"page": "\d+"}, defaults={"page": 1})
     */
    public function historyAction(UserInterface $user, int $page = 1)
    {
        $tradesRepository = $this->getDoctrine()->getRepository('AppBundle:Trade');
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        $users = $usersRepository->find(1);

        $trades = $tradesRepository->findForUser($users);

        $paginationAdapter = new DoctrineORMAdapter($trades);
        $pagination = new Pagerfanta($paginationAdapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage((int) $page);

        return $this->render('@Api/Trades/history.html.twig', [
            'trades' => $pagination,
            'pagination_url' => 'api.trades.history.page'
        ]);
    }

    /**
     * @param UserInterface $user
     * @param int $page
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/operations/{page}", requirements={"page": "\d+"}, defaults={"page": 1}, name="api.trades.operations.page")
     */
    public function operationsAction(UserInterface $user, int $page)
    {
        $balanceHistoryRepository = $this->getDoctrine()->getRepository('AppBundle:BalanceHistory');
        $balanceHistoryRecords = $balanceHistoryRepository->findForUser($user);

        $adapter = new DoctrineORMAdapter($balanceHistoryRecords);
        $pagination = new Pagerfanta($adapter);

        $paginationTake = $this->getParameter('pagination')['take'];

        $pagination->setMaxPerPage($paginationTake);
        $pagination->setCurrentPage((int) $page);

        return $this->render('@Api/Trades/operations.html.twig', [
            'records' => $pagination
        ]);
    }

    /**
     * @Route("/withdraw", methods={"get"})
     */
    public function withdrawAction()
    {
        return $this->render('@Api/Trades/withdraw.html.twig', [
            
        ]);
    }

    /**
     * @Route("/deposit", name="api.trades.deposit", methods={"get"})
     */
    public function depositAction()
    {
        return $this->render('@Api/Trades/deposit.html.twig', [
            // ...
        ]);
    }

    /**
     * @param Request $request
     * @param UserInterface $user
     *
     * @return Response
     *
     * @Route("/my-account", methods={"get", "post"}, name="api.trades.my_account")
     */
    public function myAccountAction(UserInterface $user, Request $request)
    {
        $form = $this->createForm(UserType::class, $user, [
            'action' => $this->generateUrl('api.trades.my_account'),
            'attr' => [
                'class' => 'form form-compact'
            ]
        ]);

        $form->remove('roles')
            ->remove('promoCodes')
            ->remove('promoCode')
            ->remove('username')
            ->add('save', SubmitType::class, [
                'attr' => [
                    'class' => 'button'
                ]
            ]);

        $verificationFiles = new VerificationFiles();
        $verificationFilesForm = $this->createForm(VerificationFilesType::class, $verificationFiles, [
            'action' => $this->generateUrl('api.trades.my_account'),
            'attr' => [
                'class' => 'form form-compact'
            ]
        ]);

        $form->handleRequest($request);
        $verificationFilesForm->handleRequest($request);
        $saved = false;

        if ($form->isSubmitted() && $form->isValid()) {
            if ($user->getPassword() !== null) {
                $encodedPassword = $this->get('security.password_encoder')->encodePassword($user, $user->getPassword());
                $user->setPassword($encodedPassword);
            }

            $doctrineManager = $this->getDoctrine()->getManager();
            $doctrineManager->persist($user);
            $doctrineManager->flush();
            $saved = true;
        }

        if ($verificationFilesForm->isSubmitted() && $verificationFilesForm->isValid()) {
            $toEmail = $this->getParameter('verification_email');
            $fromEmail = $this->getParameter('emails_from');
            $message = \Swift_Message::newInstance()
                ->setFrom($fromEmail)
                ->setTo($toEmail)
                ->setSubject($user->getUsername() . ' files')
                ->setBody($this->renderView('ApiBundle:emails:verify.html.twig', [ 'user' => $user ]))
                ->setContentType('text/html');

            /**
             * @var string $key
             * @var UploadedFile $item
             */
            foreach ($verificationFiles as $key => $item) {
                $attachment = \Swift_Attachment::fromPath($item->getRealPath())->setFilename($item->getClientOriginalName());
                $message->attach($attachment);
            }

            $this->get('mailer')->send($message);
        }

        return $this->render('@Api/Trades/my_account.html.twig', [
            'myAccountForm' => $form->createView(),
            'verificationFiles' => $verificationFilesForm->createView(),
            'saved' => $saved
        ]);
    }

    /**
     * @param Request $request
     * @return Response
     *
     * @Route("/withdraw", methods={"post"}, name="api.trades.withdraw.post")
     */
    public function withdrawPostAction(Request $request)
    {
        return new Response("Response");
    }

    /**
     * @param Request $request
     * @param UserInterface $user
     * @return Response
     *
     * @Route("/deposit", name="api.trades.deposit.post", methods={"post"})
     */
    public function depositPostAction(Request $request, UserInterface $user)
    {
        return new Response('hello ' . $user->getUsername() . '!', 200);
    }
    
}
