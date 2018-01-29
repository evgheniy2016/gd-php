<?php

namespace AdminBundle\Command;

use AppBundle\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class CreateAdminCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('admin:create')
            ->setDescription('Creating admin record')
            ->addArgument('email', InputArgument::REQUIRED, 'Administrator email address')
            ->addArgument('password', InputArgument::REQUIRED, 'Administrator password')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        /** @var ManagerRegistry $doctrine */
        $doctrine = $this->getContainer()->get('doctrine');
        $doctrineManager = $doctrine->getManager();

        $username = explode('@', $email);

        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username[0]);
        $user->setPassword($password);
        $user->setRoles([ 'ROLE_SUPER_ADMIN' ]);

        $encodedPassword = $this->getContainer()->get('security.password_encoder')->encodePassword($user, $user->getPassword());
        $user->setPassword($encodedPassword);

        $doctrineManager->persist($user);
        $doctrineManager->flush();

        $output->writeln("User successfully created");
    }

}
