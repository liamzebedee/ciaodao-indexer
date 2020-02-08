// user signs up by staking 1 CIAO
import { 
    User
} from '../../entity/User'
import { getConnection } from 'typeorm';

const request = require('request-promise');

const didJWT = require('did-jwt')
var router = require('express').Router();

import Box from '3box'
import { web3 } from '../../ethereum';
import { EthAddress } from '../../entity/EthAddress';
import { authMiddleware } from '../../middleware';






router.get('/:id/notifications', (req, res) => {
    res.json([]).send()
})

router.get('/:id/spaces', (req,res) => {
    res.json([]).send()
})

router.get('/:id/', (req,res) => {
    res.json([]).send()
})



router.post('/authenticate', async (req, res) => {
    authMiddleware(req, res, null)

    const did = req.message.user.did
    
    const userRepo = await getConnection()
        .getRepository(User)
    
    let user = await userRepo
        .findOneOrFail(did, { relations: ["addresses"] })

    if(user) {
        // idk.
    } else {
        // Upsert.
        user = userRepo
            .create({
                did
            });
        
        await userRepo.save(user)
    }

    // Verify addresses.
    const { links } = req.message.body

    const linkedAddresses = user.addresses.map(x => x.address)

    for(const link of links) {
        const { message, signature } = link
        const ethAddress = await web3.eth.accounts.recover(message, signature)
        
        if(linkedAddresses.indexOf(ethAddress) != -1) continue

        const ethAddress_repo = await getConnection()
            .getRepository(EthAddress)

        let ethAddress_entity = ethAddress_repo
            .create({
                address: ethAddress,
                linkedTo: user
            })
        
        await ethAddress_repo.save(ethAddress_entity)
        
        console.log(`Linked new address ${ethAddress} to user ${user.did}`)
    }

    res.json({}).send()
})


module.exports = router