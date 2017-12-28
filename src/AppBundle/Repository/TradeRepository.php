<?php

namespace AppBundle\Repository;
use AppBundle\Entity\User;

/**
 * TradeRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TradeRepository extends \Doctrine\ORM\EntityRepository
{

    public function findForUser(User $user)
    {
        return $this->createQueryBuilder('trade')
            ->where('trade.user = :user')
            ->setParameter('user', $user)
            ->orderBy('trade.id', 'desc');
    }

    public function findOpenedTrades()
    {
        return $this->createQueryBuilder('trade')
            ->where('trade.finished = false')
            ->orderBy('trade.id', 'desc');
    }

    public function findOpenedTradesForUser(User $user)
    {
        return $this->createQueryBuilder('trade')
            ->where('trade.user = :user')
            ->andWhere('trade.finished = :finished')
            ->orderBy('trade.id', 'desc')
            ->setParameter('user', $user)
            ->setParameter('finished', 0);
    }

}
