import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as SpookySwapIcon } from "../../assets/icons/spookyswap.svg";
import { ReactComponent as SpiritSwapIcon } from "../../assets/icons/spiritswap.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { AccountBalanceOutlined, MonetizationOnOutlined } from "@material-ui/icons";


const externalUrls = [
  // {
  //   title: "Forum",
  //   url: "https://forum.app.hectordao.com/",
  //   icon: <SvgIcon color="primary" component={ForumIcon} />,
  // },
  // {
  //   title: "Governance",
  //   url: "https://vote.app.hectordao.com/",
  //   icon: <SvgIcon color="primary" component={GovIcon} />,
  // },
  
  // {
  //   title: "Buy on AthenSwap",
  //   url: "https://swap.athen.com/swap?inputCurrency=0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3&outputCurrency=0x7D8461077e7D774a12F407124Af3c7CC06AD3Cbb",
  //   icon: <SvgIcon viewBox="0 0 250 250" color="primary" component={SpiritSwapIcon} />,
  // },
  // {
  //   title: "Athen Loan",
  //   label: "(Coming soon)",
  //   icon: <MonetizationOnOutlined viewBox="0 0 20 24" />,
  // },
  // {
  //   title: "Athen Borrow",
  //   label: "(Coming soon)",
  //   icon: <MonetizationOnOutlined viewBox="0 0 20 24" />,
  // },
  // {
  //   title: "Athen PRO",
  //   label: "(Coming soon)",
  //   icon: <AccountBalanceOutlined viewBox="0 0 20 24" />,
  // },
  // {
  //   title: "Governance",
  //   url: "https://snapshot.org/#/hectordao.eth",
  //   icon: <SvgIcon color="primary" component={GovIcon} />,
  // },
  {
    title: "Docs",
    // label: "(Coming soon)",
    
    icon: <SvgIcon color="primary" component={DocsIcon} />,
    url: "https://hom-dao.gitbook.io/hom-dao/",
  },
  {
    title: "VOTE",
    // label: "(Coming soon)",
    
    icon: <SvgIcon color="primary" component={DocsIcon} />,
    url: "https://snapshot.org/#/homdao.eth/",
  },
  // {
  //   title: "SnapShot",
  //   label: "(Coming soon)",
    
  //   icon: <SvgIcon color="primary" component={DocsIcon} />,
  //  // url: "https://hom-dao.gitbook.io/hom-dao/",
  // },
  // {
  //   title: " Buy on Quickswap",
  //   url: "https://quickswap.exchange/#/swap?inputCurrency=0x8f3cf7ad23cd3cadbd9735aff958023239c6a063&outputCurrency=0x9fe19698aE613Ae626CC3670A92A105e1089D68E",
    
    
  //   // https://traderjoexyz.com/#/trade?inputCurrency=&outputCurrency=0x84506992349429DaC867B2168843FfcA263af6E8",
  //   icon: <img src="/images/quickswap_logo.png" style={{"width":"24px"}} />,
  // },
  // {
  //   title: "Chart",
  //   url: "https://dexscreener.com/avalanche/0x84506992349429DaC867B2168843FfcA263af6E8",
  //   // icon: <img src="/images/traderjoe.png" style={{"width":"24px"}} />,
  // },
  // {
  //   title: "Feedback",
  //   url: "https://olympusdao.canny.io/",
  //   icon: <SvgIcon color="primary" component={FeedbackIcon} />,
  // },
];

export default externalUrls;
