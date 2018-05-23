<?php

namespace BinaryTradeBundle\Command;

use AppBundle\Entity\Session;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CloseSessionsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('sessions:close')
            ->setDescription('Close active sessions');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $doctrine = $this->getContainer()->get('doctrine');
        $sessionsRepository = $doctrine->getRepository('AppBundle:Session');
        $overdueSessions = $sessionsRepository->findAllActiveOverdueSessions()->getQuery()->getResult();

        dump($overdueSessions);

        $manager = $doctrine->getManager();

        /** @var Session $session */
        foreach ($overdueSessions as $session) {
            $session->setIsOnline(false);
            $manager->persist($session);
        }

        $manager->flush();

        $logger = $this->getContainer()->get('logger');
        $logger->info("All overdue sessions are closed now");
        $output->writeln('All overdue sessions are closed now');
    }

}
