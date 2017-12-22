<?php

namespace AppBundle\Repository;

/**
 * AssetRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class AssetRepository extends \Doctrine\ORM\EntityRepository
{

    public function findAllOrderById()
    {
        return $this->createQueryBuilder('asset')
            ->orderBy('asset.id', 'desc');
    }

    public function paginate($page, $take = 15)
    {
        return $this
            ->createQueryBuilder('asset')
            ->orderBy('asset.id', 'desc');
    }

}
