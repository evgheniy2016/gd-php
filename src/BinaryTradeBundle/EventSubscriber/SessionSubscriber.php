<?php
/**
 * Created by PhpStorm.
 * User: Alexey
 * Date: 30.12.2017
 * Time: 18:38
 */

namespace BinaryTradeBundle\EventSubscriber;


use AppBundle\Entity\Session;
use AppBundle\Entity\User;
use Carbon\Carbon;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\AuthenticationEvents;
use Symfony\Component\Security\Core\Event\AuthenticationEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class SessionSubscriber implements EventSubscriberInterface
{

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    private $session;

    private $doctrine;

    public function __construct(LoggerInterface $logger, TokenStorageInterface $tokenStorage, SessionInterface $session, Registry $doctrine)
    {
        $this->logger = $logger;
        $this->tokenStorage = $tokenStorage;
        $this->session = $session;
        $this->doctrine = $doctrine;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $usersRepository = $this->doctrine->getRepository('AppBundle:User');
        $userId = $event->getRequest()->getSession()->get('user_id', null);

        if ($userId === null) {
            return;
        }

        $user = $usersRepository->find($userId);
        $this->updatedSession($user);
    }

    public function onSecurityAuthenticationSuccess(AuthenticationEvent $event)
    {
        $user = $event->getAuthenticationToken()->getUser();
        if (gettype($user) === "string" || get_class($user) !== User::class) {
            return;
        }

        $this->session->set('user_id', $user->getId());
        $this->updatedSession($user);
    }

    /**
     * Returns an array of event names this subscriber wants to listen to.
     *
     * The array keys are event names and the value can be:
     *
     *  * The method name to call (priority defaults to 0)
     *  * An array composed of the method name to call and the priority
     *  * An array of arrays composed of the method names to call and respective
     *    priorities, or 0 if unset
     *
     * For instance:
     *
     *  * array('eventName' => 'methodName')
     *  * array('eventName' => array('methodName', $priority))
     *  * array('eventName' => array(array('methodName1', $priority), array('methodName2')))
     *
     * @return array The event names to listen to
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
            AuthenticationEvents::AUTHENTICATION_SUCCESS => 'onSecurityAuthenticationSuccess'
        ];
    }

    private function updatedSession(User $user) {
        $sessionsRepository = $this->doctrine->getRepository('AppBundle:Session');
        $session = $sessionsRepository->findLastActiveUserSession($user)->getQuery()->getResult();
        $currentTime = Carbon::now();
        $doctrineManager = $this->doctrine->getManager();

        if (count($session) > 0) {
            $session = $session[0];
        } else {
            $activeSessions = $sessionsRepository->findActiveSessions($user);
            /** @var Session $activeSession */
            foreach ($activeSessions as $activeSession) {
                $activeSession->setIsOnline(false);
                $doctrineManager->persist($activeSession);
            }

            $session = new Session();
            $session->setUser($user);
            $session->setCreatedAt($currentTime);
        }

        $session->setUpdatedAt($currentTime);
        $session->setIsOnline(true);

        $doctrineManager->persist($session);
        $doctrineManager->flush();
    }

}