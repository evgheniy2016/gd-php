<?php

namespace BinaryTradeBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TradingControllerTest extends WebTestCase
{
    public function testTrade()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/trade');
    }

}
