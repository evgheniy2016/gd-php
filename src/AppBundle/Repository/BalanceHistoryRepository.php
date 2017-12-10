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
            ->setParameter('user', $user);
    }

}