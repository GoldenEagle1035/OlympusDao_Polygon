import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { getTokenImage } from "../../helpers";
import { useSelector } from "react-redux";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sHOMTokenImg } from "../../assets/tokens/token_sHOM.svg";
import { ReactComponent as HOMTokenImg } from "../../assets/tokens/token_HOM.svg";
import { ReactComponent as pHOMTokenImg } from "../../assets/tokens/token_pHOM.svg";
import { ReactComponent as spHOMTokenImg } from "../../assets/tokens/token_spHOM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";

import "./ohmmenu.scss";
import { dai } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import HOMImg from "src/assets/tokens/HOM.svg";
import SHOMImg from "src/assets/tokens/sHOM.svg";
import PHOMImg from "src/assets/tokens/pHOM.svg";
import SPHOMImg from "src/assets/tokens/spHOM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sBHD logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "BHD") {

    // } ? BhdImg : SBhdImg;
    switch (tokenSymbol) {
      case "HOM":
        tokenPath = HOMImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "pHOM":
        tokenPath = PHOMImg;
        break;
      case "spHOM" :
        tokenPath = SPHOMImg;
        break;
      default:
        tokenPath = SHOMImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function HOMMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

 // const SHOM_ADDRESS = addresses[networkID].SHOM_ADDRESS;
  const HOM_ADDRESS = addresses[networkID].HOM_ADDRESS;
  const PHOM_ADDRESS = addresses[networkID].PHOM_ADDRESS;
  const SPHOM_ADDRESS = addresses[networkID].SPHOM_ADDRESS;
  // const USDC_ADDRESS = addresses[networkID].USDC_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" title="HOM" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>PHOM to your wallet</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  {/* <Link
                    href={`https://quickswap.exchange/#/swap?inputCurrency=${daiAddress}&outputCurrency=${HOM_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on QuickSwap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}

                  {/* <Link
                    href={`https://swap.spiritswap.finance/#/add/${USDC_ADDRESS}/${HOM_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        DOCS <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}

                  {/* <Link href={`https://abracadabra.money/pool/10`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Wrap sBHD on Abracadabra <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link> */}
                </Box>

                {/* <Box component="div" className="data-links">
                  <Divider color="secondary" className="less-margin" />
                  <Link href={`https://dune.xyz/shadow/Olympus-(BHD)`} target="_blank" rel="noreferrer">
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box> */}

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {/* <Button variant="contained" color="secondary" onClick={addTokenToWallet("HOM", HOM_ADDRESS)}>
                        <SvgIcon
                          component={HOMTokenImg}
                          viewBox="0 0 60 60"
                          style={{ height: "60px", width: "60px" }}
                        />
                        <Typography variant="body1">HOM</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("sHOM", SHOM_ADDRESS)}>
                        <SvgIcon
                          component={sHOMTokenImg}
                          viewBox="0 0 60 60"
                          style={{ height: "60px", width: "60px" }}
                        />
                        <Typography variant="body1">sHOM</Typography>
                      </Button> */}
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("pHOM", PHOM_ADDRESS)}>
                        <SvgIcon
                          component={pHOMTokenImg}
                          viewBox="0 0 50 50"
                          style={{ height: "50px", width: "50px" }}
                        />
                        <Typography variant="body1">pHOM</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("spHOM", SPHOM_ADDRESS)}>
                        <SvgIcon
                          component={spHOMTokenImg}
                          viewBox="0 0 50 50"
                          style={{ height: "50px", width: "50px" }}
                        />
                        <Typography variant="body1">spHOM</Typography>
                      </Button>
                      {/* <Button variant="contained" color="secondary" onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS)}>
                        <SvgIcon
                          component={t33TokenImg}
                          viewBox="0 0 1000 1000"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">33T</Typography>
                      </Button> */}
                    </Box>
                  </Box>
                ) : null}

                {/* <Divider color="secondary" />
                <Link
                  href="https://docs.app.hectordao.com/using-the-website/unstaking_lp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="large" variant="contained" color="secondary" fullWidth>
                    <Typography align="left">Unstake Legacy LP Token</Typography>
                  </Button>
                </Link> */}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default HOMMenu;
