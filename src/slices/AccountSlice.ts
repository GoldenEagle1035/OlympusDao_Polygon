import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sBHD } from "../abi/sBHD.json";
import { abi as pBHD } from "../abi/pBHD.json";
import { abi as presaleAbi} from "../abi/Presale.json"
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

import { abi as stakingAbi } from '../abi/HOMdaoStaking.json'



export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    // console.log('debug->dashboard1')
    const HOMContract = new ethers.Contract(addresses[networkID].PHOM_ADDRESS as string, ierc20Abi, provider);
    const HOMBalance = await HOMContract.balanceOf(address);
    const sHOMContract = new ethers.Contract(addresses[networkID].SPHOM_ADDRESS as string, sBHD, provider);
    const sHOMBalance = await sHOMContract.balanceOf(address);
   // let poolBalance = 0;
    //const poolTokenContract = new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS as string, ierc20Abi, provider);
    //poolBalance = await poolTokenContract.balanceOf(address);
    // console.log('address',address)


    return {
      balances: {
        HOM: ethers.utils.formatUnits(HOMBalance, "gwei"),
        sHOM: ethers.utils.formatUnits(sHOMBalance, "gwei"),
        // pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let HOMBalance = 0;
    let sHOMBalance = 0;
    let pHOMBalance = 0;
    let mimBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let daiBondAllowance = 0;
  //  let poolAllowance = 0;
    let multiSignBalance = 0;

    
   // console.log('addresses',addresses)

    
    const USDC_ADDRESS = new ethers.Contract(addresses[networkID].USDC_ADDRESS as string, ierc20Abi, provider);
    const usdcBalance = await USDC_ADDRESS.balanceOf(address);
    
    const mimContract = new ethers.Contract(addresses[networkID].USDC_ADDRESS as string, ierc20Abi, provider);
    mimBalance = await mimContract.balanceOf(address);

    multiSignBalance = await USDC_ADDRESS.balanceOf(addresses[networkID].MULTISIGN_ADDRESS) / Math.pow(10, 18);
  //  console.log('debug multiSignBalance account', usdcBalance);
    const pHOMContract = new ethers.Contract(addresses[networkID].PHOM_ADDRESS as string, pBHD, provider);
    pHOMBalance = await pHOMContract.balanceOf(address);
 //  console.log('pHOMBalance1',pHOMBalance);


    const HOMContract = new ethers.Contract(addresses[networkID].PHOM_ADDRESS as string, ierc20Abi, provider);

    HOMBalance = await HOMContract.balanceOf(address);
    stakeAllowance = await HOMContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

    const sHOMContract = new ethers.Contract(addresses[networkID].SPHOM_ADDRESS as string, sBHD, provider);

    sHOMBalance = await sHOMContract.balanceOf(address);
    unstakeAllowance = await sHOMContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
 
   // poolAllowance = await sHOMContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
   
    if (addresses[networkID].USDC_ADDRESS) {
      presaleAllowance = await USDC_ADDRESS.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].PHOM_ADDRESS) {
      claimAllowance = await pHOMContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

  //  console.log('debug->dashboard2')

    const StakingContract =  new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stakingAbi, provider);
    const warmupInfo = await StakingContract.warmupInfo(address);
    const epoch =  await StakingContract.epoch();
    const expiry =warmupInfo.expiry;
    const epochnumber =  epoch.number;
    const depositamount = warmupInfo.deposit;

    
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presaleAbi, provider);
    const HOMPrice = await presaleContract.getPriceForThisAddress(address);
    const remainingAmount = await presaleContract.getUserRemainingAllocation(address);
    const whitelistAddress =  await presaleContract.firstPhasewhitelisted(address);
    const isStarted = await presaleContract.started();
    const isEnded = await presaleContract.ended();
    const minCap = await presaleContract.minCap();
    const cap = await presaleContract.cap();
    let presaleStatus = "Presale has not yet started.";
    if(isStarted){
      presaleStatus = "Presales is Active!";
    } 
    if(isEnded)
      presaleStatus = "Presales was ended";

    

    return {
      balances: {
       // dai: ethers.utils.formatEther(usdcBalance),
        busd: ethers.utils.formatUnits(usdcBalance, 6),
        HOM: ethers.utils.formatUnits(HOMBalance, "gwei"),
        sHOM: ethers.utils.formatUnits(sHOMBalance, "gwei"),
        pHOM: ethers.utils.formatUnits(pHOMBalance, "gwei"),
        
      },

      presale: {
        presaleAllowance: +presaleAllowance,
        tokenPrice: ethers.utils.formatUnits(HOMPrice,6),
        remainingAmount: ethers.utils.formatUnits(remainingAmount,6),
        presaleStatus: presaleStatus,
        minCap: ethers.utils.formatUnits(minCap,6),
        cap: ethers.utils.formatUnits(cap,6),
        multiSignBalance: multiSignBalance,
        whitelistAddress: whitelistAddress ,
      },
      claim: {
        claimAllowance: +claimAllowance,
      },
      staking: {
        HOMStake: +stakeAllowance,
        HOMUnstake: +unstakeAllowance,
        expiry :  ethers.utils.formatUnits(expiry, 0),
        epochnumber : ethers.utils.formatUnits(epochnumber,0),
        depositamount : ethers.utils.formatUnits(depositamount, 0),
        
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        // sHOMPool: +poolAllowance,
      },
    };
  },
);



export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationTime: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationTime: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    const USDC_ADDRESS = new ethers.Contract(addresses[networkID].USDC_ADDRESS as string, ierc20Abi, provider);
   
    let multiSignBalance = await USDC_ADDRESS.balanceOf(addresses[networkID].MULTISIGN_ADDRESS);
   
  //  console.log('debug->dashboard3')
  //  console.log('multiSignBalance',multiSignBalance)
    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    // let balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    let deciamls = 18;
    if (bond.name == "usdc") {
      deciamls = 6;

    }
    const balanceVal = balance / Math.pow(10, deciamls);
    // console.log('bond1',bond)
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal.toString(),
      interestDue,
      bondMaturationTime,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    bhd: string;
    sbhd: string;
    pbhd: string;
    dai: string;
    busd: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { bhd: "", sbhd: "", pbhd: "", dai: "", busd: "" },

};

//console.log('initialState',initialState)

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
    
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
