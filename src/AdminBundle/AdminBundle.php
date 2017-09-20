<?php

namespace AdminBundle;

use AdminBundle\Service\SidebarService;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class AdminBundle extends Bundle
{

    public function build(ContainerBuilder $container)
    {
        $container->registerForAutoconfiguration(SidebarService::class);
    }




}
