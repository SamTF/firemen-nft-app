<!-- A list of all FireMen NFTs -->

<!-- JS -->
<script>
    import { onMount } from 'svelte'
    import { firemenIds } from '../lib/constants'
    import { contract } from '../lib/ethereum'
    import NFTCard from './NFTCard.svelte'


    let tokensMinted = 0

    // Calls the tokenCount function on the Contract to check how many NFTs have been minted
    const getCount = async () => {
        const count = await contract.tokenCount()
        tokensMinted = count
        console.log(`${count} FireMen NFTs have been minted.`)
    }

    // Calls getCount as soon as the component renders
    onMount(getCount)
</script>


<!-- HTML -->
<div class="container">
    <h1>FireMen NFT Collection</h1>

    <div class="token-list">
        {#each firemenIds as id}
            <NFTCard {id} {contract} />
        {/each}
    </div>
</div>


<!-- CSS -->
<style>
    .container {
        display: grid;
        place-items: center;

        margin-top: 5rem;
    }

    .token-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        row-gap: 2rem;
    }
</style>