
<!-- JS -->
<script>
    // IMPORTS
    import { ethers } from 'ethers'
    import { contract, marketContract } from '../../lib/ethereum'
    import MarketItem from './MarketItem.svelte'


    // Fetching all MarketItems
    const fetchMarketItems = async () => {
        // fetching all items currently for sale 
        const items = await marketContract.fetchMarketItems()

        // making the data human-readable
        const formattedItems = await Promise.all(items.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);

            let item = {
                price: ethers.utils.formatEther(i.price),
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner: i.owner,
                nftContract: i.nftContract,
                tokenURI
            }
            return item
        }))
        
        console.log(formattedItems)
        return formattedItems
    }
</script>


<!-- HTML -->
<div class="container">

    <!-- Fetching all Market Items -->
    {#await fetchMarketItems()}
        <code>fetching NFTs up for sale...</code>

    <!-- Rendered after fetching the market list -->
    {:then Tokens} 
        <!-- Checking that the current address actually owns anything -->
        {#if Tokens.length > 0}
            <div class="my-nft-list">
                {#each Tokens as token}
                    <MarketItem marketItem={token} />
                {/each}
            </div>

        <!-- Sad message if the address has 0 NFTs ;( -->
        {:else}
            <p>There are no NFTs for sale yet ;(</p>
        {/if}
    {/await}

</div>


<!-- CSS -->
<style>
    .container {
        display: grid;
        place-items: center;

        margin-top: 1rem;
    }
</style>