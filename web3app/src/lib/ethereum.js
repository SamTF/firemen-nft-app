// Storing the web3 provider, signer, and contract objects all in one global script

import { browser } from '$app/env'
import { ethers } from 'ethers'
import { FireMenABI, contractAddress, MarketABI, marketAddress } from './constants'

// Ethereum constants
let provider = null
let signer = null
let contract = null
let marketContract = null


// This has to be run in the browser and not server-side
if (browser) {

    // Checking that there is indeed an ethereum object
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner() // getting the user's signature to confirm transactions on the blockchain
    
        // instantiate the contracts
        contract = new ethers.Contract(contractAddress, FireMenABI, signer)
        marketContract = new ethers.Contract(marketAddress, MarketABI, signer)
    
    // Using a default RPC provider, to allow for read-only functions on the smart contract 
    } else {
        provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
        contract = new ethers.Contract(contractAddress, FireMenABI, provider)
        marketContract = new ethers.Contract(marketAddress, MarketABI, provider)
    }
}


// Exports
export { provider, signer, contract,marketContract }