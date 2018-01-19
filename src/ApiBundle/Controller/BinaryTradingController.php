<?php

namespace ApiBundle\Controller;

use AppBundle\Entity\BalanceHistory;
use AppBundle\Entity\Trade;
use AppBundle\Entity\User;
use BinaryTradeBundle\Service\TradingService;
use Carbon\Carbon;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class BinaryTradingController
 * @package ApiBundle\Controller
 *
 * @Route("binary-trading")
 */
class BinaryTradingController extends Controller
{

    /**
     * @param Request $request
     * @Route("/place-a-bet", methods={"post"})
     * @return JsonResponse
     */
    public function placeABetAction(Request $request)
    {
        $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');
        /** @var User $user */
        $user = $usersRepository->find($request->get('user_id'));

        $tradingService = new TradingService();
        $carbonTime = Carbon::now();
        $currentTimestamp = $carbonTime->getTimestamp();
        $time = $request->get('time');
        $time = base64_decode($time);
        $time = json_decode($time);
        $time = $time->time;
        $time = base64_decode($time);

        $tradingService->addToTime($carbonTime, $time);
        $targetTimestamp = $carbonTime->getTimestamp();
        $amount = (float)($request->get('amount', 0));

        $currentBalance = (float)($user->getBalance());
        $currentBalance -= $amount;

        if ($currentBalance <= 0) {
            return new JsonResponse([
                'response' => 'error',
                'message' => 'Недостаточно средств на счету'
            ]);
        }

        $direction = $request->get('direction');

        if (!in_array($direction, [ 'up', 'down' ])) {
            return new JsonResponse([
                'response' => 'error',
                'message' => 'Укажите тип ставки'
            ]);
        }

        $user->setBalance($currentBalance);
        $user->setBalanceUpdatedAt(Carbon::now()->getTimestamp());

        $trade = new Trade();
        $trade->setUser($user);
        $trade->setPeriod($time);
        $trade->setCreatedAt($currentTimestamp . '');
        $trade->setExpireAt($targetTimestamp . '');
        $trade->setAmount($amount);
        $trade->setDirection($direction);
        $trade->setAsset($request->get('asset'));
        $trade->setFinished(false);
        $trade->setGainings(0);
        $trade->setPredefinedDirection('');
        $trade->setAssetName('USD-BTC');
        $trade->setAssetPrice($request->get('price'));
        $trade->setOfferMultiplier((float)($request->get('offer_multiplier')));

        $doctrineManager = $this->getDoctrine()->getManager();
        $doctrineManager->persist($trade);

        $balanceHistoryItem = new BalanceHistory();
        $balanceHistoryItem->setAmount($amount);
        $balanceHistoryItem->setType('outgoing');
        $balanceHistoryItem->setUser($user);
        $balanceHistoryItem->setTrade($trade);

        $doctrineManager->persist($user);
        $doctrineManager->persist($balanceHistoryItem);
        $doctrineManager->flush();

        return new JsonResponse([
            'currentTimestamp' => $currentTimestamp,
            'request' => [
                'direction' => $direction,
                'amount' => $request->get('amount'),
                'asset' => $request->get('asset')
            ],
            'time' => $time,
            'target_timestamp' => $targetTimestamp,
            'balance' => $user->getBalance()
        ]);
    }

    /**
     * @param Request $request
     * @Route("/update-balance", name="update_balance")
     * @return JsonResponse
     */
    public function updateBalanceAction(Request $request)
    {
        $requestContent = $request->getContent();

        if (strpos($requestContent, 'uid') === 0) {
            list(,$uid) = explode('=', $requestContent);
            $balanceHistoryRepository = $this->getDoctrine()->getRepository('AppBundle:BalanceHistory');
            $usersRepository = $this->getDoctrine()->getRepository('AppBundle:User');

            $user = $usersRepository->find($uid);
            /** @var BalanceHistory $lastBalanceHistoryItem */
            $lastBalanceHistoryItem = $balanceHistoryRepository->findLastForUser($user)->getQuery()->getResult();
            /** @var float $currentBalance */
            $currentBalance = (float)($user->getBalance());
            $lastBalanceHistoryItem = $lastBalanceHistoryItem[0];

            $amount = (float)($lastBalanceHistoryItem['amount']);
            if ($lastBalanceHistoryItem['type'] === 'outgoing') {
                $currentBalance -= $amount;
            } else {
                $currentBalance += $amount;
            }
            $user->setBalance($currentBalance);
            $user->setBalanceUpdatedAt(Carbon::now()->getTimestamp());
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
            return new JsonResponse([
                'response' => 'success',
                'balance' => $currentBalance
            ]);
        }

        throw new NotFoundHttpException("Page not found");
    }

}