import {assetsCourses} from "./actions/assets-courses";
import {tradingGraph} from "./actions/trading-graph";
import {tabs} from "./tabs";
import {withdrawPage} from "./actions/withdraw";

export default {

  'homepage': [
    { action: assetsCourses }
  ],
  'trade': [
    { action: tradingGraph },
    { action: tabs }
  ],
  'api.trades.withdraw.post': [
    { action: withdrawPage }
  ]

};