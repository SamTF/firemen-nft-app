<!-- List of all NFTs owned by the currently connected address -->

<!-- JS -->
<script>
    // Constants & Stores
    import { FireMenABI, contractAddress, ipfsGateway } from '../lib/constants'
    import { contract, provider, signer } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'

    // Components
    import MyNFT from './MyNFT.svelte'


    // Fetching a list of the user's tokens
    const getMyTokens = async () => {
        const myTokenURIs = await contract.getMyTokens()
        
        console.log(myTokenURIs)
        
        if (myTokenURIs.length == 0)    return []

        let myTokens = []
        for (const token of myTokenURIs) {
            const metaURL = token.replace('ipfs://', ipfsGateway)
            const res = await fetch(metaURL)
            const data = await res.json()

            console.log(data.image_cid)

            myTokens.push(data)
        }

        return myTokens
    }
</script>


<!-- HTML -->
<!-- Fetching the NFTs owned by the connected address -->
{#await getMyTokens()}
    <code>fetching your NFTs...</code>

<!-- Rendered after fetching the owned NFT list -->
{:then Tokens}

    <!-- Checking that the current address actually owns anything -->
    {#if Tokens.length > 0}
        <div class="my-nft-list">
            {#each Tokens as token}
                <MyNFT {token} />
            {/each}
        </div>

    <!-- Sad message if the address has 0 NFTs ;( -->
    {:else}
        <p>You have no firemen NFTs yet ;(</p>
    {/if}
    
{/await}