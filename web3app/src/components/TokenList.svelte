<!-- A list of all FireMen NFTs -->

<!-- JS -->
<script>
    import { onMount } from 'svelte'
    import { firemenIds } from '../lib/constants'
    import NFTCard from './NFTCard.svelte'
    import Counter from './Counter.svelte'

    // Props
    export let contract

    let tokensMinted = 0
    let tokensTotal = firemenIds.length
    $: tokensRemaining = tokensTotal - tokensMinted
    

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
<div class="token-list-container">
    <h1>FireMen NFT Collection</h1>

    <div class="counter-container">
        <Counter value={tokensMinted} description="minted" colour="0, 193, 255" />
        <Counter value={tokensRemaining} description="available" colour="143, 197, 62" />
    </div>

    <div class="token-list">
        {#each firemenIds as id}
            <NFTCard {id} {contract} on:minted={getCount} />
        {/each}
    </div>
</div>