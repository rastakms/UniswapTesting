// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Route,
  TokenAmount,
  Trade,
  TradeType,
  Percent,
  Pair,
} = require("../../uniswap-sdk/dist/index");

const erc20Compiled = require("../artifacts/contracts/test/test/ERC20.sol/ERC20.json");
const factoryCompiled = require("../artifacts/contracts/test/UniswapV2Factory.sol/UniswapV2Factory.json");
const routerCompiled = require("../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json");
const wethCompiled = require("../artifacts/contracts/test/WETH9.sol/WETH9.json");

const ethers = hre.ethers;

async function main() {
  // // Hardhat always runs the compile task when running scripts with its command
  // // line interface.
  // //
  // // If this script is run directly using `node` you may want to call compile
  // // manually to make sure everything is compiled
  // // await hre.run('compile');

  // // We get the contract to deploy

  const [addr1, addr2] = await ethers.getSigners();

  // const UniswapV2Factory = await hre.ethers.getContractFactory(
  //   "UniswapV2Factory"
  // );
  // const uniswapV2Factory = await UniswapV2Factory.deploy(addr1.address);

  // await uniswapV2Factory.deployed();

  // const WETH = await hre.ethers.getContractFactory("WETH9");
  // const wETH = await WETH.deploy();

  // await wETH.deployed();

  // const ERC20 = await hre.ethers.getContractFactory("ERC20");
  // const eRC20 = await ERC20.deploy(1000000000000);

  // await eRC20.deployed();

  // const UniswapV2Router02 = await hre.ethers.getContractFactory(
  //   "UniswapV2Router02"
  // );
  // const uniswapV2Router02 = await UniswapV2Router02.deploy(
  //   uniswapV2Factory.address,
  //   wETH.address
  // );

  // console.log("uniswapV2Router02 deployed to:", uniswapV2Router02.address);

  // const provider = hre.ethers.provider;

  const token1Address = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
  const token2Address = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
  const factoryAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
  const routerAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";

  const token1 = await Fetcher.fetchTokenData(2, token1Address, addr2);
  const token2 = await Fetcher.fetchTokenData(2, token2Address, addr2);
  let token1Contract = new ethers.Contract(
    token1Address,
    wethCompiled.abi,
    addr2
  );
  let token2Contract = new ethers.Contract(
    token2Address,
    erc20Compiled.abi,
    addr2
  );
  let factoryContract = new ethers.Contract(
    factoryAddress,
    factoryCompiled.abi,
    addr2
  );
  let routerContract = new ethers.Contract(
    routerAddress,
    routerCompiled.abi,
    addr2
  );

  //   1000000000000000000,
  //   100000000000000000000,
  //   1000000000000000000,
  //   100000000000000000000,

  //   console.log(token1, token2);

  // const pair = await getPair(token1, token2);

  const pair = await Fetcher.fetchPairData(token1, token2, addr2);
  // //   console.log(pair);
  const route = new Route([pair], token1);
  const trade = new Trade(
    route,
    new TokenAmount(token1, "30"),
    TradeType.EXACT_INPUT
  );

  console.log(route.midPrice.toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.inputAmount.raw);
  const slippageTolerance = new Percent("50", "10000");
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const path = [token1.address, token2.address];
  const to = addr1.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const value = trade.inputAmount.raw;

  // await routerContract.swapETHForExactTokens(
  //   String(amountOutMin),
  //   path,
  //   to,
  //   deadline,
  //   {
  //     value: value,
  //   }
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function getPair(tokenA, tokenB) {
  const pairAddress = Pair.getAddress(tokenA, tokenB);
  // const pairAddress = "0x15d0bd5b23507ea23e683de2f28256f6bfbe28b6";
  console.log("pairAddress", pairAddress);
  const reserves = [
    /* use pairAddress to fetch reserves here */
    10000,
    1000,
  ];
  const [reserve0, reserve1] = reserves;

  const tokens = [tokenA, tokenB];
  const [token0, token1] = tokens[0].sortsBefore(tokens[1])
    ? tokens
    : [tokens[1], tokens[0]];

  const pair = new Pair(
    new TokenAmount(token0, reserve0),
    new TokenAmount(token1, reserve1)
  );
  return pair;
}
