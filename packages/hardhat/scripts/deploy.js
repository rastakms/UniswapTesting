/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const {
  Fetcher,
  Route,
  TokenAmount,
  Trade,
  TradeType,
  Percent,
} = require("../../sdk/dist/index");

const main = async () => {
  console.log("\n\n 📡 Deploying...\n");

  const [addr1, addr2, addr3] = await ethers.getSigners();

  const weth = await deploy("WETH9");

  const argsUniswapV2Factory = [addr1.address];

  const uniswapV2Factory = await deploy(
    "UniswapV2Factory",
    argsUniswapV2Factory
  );

  console.log(uniswapV2Factory.address);
  const factoryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const ERC20 = await ethers.getContractFactory("ERC20");
  const firstErc20 = await ERC20.deploy(1000000000000);
  await firstErc20.deployed();

  const SecondERC20 = await ethers.getContractFactory("SecondERC20");
  const secondErc20 = await SecondERC20.deploy(1000000000000);
  await secondErc20.deployed();

  const argsUniswapV2Router02 = [factoryAddress, weth.address];

  const uniswapV2Router02 = await deploy(
    "UniswapV2Router02",
    argsUniswapV2Router02
  );

  console.log("user address: ", addr1.address);
  console.log("uniswapV2Router02 deployed to:", uniswapV2Router02.address);
  console.log("uniswapV2Factory deployed to:", factoryAddress);
  console.log("weth address: ", secondErc20.address);
  console.log("ERC20 address: ", firstErc20.address);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  await firstErc20.transfer(addr2.address, 40000);
  await secondErc20.transfer(addr2.address, 40000);

  await firstErc20.connect(addr2).approve(uniswapV2Router02.address, 40000);
  await secondErc20.connect(addr2).approve(uniswapV2Router02.address, 40000);

  const provider = ethers.provider;
  const token1 = await Fetcher.fetchTokenData(2, secondErc20.address, provider);
  const token2 = await Fetcher.fetchTokenData(2, firstErc20.address, provider);
  console.log(
    "******** addLiquidity params: ",
    token1.address,
    token2.address,
    10000,
    20000,
    1000,
    2000,
    addr3.address,
    deadline
  );
  await uniswapV2Router02
    .connect(addr2)
    .addLiquidity(
      token1.address,
      token2.address,
      10000,
      20000,
      1000,
      2000,
      addr3.address,
      deadline
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
  const slippageTolerance = new Percent("50", "100");
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  console.log("amountOutMin: ", amountOutMin);
  const path = [token1.address, token2.address];
  const to = addr3.address;
  const value = trade.inputAmount.raw;
  console.log("!@#!@#!@#!#!@#!@#!222");
  console.log(
    "Before token1",
    (await firstErc20.balanceOf(addr2.address)).toString()
  );
  console.log(
    "Before token1",
    (await firstErc20.balanceOf(addr3.address)).toString()
  );
  console.log(
    "Before token2",
    (await secondErc20.balanceOf(addr2.address)).toString()
  );
  console.log(
    "Before token2",
    (await secondErc20.balanceOf(addr3.address)).toString()
  );

  console.log(
    "******** swapExactTokensForTokens params: ",
    String(value),
    String(amountOutMin),
    path,
    to,
    deadline
  );
  await uniswapV2Router02
    .connect(addr2)
    .swapExactTokensForTokens(
      String(value),
      String(amountOutMin),
      path,
      to,
      deadline
    );
  console.log(
    "After token1",
    (await firstErc20.balanceOf(addr2.address)).toString()
  );
  console.log(
    "After token1",
    (await firstErc20.balanceOf(addr3.address)).toString()
  );
  console.log(
    "After token2",
    (await secondErc20.balanceOf(addr2.address)).toString()
  );
  console.log(
    "After token2",
    (await secondErc20.balanceOf(addr3.address)).toString()
  );

  const argsFirstErc20 = [1000000000000];

  const myFirstErc20 = await deploy("ERC20", argsFirstErc20);

  const argsSecondErc20 = [1000000000000];

  const mySecondErc20 = await deploy("SecondERC20", argsSecondErc20);

  await myFirstErc20.transfer(
    "0x1757A617d70e164FDC3AcFAE1023ed8EE02ccFa0",
    400000
  );
  await mySecondErc20.transfer(
    "0x1757A617d70e164FDC3AcFAE1023ed8EE02ccFa0",
    400000
  );

  console.log("myFirstErc20 address: ", myFirstErc20.address);
  console.log("mySecondErc20 address: ", mySecondErc20.address);

  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
  /*
  await tenderlyVerify(
    {contractName: "YourContract",
     contractAddress: yourContract.address
  })
  */

  // If you want to verify your contract on etherscan

  // console.log(chalk.blue("verifying on etherscan"));
  // await run("verify:verify", {
  //   address: yourContract.address,
  //   constructorArguments: args, // If your contract has constructor arguments, you can pass them as an array
  // });
  // await run("verify:verify", {
  //   address: shambitToken.address,
  //   constructorArguments: argsShambitToken, // If your contract has constructor arguments, you can pass them as an array
  // });

  // console.log(
  //   " 💾  Artifacts (address, abi, and args) saved to: ",
  //   chalk.blue("packages/hardhat/artifacts/"),
  //   "\n\n"
  // );
};

const deploy = async (
  contractName,
  _args = [],
  overrides = {},
  libraries = {}
) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = "";
  if (deployed && deployed.deployTransaction) {
    const gasUsed = deployed.deployTransaction.gasLimit.mul(
      deployed.deployTransaction.gasPrice
    );
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${
      deployed.deployTransaction.hash
    }`;
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );
  console.log(" ⛽", chalk.grey(extraGasInfo));

  await tenderly.persistArtifacts({
    name: contractName,
    address: deployed.address,
  });

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};

// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 &&
  fileName.indexOf(".swp") < 0 &&
  fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({ contractName, contractAddress }) => {
  let tenderlyNetworks = [
    "kova",
    "goerli",
    "mainnet",
    "rinkeby",
    "ropsten",
    "matic",
    "mumbai",
    "xDai",
    "POA",
  ];
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork;

  if (tenderlyNetworks.includes(targetNetwork)) {
    console.log(
      chalk.blue(
        ` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`
      )
    );

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress,
    });

    let verification = await tenderly.verify({
      name: contractName,
      address: contractAddress,
      network: targetNetwork,
    });

    return verification;
  } else {
    console.log(
      chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`)
    );
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
