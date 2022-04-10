// Imports
const { expect } = require("chai");


describe("MyNFT Contract", function () {
    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    const metadataURI = 'QmeJMB9XBEYKtkuHsGzaJ2Ei9dqA9nb2tt7S3quX8q6rE9';
    const tokenName = '000'

    let FireMen;
    let firemen;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        FireMen = await ethers.getContractFactory("FireMen");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        firemen = await FireMen.deploy();
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await firemen.owner()).to.equal(owner.address);

            // Getting the contract deployer's balance pre-NFT sales
            let balanceWei = await ethers.provider.getBalance(owner.address);
            let balanceEth = parseInt(ethers.utils.formatEther(balanceWei));
            console.log(`>>> Owner has currently ${balanceEth} ether`)
        });
    });

    describe("Minting & Transactions", function () {
        it("Should say the address has currently no NFTs", async function () {
            // Getting the address' NFT balance
            console.log('>>> Getting addr1\'s Firement NFT balance')
            let balance = await firemen.balanceOf(addr1.address);
            expect(balance).to.equal(0);
        });


        it("Should mint a new NFT & track ownership", async function () {
            // Minting a new NFT using addr1
            console.log('>>> Minting a new NFT')
            await firemen.connect(addr1)    // connect to address1's account
            const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${tokenName}.json`, tokenName, { value: ethers.utils.parseEther('0.05') });

            // Wait until the minting tx has been mined/confirmed
            await newlyMintedToken.wait();

            balance = await firemen.balanceOf(addr1.address);
            expect(balance).to.equal(1);
            console.log(`>>> ${addr1.address} owns ${balance} NFTs`)

            // Check that the NFT with that URI is now owned
            expect(await firemen.isContentOwned(`${metadataURI}/${tokenName}.json`)).to.equal(true);
        });


        it("Should allow owner to withdraw ether revenue", async function () {
            // owner initial ETH balance 
            let b = await ethers.provider.getBalance(owner.address)
            const initialOwnerBalance = ethers.utils.formatEther(b)
            console.log(`>>> Owner has currently ${initialOwnerBalance} ether`)

            // Minting 4 NFTs
            const tokenNames = ['000', '001', '011', '111']
            for (const name in tokenNames) {
                const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${name}.json`, name, { value: ethers.utils.parseEther('0.05') });
                await newlyMintedToken.wait();
            }

            balance = await firemen.balanceOf(addr1.address);
            expect(balance).to.equal(4);

            // Check the contract's ETH balance
            let contractBalance = await firemen.getContractBalance();
            contractBalance = await ethers.utils.formatEther(contractBalance)
            expect(contractBalance).to.equal('0.2')

            // Cashing out the minting revenue
            await firemen.cashOut()

            // Getting the contract deployer's balance after selling 1 NFT
            b = await ethers.provider.getBalance(owner.address)
            const currentOwnerBalance = ethers.utils.formatEther(b)

            // checking that the owner made 0.2 ETH in revenue
            const profit = (currentOwnerBalance - initialOwnerBalance).toFixed(1)
            expect(profit).to.equal('0.2')
            console.log(`>>> ETH Balance of contract deployer: ${currentOwnerBalance}`)
        });


        it("Should transfer token to another address", async function () {
            const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${tokenName}.json`, tokenName, { value: ethers.utils.parseEther('0.05') });
            await newlyMintedToken.wait();

            // Addr1's balance should be 1 NFT
            let balance1 = await firemen.balanceOf(addr1.address);
            let balance2 = await firemen.balanceOf(addr2.address);
            expect(balance1).to.equal(1);
            expect(balance2).to.equal(0);

            // Transfering NFT from addr1 to addr2
            const transfered = await firemen.connect(addr1).transferToken(addr2.address, 0);
            await transfered.wait();

            // Addr1's balance should be now 0 NFT, and addr2 should be 1 NFT
            balance1 = await firemen.balanceOf(addr1.address);
            balance2 = await firemen.balanceOf(addr2.address);
            expect(balance1).to.equal(0);
            expect(balance2).to.equal(1);

            // Get the address of the NFT owner
            let tokenOwner = await firemen.getOwnerByName(tokenName);
            expect(tokenOwner).to.equal(addr2.address)
            console.log(`>>> ${tokenOwner} owns NFT "${tokenName}"`)
        });


        it("Should show every token owned by an address", async function () {
            // Minting 4 NFTs
            const tokenNames = ['001', '002', '003', '111']
            for (const name of tokenNames) {
                const newlyMintedToken = await firemen.connect(addr1).payToMint(`${metadataURI}/${name}.json`, name, { value: ethers.utils.parseEther('0.05') });
                await newlyMintedToken.wait();
            }

            balance = await firemen.balanceOf(addr1.address);
            expect(balance).to.equal(4);

            // fetching the user's tokens
            const MyTokens = await firemen.connect(addr1).getMyTokens();
            expect(MyTokens.length).to.equal(tokenNames.length)
            console.log(MyTokens);

            // Transfering NFT from addr1 to addr2
            const transfered = await firemen.connect(addr1).transferToken(addr2.address, 0);
            await transfered.wait();
            let addr2balance = await firemen.balanceOf(addr2.address);
            expect(addr2balance).to.equal(1);

            // fetching the addr's tokens again, should have 1 fewer NFT
            const MyTokens2 = await firemen.connect(addr1).getMyTokens();
            expect(MyTokens2.length).to.equal(tokenNames.length - 1)
            console.log(MyTokens2);
        });

    });
});
