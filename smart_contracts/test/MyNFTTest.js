const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    it("Should mint and transfer an NFT to a paying user", async function () {
        const FireMen = await ethers.getContractFactory("FireMen");
        const firemen = await FireMen.deploy();
        await firemen.deployed();

        // Testing contants
        const recipient = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
        const metadataURI = 'QmeJMB9XBEYKtkuHsGzaJ2Ei9dqA9nb2tt7S3quX8q6rE9/000.png';
        const tokenName = '000'
        const provider = ethers.provider;
        const deployer = '0x5527724ba84dab25559084903cDd03237A5fE143'

        // Getting the contract deployer's balance pre-NFT sales
        let balanceWei = await provider.getBalance(deployer);
        let balanceEth = parseInt(ethers.utils.formatEther(balanceWei));
        expect(balanceEth).to.equal(0)

        // Getting the address' NFT balance
        let balance = await firemen.balanceOf(recipient);
        expect(balance).to.equal(0);

        // Minting a new NFT
        const newlyMintedToken = await firemen.payToMint(recipient, metadataURI, tokenName, { value: ethers.utils.parseEther('0.05') });

        // Wait until the minting tx has been mined/confirmed
        await newlyMintedToken.wait();

        // Check that the address now owns exactly 1 NFT
        balance = await firemen.balanceOf(recipient);
        expect(balance).to.equal(1);

        // Check that the NFT with that URI is now owned
        expect(await firemen.isContentOwned(metadataURI)).to.equal(true);

        // Check the contract's ETH balance
        let contractBalance = await firemen.getContractBalance();
        contractBalance = await ethers.utils.formatEther(contractBalance)
        expect(contractBalance).to.equal('0.05')

        // Getting a tokenId by its given name
        let tokenId = await firemen.getTokenIdByName(tokenName);
        tokenId = ethers.utils.formatUnits(tokenId, 0);
        expect(tokenId).to.equal('0');
        
        // Get the address of the NFT owner
        let owner = await firemen.getOwnerByName(tokenName);
        expect(owner).to.equal(recipient)

        // Cashing out the minting revenue
        await firemen.cashOut()

        // Getting the contract deployer's balance after selling 1 NFT
        balanceWei = await provider.getBalance(deployer)
        balanceEth = ethers.utils.formatEther(balanceWei)
        expect(balanceEth).to.equal('0.05')

        console.log(`>>> ETH Balance of contract deployer: ${balanceEth}`)

        console.log("\nTesting over :)");
    });
});
