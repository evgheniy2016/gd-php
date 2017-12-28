import {userTradings} from "./actions/user-tradings";
import {assetEditForm} from "./actions/asset-edit-form";

export default {

  'users.edit':[ { action: userTradings } ],
  'assets.edit': [ {action: assetEditForm } ],
  'assets.create': [ {action: assetEditForm} ]

};
