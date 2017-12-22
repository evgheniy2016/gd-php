<?php

namespace AppBundle\Repository;

use AppBundle\Entity\User;

/**
 * BalanceHistoryRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class BalanceHistoryRepository extends \Doctrine\ORM\EntityRepository
{

    public function findForUser(User $user)
    {
        return $this->createQueryBuilder('balance_history')
            ->where('balance_history.user = :user')
            ->setParameter('user', $user)
            ->orderBy('balance_history.id', 'desc');
    }

    public function findLastForUser(User $user)
    {
        return $this->createQueryBuilder('balance_history')
            ->where('balance_history.user = :user')
            ->select('balance_history.amount, balance_history.type')
            ->setMaxResults(1)
            ->setParameter('user', $user)
            ->orderBy('balance_history.id', 'desc');
    }

}
