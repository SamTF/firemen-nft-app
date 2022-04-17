const hre = require("hardhat");

const main = async () => {

    // Deploy the NFT Marketplace
    Market = await ethers.getContractFactory("NFTMarket");
    market = await Market.deploy();
    await market.deployed();

    // Deploying the Firemen NFT contract
    FireMen = await ethers.getContractFactory("FireMen");
    firemen = await FireMen.deploy(market.address);
    await firemen.deployed();

  console.log("NFT Marketplace Contract deployed to:", market.address);
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