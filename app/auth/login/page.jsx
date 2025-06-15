
import mosyThemeConfigs from '../../appConfigs/mosyTheme';
import saAuthConfigs from '../featureConfig/saAuthConfigs'; 


import DefaultLoginForm from './uiControl/DefaultLoginForm';
import MiniWidgetLoginForm from './uiControl/MiniWidgetLoginForm'
import SplitCardLoginForm from './uiControl/SplitCardLoginForm'
import LoginLayout_WPStyle from './uiControl/LoginLayout_WPStyle'

export async function generateMetadata() {
  const appName = mosyThemeConfigs.mosyAppName || 'Mosy';
  
  return {
    title: `Login :: ${appName}`,
    description: `${appName}`,
    
    icons: {
      icon: "/logo.png"
    },

  };


}


export default function AuthPage() {
  const loginBgImg =saAuthConfigs.loginBgImage;
  const appLogo = mosyThemeConfigs.mosyAppLogo;
  const appName = mosyThemeConfigs.mosyAppName;
  const showResetLink =saAuthConfigs.showResetLink;
  const changePasswordUrl = saAuthConfigs.changePasswordUrl;
  const showCreateAccount = saAuthConfigs.showCreateAccount;
  const registerUrl = saAuthConfigs.registerUrl;

  return (
    <DefaultLoginForm
      loginBgImg={loginBgImg}
      appLogo={appLogo}
      appName={appName}
      showResetLink={showResetLink}
      changePasswordUrl={changePasswordUrl}
      showCreateAccount={showCreateAccount}
      registerUrl={registerUrl}
    />
  );
}
