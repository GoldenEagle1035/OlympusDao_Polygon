import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getBhdTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake, claimspHOM } from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const sBhdImg = getTokenImage("sHOM");

function Stake() {
  const dispatch = useDispatch();

  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const view1 = 0;
  const [quantity, setQuantity] = useState("");
  const [oldquantity, setOldQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const oldfiveDayRate = useSelector(state => {
    return state.app.old_fiveDayRate;
  });
  const HOMBalance = useSelector(state => {
    return state.account.balances && state.account.balances.HOM;
  });

  const sHOMBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sHOM;
  });
  const oldsHOMBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsHOM;
  });
  const wsHOMBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsHOM;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.HOMStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.HOMUnstake;
  });
  // const oldunstakeAllowance = useSelector(state => {
  //   return state.account.staking && state.account.staking.oldhecUnstake;
  // });

  const expiry = useSelector(state => {
    return state.account.staking && state.account.staking.expiry;
  })

  const epochnumber = useSelector(state => {
    return state.account.staking && state.account.staking.epochnumber;
  })
  const depositamount = useSelector(state => {
    return state.account.staking && state.account.staking.depositamount;
  })
  // console.log('warmupInfo', expiry, epochnumber, depositamount);
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const oldstakingRebase = useSelector(state => {
    return state.app.old_stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const maxamount = ((((100 - (depositamount) / 1000000000 - sHOMBalance) * 100).toFixed(0)) / 100).toString();

  const setMax = () => {
    if (view === 0) {
      setQuantity(maxamount);
    } else {
      setQuantity(sHOMBalance);
    }
  };
  const setOldMax = () => {
    setOldQuantity(oldsHOMBalance);
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onClaim = async token => {
    await dispatch(claimspHOM({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action, isOld) => {
    // eslint-disable-next-line no-restricted-globals
    let value, unstakedVal;
    value = quantity;
    unstakedVal = sHOMBalance;
    if (isNaN(value) || value === 0 || value === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(value, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(HOMBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your HOM balance."));
    }

    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(maxamount, "gwei"))) {
      return dispatch(error("You cannot stake more than 100 pHOM"));
    }
    // if (action === "stake" && ) {
    //   return dispatch(error("You cannot stake more than 100 pHOM"));
    // }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(unstakedVal, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sHOM balance."));
    }
    await dispatch(
      changeStake({
        address,
        action,
        value: value.toString(),
        provider,
        networkID: chainID,
        callback: () => setQuantity(""),
      }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "HOM") return stakeAllowance > 0;
      if (token === "sHOM") return unstakeAllowance > 0;
      if (token === "oldsHOM") return oldunstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sHOMBalance, wsHOMBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const oldtrimmedBalance = Number(
    [oldsHOMBalance, wsHOMBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY =
    stakingAPY > 100000000 ? parseFloat(stakingAPY * 100).toExponential(1) : trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const oldstakingRebasePercentage = trim(oldstakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);
  const oldnextRewardValue = trim((oldstakingRebasePercentage / 100) * oldtrimmedBalance, 4);
  // const preApy = stakingAPY && stakingAPY.toString().split("e+")[0].substring(0, 3);
  // const afterApy = stakingAPY && stakingAPY.toString().split("e+")[1];
  // const tempApy = stakingAPY && preApy.concat("e+").concat(afterApy);
  return (
    <>
      <div id="stake-view" container = 'true'>
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <>
            <Grid item>
              <Grid container = 'true' spacing={1} alignItems="center" justifyContent="flex-start" style={{ 'margin': 'auto', marginTop: '40px', marginBottom: '20px', 'width': '50%' }}>
                <Grid container = 'true' spacing={1} alignItems="center" justifyContent="center" style={{ 'margin': 'auto' }}>
                  <Typography  style={{ 'margin': 'auto',fontFamily :'Square' }} variant="h5">We are in the testing phase for the HOM DAO Staking Platform. So you are limiitied to staking 100 pHOM. If you experience any problems while staking, please email a screenshot and description of your problem to <b>contribute@homdao.io.</b></Typography>
                </Grid>
              </Grid>
            </Grid>
            <Paper className={`ohm-card`}>
              <Grid container = 'true' direction="column" spacing={2}>
                <Grid item>
                  <div className="card-header">
                    <Typography variant="h5">Staking Dashboard</Typography>
                    <RebaseTimer />

                    {address && oldsHOMBalance > 0.01 && (
                      <Link
                        className="migrate-sohm-button"
                        style={{ textDecoration: "none" }}
                        href="FIXME"
                        aria-label="migrate-sohm"
                        target="_blank"
                      >
                        <NewReleases viewBox="0 0 24 24" />
                        <Typography>Migrate spHOM!</Typography>
                      </Link>
                    )}
                  </div>
                </Grid>

                <Grid item>
                  <div className="stake-top-metrics">
                    <Grid container = 'true' spacing={2} alignItems="flex-end">
                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <div className="stake-apy">
                          <Typography variant="h5" color="textSecondary">
                            APY
                          </Typography>
                          <Typography variant="h4">

                            {stakingAPY ? (new Intl.NumberFormat().format(Math.floor(trimmedStakingAPY)) + '%') : <Skeleton width="150px" />}
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <div className="stake-tvl">
                          <Typography variant="h5" color="textSecondary">
                            Total Value Deposited
                          </Typography>
                          <Typography variant="h4">
                            {stakingTVL ? (
                              new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                                minimumFractionDigits: 0,
                              }).format(stakingTVL)
                            ) : (
                              <Skeleton width="150px" />
                            )}
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={4} md={4} lg={4}>
                        <div className="stake-index">
                          <Typography variant="h5" color="textSecondary">
                            Current Index
                          </Typography>
                          <Typography variant="h4">
                            {currentIndex ? <>{trim(currentIndex, 1)} pHOM</> : <Skeleton width="150px" />}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

                <div className="staking-area">
                  {!address ? (
                    <div className="stake-wallet-notification">
                      <div className="wallet-menu" id="wallet-menu">
                        {modalButton}
                      </div>
                      <Typography variant="h6">Connect your wallet to stake pHOM</Typography>
                    </div>
                  ) : (
                    <>
                      <Box className="stake-action-area">
                        <Tabs
                          key={String(zoomed)}
                          centered
                          value={view}
                          textColor="primary"
                          indicatorColor="primary"
                          className="stake-tab-buttons"
                          onChange={changeView}
                          aria-label="stake tabs"
                        >
                          <Tab label="Stake" {...a11yProps(0)} />
                          <Tab label="Unstake" {...a11yProps(1)} />
                        </Tabs>

                        <Box container="true" className="stake-action-row " display="flex" alignItems="center">
                          {address && !isAllowanceDataLoading ? (
                            (!hasAllowance("HOM") && view === 0) || (!hasAllowance("sHOM") && view === 1) ? (
                              <Box className="help-text">
                                <Typography variant="body1" className="stake-note" color="textSecondary">
                                  {view === 0 ? (
                                    <>
                                      First time staking <b>pHOM</b>?
                                      <br />
                                      Please approve HOM DAO to use your <b>pHOM</b> for staking.
                                    </>
                                  ) : (
                                    <>
                                      First time unstaking <b>spHOM</b>?
                                      <br />
                                      Please approve HOM DAO to use your <b>spHOM</b> for unstaking.
                                    </>
                                  )}
                                </Typography>
                              </Box>
                            ) : (
                              <FormControl className="ohm-input" variant="outlined" color="primary" style={{ backgroundColor: 'white' }}>
                                <InputLabel htmlFor="amount-input" ></InputLabel>
                                <OutlinedInput
                                  style={{ 'margin': '1px', 'border': '2px solid', borderColor: 'black', 'color': 'black' }}
                                  id="amount-input"
                                  type="number"
                                  placeholder="Enter an amount"
                                  className="stake-input"
                                  value={quantity}
                                  onChange={e => setQuantity(e.target.value)}
                                  labelWidth={0}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Button variant="text" onClick={setMax} color="default" style={{ 'color': 'black' }}>
                                        Max
                                      </Button>
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            )
                          ) : (
                            <Skeleton width="150px" />
                          )}

                          <TabPanel value={view} index={0} className="stake-tab-panel">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("HOM") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "staking")}
                                onClick={() => {
                                  onChangeStake("stake", false);
                                }}
                              >
                                {txnButtonText(pendingTransactions, "staking", "Stake pHOM")}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                                onClick={() => {
                                  onSeekApproval("HOM");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                              </Button>
                            )}
                          </TabPanel>
                          <TabPanel value={view} index={1} className="stake-tab-panel">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("sHOM") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                onClick={() => {
                                  onChangeStake("unstake", false);
                                }}
                              >
                                {txnButtonText(pendingTransactions, "unstaking", "Unstake pHOM")}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={() => {
                                  onSeekApproval("sHOM");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                              </Button>
                            )}
                          </TabPanel>
                        </Box>
                      </Box>

                      <div className={`stake-user-data`}>
                        <div className="data-row">
                          <Typography variant="body1">Your Balance</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(HOMBalance, 4)} pHOM</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">Your Staked Balance</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} spHOM</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">Next Reward Amount</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} spHOM</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">Next Reward Yield</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">ROI (5-Day Rate)</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(fiveDayRate * 100, 4)}%</>}
                          </Typography>
                        </div>
                      </div>
                      {isAllowanceDataLoading ? (
                        <Skeleton />
                      ) : depositamount > 0 ? (
                        parseInt(expiry) <= parseInt(epochnumber) ? (
                          <Box container = 'true' className="stake-action-row " display="flex" alignItems="center" style={{ justifyContent: "space-between" }}>
                            <Typography variant="body1" className="stake-note" color="textSecondary">{(depositamount * 10) / 10000000000}{" tokens are claimable"}</Typography>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={false}
                              onClick={() => {
                                onClaim("spHOM");
                              }}
                              style={{ 'width': '30%' }}
                            >
                              {txnButtonText(pendingTransactions, "approve_unstaking", "Claim")}
                            </Button>
                          </Box>
                        ) : (
                          <Box container = 'true' className="stake-action-row " display="flex" alignItems="center" style={{ justifyContent: "space-between" }}>
                            <Typography variant="body1" className="stake-note" color="textSecondary">{"You can claim the "}{(depositamount * 10) / 10000000000}{" tokens once the protocol releases them.  This may claim in next rebase."}</Typography>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={true}
                              onClick={() => {
                                onClaim("spHOM");
                              }}
                              style={{ 'width': '30%' }}
                            >
                              {txnButtonText(pendingTransactions, "approve_unstaking", "Claim")}
                            </Button>
                          </Box>

                        )
                      ) : (
                        <Typography variant="body1" className="stake-note" color="textSecondary">{"There is no claimable tokens"}</Typography>
                      )
                      }
                    </>
                  )}
                </div>
              </Grid>
            </Paper>
            <Grid item>
              <Grid container='true' spacing={1} alignItems="center" justifyContent="flex-start" style={{ 'margin': 'auto', marginTop: '40px', marginBottom: '20px', 'width': '50%' }}>
                <Grid container='true' alignItems="center" justifyContent="center" style={{ 'margin': 'auto' }}>
                  <Typography style={{ 'margin': 'auto', fontFamily : 'emoji' }} variant="h5">When you successfully stake your pHOM tokens, you will see the staked balance amount on the Your Staked Balance data field. You will also see the same amount reflected in the Claim field as the number of staked tokens = the number of tokens you can claim. Pleae allow a few moments for the screen to refresh after staking, so that the transaction can clear the blockchain. If more than 2 minutes, please reload the page.</Typography>
                </Grid>
              </Grid>
            </Grid>

          </>
        </Zoom>
      </div>
    </>
  );
}

export default Stake;
