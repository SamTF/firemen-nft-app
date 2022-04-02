const hre = require("hardhat");

const main = async () => {

  // We get the contract to deploy
  const FireMen = await hre.ethers.getContractFactory("FireMen");
  const firemen = await FireMen.deploy();

  await firemen.deployed();

  console.log("FireMen NFT Contract deployed to:", firemen.address);
}

const deploy = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

deploy();