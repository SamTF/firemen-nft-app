// Storing the web3 provider, signer, and contract objects all in one global script

import { ethers } from 'ethers'
import { FireMenABI, contractAddress } from './constants'

// Ethereum constants
export const provider = new ethers.providers.Web3Provider(window.ethereum)
export const signer = provider.getSigner() // getting the user's signature to confirm transactions on the blockchain

// instantiate the contract
export const contract = new ethers.Contract(contractAddress, FireMenABI, signer)