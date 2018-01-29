<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/19/17
 * Time: 5:01 PM
 */

namespace BinaryTradeBundle\Command;

use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateUserBalanceCommand extends ContainerAwareCommand
{

    protected function configure()
    {
        $this->setName('bt:update:balances');
    }


    protected function execute(InputInterface $input, OutputInterface $output)
    {
        printf("Fetching users\n");
        $doctrine = $this->getContainer()->get('doctrine');
        $doctrineManager = $doctrine->getManager();

        $users = $this->findUsers($doctrine);
        /** @var User $user */
        foreach ($users as $user) {
            $balance = $user->getBalanceHistory();
            $balanceValue = 0;
            /** @var BalanceHistory $balanceItem */
            foreach ($balance as $balanceItem) {
                $type = $balanceItem->getType();
                if ($type === 'outgoing') {
                    $balanceValue -= (float)($balanceItem->getAmount());
                } else {
                    $balanceValue += (float)($balanceItem->getAmount());
                }
            }
            $user->setBalance($balanceValue);
            $doctrineManager->persist($user);
        }
        printf("Writing changes to database\n");
        $doctrineManager->flush();
    }

    private function findUsers($doctrine) {
        $users = $doctrine->getRepository('AppBundle:User')->findAll();

        foreach ($users as $user) {
            yield $user;
        }

//        foreach ($users as $user) {
//            yield $user;
//        }
    }


}