import FireMen from './FireMen.json'
import NFTMarket from './NFTMarket.json'

// Smart Contracts
export const FireMenABI = FireMen.abi
// LOCALHOST: export const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const contractAddress = '0x7e88F3dA8D9314b64A93F2d126ad1cBa4026bf97'

export const MarketABI = NFTMarket.abi
// LOCALHOST: export const marketAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const marketAddress = '0xD3857f316e353fEebb85D88f1D62fA7adbbe3e82'

// FIremen NFT IDs
export const firemenIds = ['000', '001', '002', '003', '004', '005', '010', '011', '012', '013', '014', '015', '020', '021', '022', '023', '024', '025', '030', '031', '032', '033', '034', '035', '040', '041', '042', '043', '044', '045', '050', '051', '052', '053', '054', '055', '100', '101', '102', '103', '104', '105', '110', '111', '112', '113', '114', '115', '120', '121', '122', '123', '124', '125', '130', '131', '132', '133', '134', '135', '140', '141', '142', '143', '144', '145', '150', '151', '152', '153', '154', '155', '200', '201', '202', '203', '204', '205', '210', '211', '212', '213', '214', '215', '220', '221', '222', '223', '224', '225', '230', '231', '232', '233', '234', '235', '240', '241', '242', '243', '244', '245', '250', '251', '252', '253', '254', '255', '300', '301', '302', '303', '304', '305', '310', '311', '312', '313', '314', '315', '320', '321', '322', '323', '324', '325', '330', '331', '332', '333', '334', '335', '340', '341', '342', '343', '344', '345', '350', '351', '352', '353', '354', '355', '400', '401', '402', '403', '404', '405', '410', '411', '412', '413', '414', '415', '420', '421', '422', '423', '424', '425', '430', '431', '432', '433', '434', '435', '440', '441', '442', '443', '444', '445', '450', '451', '452', '453', '454', '455', '500', '501', '502', '503', '504', '505', '510', '511', '512', '513', '514', '515', '520', '521', '522', '523', '524', '525', '530', '531', '532', '533', '534', '535', '540', '541', '542', '543', '544', '545', '550', '551', '552', '553', '554', '555']

// IPFS
export const ipfsCID = 'QmeJMB9XBEYKtkuHsGzaJ2Ei9dqA9nb2tt7S3quX8q6rE9'
export const metadataCID = 'Qmbw3ksVq8tWvx9i6RCoPcbpsgLZp4BT12XXQpJD1bwxRh'
export const ipfsGateway = 'https://gateway.ipfs.io/ipfs/'

// Network Stuff
export const rpcUrl = `https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API}`
export const chainId = 80001
export const blockExplorer = 'https://mumbai.polygonscan.com/'

export const networkParams = {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
        name: 'Polygon Coin',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com/'],
    blockExplorerUrls: [blockExplorer]
}

console.log('Smart contract address -> ' + contractAddress)