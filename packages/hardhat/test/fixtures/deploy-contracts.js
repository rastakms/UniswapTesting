const ContractFactory = await ethers.getContractFactory("Shambit");
const MiniMeTokenFactoryContractFactory = await ethers.getContractFactory(
  "MiniMeTokenFactory"
);
const ShambitTokenContractFactory = await ethers.getContractFactory(
  "MiniMeToken"
);
const miniMeTokenFactory = MiniMeTokenFactoryContractFactory.deploy();
const SBTct = await ShambitTokenContractFactory.deploy(
  minimeTokenFactory.address,
  "0x0000000000000000000000000000000000000000",
  "0",
  "Shambit",
  18,
  "SBT",
  true
);
const ct = await ContractFactory.deploy(SBTct.address);
const accounts = await ethers.getSigners();
