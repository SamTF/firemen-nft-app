<!-- The Marketplace where users can buy and sell Firemen NFTs directly from other users -->

<!-- JS -->
<script>
    import { ethers } from 'ethers'
    import { contract, marketContract, provider, signer } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'
    import MyNFTList from '../components/MyNFTList.svelte'
    import MarketItemList from '../components/Market/MarketItemList.svelte'


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
<div class="token-list-container">
    <img src='/images/Fireman.webp' alt="Fireman" class="logo" />
    <h1>this is the market</h1>

    <p></p>
    <h3>buy high sell low, shut up let's go!</h3>

    <MarketItemList />

</div>

<!-- CSS -->
<style>

</style>