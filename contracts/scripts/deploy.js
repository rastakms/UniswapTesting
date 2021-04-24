// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {
  Fetcher,
  Route,
  TokenAmount,
  Trade,
  TradeType,
  Percent,
} = require("../../sdk/dist/index");
const ethers = hre.ethers;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [addr1] = await ethers.getSigners();

  const UniswapV2Factory = await hre.ethers.getContractFactory(
    "UniswapV2Factory"
  );
  const uniswapV2Factory = await UniswapV2Factory.deploy(addr1.address);

  await uniswapV2Factory.deployed();

  const WETH = await hre.ethers.getContractFactory("WETH9");
  const wETH = await WETH.deploy();

  await wETH.deployed();

  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const eeee = await ERC20.deter;
  const eRC20 = await ERC20.deploy(1000000000000);

  await eRC20.deployed();

  const UniswapV2Router02 = await hre.ethers.getContractFactory(
    "UniswapV2Router02"
  );
  const uniswapV2Router02 = await UniswapV2Router02.deploy(
    uniswapV2Factory.address,
    wETH.address
  );

  console.log("user address: ", addr1.address);
  console.log("uniswapV2Router02 deployed to:", uniswapV2Router02.address);
  console.log("uniswapV2Factory deployed to:", uniswapV2Factory.address);
  console.log("weth address: ", wETH.address);
  console.log("ERC20 address: ", eRC20.address);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  eRC20.approve(uniswapV2Router02.address, 10000);

  const provider = hre.ethers.provider;
  const token1 = await Fetcher.fetchTokenData(2, wETH.address, provider);
  const token2 = await Fetcher.fetchTokenData(2, eRC20.address, provider);

  await uniswapV2Router02.addLiquidityETH(
    token2.address,
    10000,
    10000,
    1000,
    addr1.address,
    deadline,
    {
      value: 1000,
    }
  );

  const pair = await Fetcher.fetchPairData(token1, token2, provider);

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
  const value = trade.inputAmount.raw;

  await uniswapV2Router02.swapETHForExactTokens(
    String(amountOutMin),
    path,
    to,
    deadline,
    {
      value: value,
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
