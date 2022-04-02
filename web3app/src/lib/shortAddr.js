// Shortens an etehreum address by taking the first 6 characters, and the final 4
// Ex: 0x5527724ba84dab25559084903cdd03237a5fe143 -> 0x552...e143

export const shortAddr = (address) => (
    `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`
)