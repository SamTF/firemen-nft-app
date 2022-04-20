<!-- The Marketplace where users can buy and sell Firemen NFTs directly from other users -->

<!-- JS -->
<script>
    import { ethers } from 'ethers'
    import { contract, marketContract, provider, signer } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'
    import MyNFTList from '../components/MyNFTList.svelte'


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
<main>
    <img src='/images/Fireman.webp' alt="Fireman" class="logo" />
    <h1>this is the market</h1>

    <p></p>
    <h3>buy high sell low, shut up let's go!</h3>

    <p></p><p></p><p></p>

    <div class="market">
        <!-- Fetching all Market Items -->
        {#await fetchMarketItems()}
            <code>fetching NFTs up for sale...</code>

        <!-- Rendered after fetching the market list -->
        {:then Tokens} 
            <!-- Checking that the current address actually owns anything -->
            {#if Tokens.length > 0}
            <div class="my-nft-list">
                {#each Tokens as token}
                    <div>
                        <p>TokenId: {token.tokenId}</p>
                        <p>Price: {token.price} ETH</p>
                        <p>Seller: {token.seller}</p>
                        <p>{token.tokenURI}</p>
                    </div>
                {/each}
            </div>

        <!-- Sad message if the address has 0 NFTs ;( -->
        {:else}
            <p>There are no NFTs for sale yet ;(</p>
        {/if}
        {/await}
    </div>

    
</main>