<?php

namespace AppBundle\Repository;
use AppBundle\Entity\User;
use Carbon\Carbon;

/**
 * SessionRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SessionRepository extends \Doctrine\ORM\EntityRepository
{

    public function findLastActiveUserSession(User $user)
    {
        /** @var Carbon $currentTimestamp */
        $currentTimestamp = Carbon::now();
        $currentTimestamp->addMinutes(-15);

        return $this->createQueryBuilder('session')
            ->where('session.user = :user')
            ->andWhere('session.updatedAt >= :current_timestamp')
            ->setParameter('user', $user)
            ->setParameter('current_timestamp', $currentTimestamp);
    }

    public function findActiveSessions(User $user)
    {
        return $this->createQueryBuilder('session')
            ->where('session.user = :user')
            ->andWhere('session.isOnline = :isOnline')
            ->setParameter('user', $user)
            ->setParameter('isOnline', true);
    }

    public function hasLastActiveUserSession(User $user)
    {
        return $this->findLastActiveUserSession($user)
            ->andWhere('session.isOnline = :isOnline')
            ->setParameter('isOnline', true)
            ->select('count(session.id)');
    }

    public function getClosedUserSessions(User $user)
    {
        return $this->createQueryBuilder('session')
            ->where('session.user = :user')
            ->andWhere('session.isOnline = :isOnline')
            ->setParameter('user', $user)
            ->setParameter('isOnline', false);
    }

    /**
     * @return \Doctrine\ORM\QueryBuilder
     */
    public function findAllActiveOverdueSessions() {
        /** @var Carbon $currentTimestamp */
        $currentTimestamp = Carbon::now();
        $currentTimestamp->addMinutes(-15);

        return $this->createQueryBuilder('session')
            ->where('session.isOnline = true')
            ->andWhere('session.updatedAt <= :current_timestamp')
            ->setParameter('current_timestamp', $currentTimestamp);
    }

}
