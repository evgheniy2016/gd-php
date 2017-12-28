import {assetsCourses} from "./actions/assets-courses";
import {tradingGraph} from "./actions/trading-graph";
import {tabs} from "./tabs";

export default {

  'homepage': [
    { action: assetsCourses }
  ],
  'trade': [
    { action: tradingGraph },
    { action: tabs }
  ]

};