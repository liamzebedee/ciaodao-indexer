

const Web3 = require('web3')

const ETH_RPC_URL = process.env.ETH_RPC_URL

export const web3 = new Web3(ETH_RPC_URL)

 
export class ContractWrappers {
    web3 = null
    networkId = null

    constructor(
        web3, 
        networkId
    ) {
        this.web3 = web3
        this.networkId = networkId
    }

    contract(name) {
        let json = require(`./artifacts/${name}.json`)
        // find deployment
        const addr = json.networks[this.networkId].address
        let contract = web3.eth.Contract(json, addr)
        return contract
    }
}

let contractWrappers: ContractWrappers = null

export async function initialize() {
    let networkId = await web3.eth.net.getId()
    contractWrappers = new ContractWrappers(web3, networkId)
}



export {
    contractWrappers
}