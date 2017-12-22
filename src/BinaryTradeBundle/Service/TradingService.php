<?php

namespace BinaryTradeBundle\Service;

use Carbon\Carbon;

class TradingService {

    public function encodeTime($time) {
        $time = base64_encode($time);
        return base64_encode(json_encode([ 'time' => $time ]));
    }

    public function addToTime (Carbon $object, string $time): int {
        $parsedTime = 0;

        preg_match_all("/((\d+)[a-zA-Z])/im", $time, $timeGroups);
        list(,$original,$numeric) = $timeGroups;
        foreach ($original as $key => $item) {
            $numericPart = (int)($numeric[$key]);
            $char = substr($item, -1);

            switch ($char) {
                case 's':
                    $object->addSeconds($numericPart);
                    break;
                case 'm':
                    $object->addMinutes($numericPart);
                    break;
                case 'h':
                    $object->addHours($numericPart);
                    break;
                case 'd':
                    $object->addDays($numericPart);
                    break;
                case 'M':
                    $object->addMonths($numericPart);
                    break;
            }
        }

        return $parsedTime;
    }

}