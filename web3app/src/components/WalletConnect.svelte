<!-- JS -->
<script>
    // IMPORTS
    import { ethers } from 'ethers'
    import { shortAddr, shortBalance } from '../lib/utils.js'
    import { connectedAccount } from '../stores/store'
    
    const { ethereum } = window // getting the Ethereum object from window.ethereum from metamask

    let balance = '0'
    // let connectedAccount = null

    const getBalance = async () => {
        // getting the currently connected account
        const [account] = await ethereum.request({ method: 'eth_requestAccounts'})
        console.log(account)

        // the Provider gives access to function that interact with the ethereum blockchain
        const provider = new ethers.providers.Web3Provider(ethereum)

        // gets the eth balance of an address in gwei
        const balanceGwei = await provider.getBalance(account)
        balance = ethers.utils.formatEther(balanceGwei)
    }

    // Actually connect a user's metamask wallet
    const connectWallet = async () => {
        // Check if Metamask is installed
        if(!ethereum) return alert('Go ahead and install MetaMask or some other browser wallet there buddy')

        // Get all available accounts and let user choose one to connect
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        $connectedAccount = accounts[0]
    }

    // If there's an Ethereum Object, connect to user's wallet and get their ether balance
    if (ethereum) {
        connectWallet()
        getBalance()

        // Listening for account changes
        ethereum.on('accountsChanged', function (accounts) {
            console.log(`Account changed!\nNew account: ${accounts}`)
            $connectedAccount = accounts[0]
            getBalance()
        })
    }
</script>


<!-- HTML -->
<div class="container">
    {#if $connectedAccount}
        <div class="wallet-connected">
            <div class="balance">{shortBalance(balance)} ETH</div>
            <div class="address card">{shortAddr($connectedAccount)}</div>
        </div>
    {:else}
        <button 
            class="connect-wallet"
            on:click={connectWallet}
        >
            Connect to a wallet
        </button>
    {/if}
</div>