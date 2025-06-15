// appConfigs.js
import Image from 'next/image';
import logo from '../img/logo/logo.png'; // outside public!


const commonRoot = ""; // Update this path if needed

const mosyThemeConfigs = {
  // App Identity
  mosyAppName: "Octane Orbit ERP",
  mosyAppLogo: logo.src,
  mosyAppLogoStyle: {
    width: "auto",
    height: "50px",
  },

  // Color Scheme
  themeName: "Mosy",
  btnBg: "#5E2816",
  btnTxt: "#fff",
  ctnBg: "#fff",
  ctnTxt: "#000",
  bodyColor: "rgba(255, 255, 255, 0.9)",
  bodyTxt: "#000",
  navBarBgColor: "#FFF",
  navbarBorderColor: "#ccc",
  navbarBorderSize: "1",
  navShadowClass: "shadow-sm",
  genBorderColor: "#5E2816",
  genBorderSize: "1",
  wildColor: "",
  skinPlasma: "rgba(255, 255, 255, 0.0)",
  bodySkinCss: "#f8f9fa",

  systemBorderRadius : "20px",

  // Gradient and Sidebar
  btnFirstColor: "#000000",
  btnSecondColor: "#5E2816",
  get sideBarBg() {
    return `linear-gradient(225deg, ${this.btnFirstColor}, ${this.btnSecondColor})`;
    //return this.btnBg;
  },

  get sideBarTxt() {
    return this.btnTxt;
  },


  get sideBarChipBg() {
    return this.sideBarBg;
  },
  get sideBarChipTxt() {
    return this.sideBarTxt;
  },
  sideBarType: "", // mini-sidebar || ""

  // App Colors Shortcut
  get skinClr() {
    return this.ctnBg;
  },
  get buttonClr() {
    return this.btnBg;
  },
  get genTxtClr() {
    return this.ctnTxt;
  },
  get buttonTxtClr() {
    return this.btnTxt;
  },

  // App Routing (placeholder, update with actual Next.js routes)
  appIndexPage: "/sedcoclient/mywallet",
};

export default mosyThemeConfigs;
