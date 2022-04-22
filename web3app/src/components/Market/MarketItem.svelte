<!-- Cards for the NFT MarketItems up for sale -->

<!-- JS -->
<script>
    // IMPORTS
    import { createEventDispatcher, onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition'
    import { FireMenABI, contractAddress, ipfsGateway } from '../../lib/constants'
    import { contract, marketContract } from '../../lib/ethereum'
    import { shortAddr } from '../../lib/utils'
    import {connectedAccount} from '../../stores/store'

    // Props
    export let marketItem = {}

    // Variables
    let token = {}
    let showDetails = false
    
    const toggleDetails = () => showDetails = !showDetails

    const dispatch = createEventDispatcher();

    // Getting the NFT metadata using its tokenURI
    const fetchToken = async () => {
        const tokenURI = marketItem.tokenURI
        const metaURL = tokenURI.replace('ipfs://', ipfsGateway)
        const res = await fetch(metaURL)
        const data = await res.json()
        token = data
    }

    // On Start
    onMount(fetchToken)

    // Buying this NFT
    const buyToken = async () => {
        const purchase = await marketContract.purchaseMarketItem(contractAddress, marketItem.tokenId, { value : marketItem.price })
        await purchase.wait()
    }
</script>


<!-- HTML -->
<div
    class="my-nft"
    in:fade
    on:click={toggleDetails}
    data-expanded={showDetails}
>
    <!-- test -->
    {#if showDetails}
        <div class="name" transition:slide>
            <p>NFT #{token.name}</p>
        </div>
    {/if}
    
    <!-- NFT Image -->
    <img src={`${ipfsGateway}${token.image_cid}`} alt={token.name}>

    <!-- NFT Details -->
    {#if showDetails}
        <div transition:slide>
            <!-- General details -->
            <p><b>⚤:</b> {token.attributes[0].gender}</p>
            <p><b>Rarity:</b> {Math.round(token.attributes[0].rarity)}</p>

            <a class="btn-owner-addr"
                href={`https://etherscan.io/address/${marketItem.seller}`} target="_blank"
                style="margin-bottom: 1rem;"
            >
                <b>Sold by</b> {shortAddr(marketItem.seller)}
            </a>

            <hr style="background: black; margin-bottom: 1rem">

            <!-- Actions -->
            <button
                class="mint-token"
                on:click={() => {}}
                disabled={$connectedAccount == null}
                style="margin-bottom: 1rem;"
            >
                <div class="mint-text">Buy now!</div>
                <div class="mint-cost">
                    <img src="/images/eth-diamond-black.webp" alt="ether" title="ether" height="16px">
                    {marketItem.price}
                </div>
            </button>
        </div>
    {/if}
</div>