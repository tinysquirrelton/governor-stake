import BigNumber from "bignumber.js/bignumber";

import { prodpool } from "./prodpool";
import { testpool } from "./testpool";

// Is Testnet or Mainnet?
export const testnet = process.env.REACT_APP_TEST === "ON";

// None for Rinkeby Testnet
export const USDCWETHAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";

// GDAO Address
export const GDAOAddress = testnet
  ? "0x666b74baB448034643FAB9a600BFb422FD0b4482"
  : "0x515d7E9D75E2b76DB60F8a051Cd890eBa23286Bc";

// GDAO-WETH LP Address
export const GDAOWETHLPAddress = testnet
  ? "0xe89e55af6a4ee4b86af397bc1977732eceed591a"
  : "0x4D184bf6F805Ee839517164D301f0C4e5d25c374";

// WETH Address
export const wETHAddress = testnet
  ? "0xc778417e063141139fce010982780140aa0cd5ab"
  : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// USDC Address
export const USDCAddress = testnet
  ? "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
  : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// Burn Purgatory Address
export const LOYALAddress = testnet
? "0x84494BcD15BFcB1bb0c1587079935F09e34d61C7"
: "0xEdA4F23957d2F819c22761C4d6D6157bd3fE0724";


// NFT Purchase Contracts

export const NFTStafferSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0xac0fb1bfb59122c1d906196ebdb80d5f2e0724dd";

export const NFTRepresentativeSwap = testnet
? "0x6785c38781aa4bd97e42fd717aa27b37538cdaa7"
: "0xb8ba178b2180bb09e27977f443ff01280dacb235";

export const NFTCouncilSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x204934a20810f871c265087089905ecced732ed8";

export const NFTGovernorSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x42fd58d8984673ba158d3ba16f19e147d916b265";


export const GDAOSwap = testnet
? "0x0a20dd9A995fA3d0a7E7BA00e9cA6FAde1124Af3"
: "0x6cfccbdf47041a7aecfe6e198f242d0d463d5723";

// Chain ID - 1: Mainnet - 3: Ropsten
export const chainId = testnet ? 3 : 1;

// Infura Provider
export const infuraProvider = testnet
  ? `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_TEST_ID}`
  : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROD_ID}`;

// Pools containing Tokens
export const pool = testnet ? testpool : prodpool;

// Stake Address
export const stakeAddress = testnet
  ? "0xc9fFdC4Bf1d73F596d7B24592E188B6e8fBbF6f8"
  : "0xda58927f4065F1D02a6ea850C2Aac49D7362A643";

//------------------------------

export const SUBTRACT_GAS_LIMIT = 100000;

const ONE_MINUTE_IN_SECONDS = new BigNumber(60);
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60);
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24);
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365);

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber("4294967295"), // 2**32-1
  ONES_127: new BigNumber("340282366920938463463374607431768211455"), // 2**128-1
  ONES_255: new BigNumber(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber("1e18"),
};
