<!-- JS -->
<script>
    // Packages
    import { ethers } from 'ethers'
    import { onMount } from "svelte";

    // Constants & Stores
    import { FireMenABI, contractAddress, ipfsGateway } from '../lib/constants'
    import { contract, provider, signer } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'
    
    // My Components
    import Install from '../components/Install.svelte'
    import WalletConnect from '../components/WalletConnect.svelte'


    const signMessage = async (msg) => {
        const currentDate = new Date()

        let message = `
            nft.firemen.com wants you to sign in with your Ethereum account:
            ${$connectedAccount}\n
            Connect to GameStop NFT? By connecting you agree to our Terms & Conditions and Privacy Policy.
            \n
            URI: https://nft.firemen.com
            Version: 1
            Chain ID: 1
            Nonce: izPtdS5gC090qJzZF
            Issued At: ${currentDate}
            Expiration Time: 2022-04-11T07:03:19.820Z
        `
        let mySignature = await signer.signMessage(message)
        console.log(mySignature)
        return mySignature
    }

    const getMyTokens = async () => {
        const myTokenURIs = await contract.getMyTokens()
        
        console.log(myTokenURIs)
        
        if (myTokenURIs.length == 0)    return []

        let myTokens = []
        for (const token of myTokenURIs) {
            const metaURL = token.replace('ipfs://', ipfsGateway)
            const res = await fetch(metaURL)
            const data = await res.json()

            myTokens.push(data)
        }

        return myTokens
    }

    let promise = getMyTokens()
    
</script>


<!-- HTML -->
<main>
    <img src='/images/Fireman.webp' alt="Fireman pixel art" class="logo" />
    <h1>Your Fireman Profile</h1>

    <p>look at you!</p>

    <WalletConnect />

    <button on:click={() => signMessage("hello man")}>Sign message</button>

    <p></p>
    <p></p>
    <p></p>

    {#await promise}
        <p>fetching your NFTs...</p>
    {:then Tokens}
        <div class="token-list">
            {#each Tokens as token}
                <div class="nft-card">
                    <p>{token.name}</p>
                    <p>{token.attributes[0].gender}</p>
                    <p>{token.attributes[0].rarity}</p>
                    <img src={`${ipfsGateway}${token.image_cid}`} alt={token.name}>
                </div>
            {/each}
        </div>
    {/await}
</main>


<!-- CSS -->
<style>
    .logo {
        height: 16rem;
        width: 16rem;
    }

    .token-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 2rem;
    }
</style>