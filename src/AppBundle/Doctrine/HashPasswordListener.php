<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 10/11/17
 * Time: 1:44 PM
 */

namespace AppBundle\Doctrine;


use AppBundle\Entity\User;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;

class HashPasswordListener implements EventSubscriber
{

    protected $passwordEncoder;

    public function __construct(UserPasswordEncoder $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * Returns an array of events this subscriber wants to listen to.
     *
     * @return array
     */
    public function getSubscribedEvents()
    {
        return [ 'prePersist', 'preUpdate' ];
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if (!$entity instanceof User) {
            return;
        }

        if ($entity->getUpdatedPassword() !== null && strlen($entity->getUpdatedPassword()) > 0) {
            $this->encodePassword($entity);
        }
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        if (!$entity instanceof User) {
            return;
        }

        if ($entity->getUpdatedPassword() !== null && strlen($entity->getUpdatedPassword()) > 0) {
            $this->encodePassword($entity);

            $em = $args->getEntityManager();
            $meta = $em->getClassMetadata(get_class($entity));
            $em->getUnitOfWork()->recomputeSingleEntityChangeSet($meta, $entity);
        }
    }

    /**
     * @param $entity User
     */
    public function encodePassword(User $entity): void
    {
        $encoded = $this->passwordEncoder->encodePassword($entity, $entity->getUpdatedPassword());
        $entity->setPassword($encoded);
    }

}