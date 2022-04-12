<!-- Button that calls the payToMint function on the Smart Contract -->

<!-- JS -->
<script>
    import { createEventDispatcher } from 'svelte'
    import { ethers } from 'ethers'
    import { provider, signer, contract } from '../lib/ethereum'
    import { connectedAccount } from '../stores/store'

    // Props
    export let metadataURI
    export let id

    const dispatch = createEventDispatcher();

    // Minting an NFT and transfering it to the paying address
    const mintToken = async () => {
        // getting the currently connected address
        const addr = $connectedAccount

        // Call the payToMint func on the smart contract that receives ether in exchange of NFT ownership
        const result = await contract.payToMint(metadataURI, id, { value: ethers.utils.parseEther('0.05') })

        // Wait for the transaction to be mined
        await result.wait()

        console.log(result)
        console.log(`User @${addr} minted token ${metadataURI}`)

        // Dispatch event to parent NFT card to changed its status to Minted
        dispatch('minted', {isMinted: true, address: addr})
    }
</script>


<!-- HTML -->
<button
    class="mint-token"
    on:click={mintToken}
>
    <div class="mint-text">Mint now!</div>
    <div class="mint-cost">
        <img src="/images/eth-diamond-black.webp" alt="ether" title="ether" height="16px">
        0.05
    </div>
</button>