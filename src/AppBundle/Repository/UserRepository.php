<?php

namespace AppBundle\Repository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use PHPUnit\Runner\Exception;

/**
 * UserRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserRepository extends \Doctrine\ORM\EntityRepository
{

    public function findByRole($roles)
    {
        $query = $this->createQueryBuilder('u');

        foreach ($roles as $key => $role) {
            if ($key === 0) {
                $query->where('u.roles like :role_' . $key);
            } else {
                $query->orWhere('u.roles like :role_' . $key);
            }
            $query->setParameter('role_' . $key, "%{$role}%");
        }

        $query->orderBy('u.id', 'desc');

        return $query;
    }

    public function paginateByRole($role, $take, $page = 1)
    {
        if ($page < 1) {
            $page = 1;
        }

        return $this->findByRole($role)
            ->setFirstResult($take * ($page - 1))
            ->setMaxResults($take);
    }

    public function findByRoleAndPromoCode($roles, $promoCodes)
    {
        return $this->findByRole($roles)
            ->andWhere('u.promoCode in(:codes)')
            ->setParameter('codes', $promoCodes);
    }

    public function getTotalCount()
    {
        try {
            return $this->createQueryBuilder('user')
                ->select('count(user.id)')
                ->getQuery()
                ->getSingleScalarResult();
        } catch (\Exception $e) {
            return 0;
        }
    }

}
