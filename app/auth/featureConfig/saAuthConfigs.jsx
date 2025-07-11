// Configs for Next.js Auth System (sauth_configs)
// appConfigs.js
import Image from 'next/image';
import tanker from '../../img/tanker.avif'; // outside public!
import {hiveRoutes} from '../../appConfigs/hiveRoutes'; 


const commonRoot = "/"; // Adjust to your base path or env var if needed


const saAuthConfigs = {
  sessionPrefix: "originproject",
  oauthTable: "system_users",
  primkey: "primkey",

  // DB column mappings
  userIdCol: "user_id",
  usernameCol: "name",
  emailCol: "email",
  phoneCol: "tel",
  passwordCol: "login_password",
  sessionColumns : "user_id,email,tel,name",

  // Post-login redirect
  afterSplashPage:`${hiveRoutes.octaneorbit}/dashboard/overview`,

  // UI toggles
  showResetLink: false, // true || false
  showCreateAccount: false, // true || false

  // Routes (UI component files/pages, not PHP scripts)
  loginUrl: "login",
  registerUrl: "register",
  changePasswordUrl: "resetpassword",
  resetPasswordUrl: "resetpassword",
  
  //Api endpoints
  createUserApi : "/api/revuiov2/systemusers/users",

  // Login page background + UI widget choice
  loginBgImage: tanker.src,
  loginWidget: "hive_login_center_wgt", // e.g., hive_login_center_wgt || hive_login_dark_clear_center_wgt
};

export default saAuthConfigs;
