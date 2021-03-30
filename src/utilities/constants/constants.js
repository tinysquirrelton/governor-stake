import BigNumber from "bignumber.js/bignumber";

import { prodpool } from "./prodpool";
import { testpool } from "./testpool";

// Is Testnet or Mainnet?
export const testnet = process.env.REACT_APP_TEST === "ON";

// None for Rinkeby Testnet
export const USDCWETHAddress = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";

// GDAO Address
export const GDAOAddress = testnet
  ? "0xf35da56343622244f9e1fb0b87950fbfd7fa991b"
  : "0x515d7E9D75E2b76DB60F8a051Cd890eBa23286Bc";

// GDAO-WETH LP Address
export const GDAOWETHLPAddress = testnet
  ? "0xb354b410071a12b5ccB28Bd3275A44C6Dc9DBC61"
  : "0x4D184bf6F805Ee839517164D301f0C4e5d25c374";

// WETH Address
export const wETHAddress = testnet
  ? "0xc778417e063141139fce010982780140aa0cd5ab"
  : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// USDC Address
export const USDCAddress = testnet
  ? "0xb7dbd69de83e7ed358c7687c1c1970e5dd121818"
  : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// Burn Purgatory Address
export const LOYALAddress = testnet
? "0x250aa8028eade2c3005a29f55589dc0d7bc12cc9"
: "0xeda4f23957d2f819c22761c4d6d6157bd3fe0724";


// NFT Purchase Contracts

export const NFTStafferSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f";

export const NFTRepresentativeSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f";

export const NFTCouncilSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f";

export const NFTGovernorSwap = testnet
? "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f"
: "0x5313f09c7035ef572ba2794ec4cabe22036c2b7f";

// Chain ID - 1: Mainnet - 4: Rinkeby
export const chainId = testnet ? 4 : 1;

// Infura Provider
export const infuraProvider = testnet
  ? `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TEST_ID}`
  : `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROD_ID}`;

// Pools containing Tokens
export const pool = testnet ? testpool : prodpool;

// Stake Address
export const stakeAddress = testnet
  ? "0x20bEA2175D59F1c59BA0D76e934E296b26d8e003"
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
