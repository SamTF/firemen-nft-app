// Utilities for dealing with big blockchain values

// Shortens an etehreum address by taking the first 6 characters, and the final 4
// Ex: 0x5527724ba84dab25559084903cdd03237a5fe143 -> 0x552...e143
export const shortAddr = (address) => (
    `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`
)

// Shorten the wallet balance to 4 decimal, or 4 significant figures
export const shortBalance = (balance) => {
    const num = Number(balance)

    if (num >= 1000)    return num.toFixed(0)
    else                return num.toFixed(4)
}