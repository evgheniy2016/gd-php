import {assetsCourses} from "./actions/assets-courses";
import {tradingGraph} from "./actions/trading-graph";

export default {

  'homepage': [
    { action: assetsCourses }
  ],
  'trade': [
    { action: tradingGraph }
  ]

};