var router = require('express').Router();
import { getConnection } from "typeorm";
import { Message } from "../../entity/Message";
import { Space } from '../../entity/Space';
const didJWT = require('did-jwt')

import { web3, ContractWrappers, contractWrappers } from '../../ethereum'
import { authMiddleware } from '../../middleware';
import { User } from '../../entity/User';

router.get('/most-active', (req, res) => {
    res.json([]).send()
})


// ID routes

router.param('id', async (req, res, next, id) => {
    const tokenAddress = id
    if(!web3.utils.isAddress(tokenAddress)) {
        throw new Error("invalid address")
    }

    
    let space = await getConnection()
    .getRepository(Space)
    .findOne({
        tokenAddress
    })

    if(!space) {
        // upsert
        space = await getConnection()
        .getRepository(Space)
        .create({
            name: tokenAddress,
            tokenAddress
        })
    }

    req.space = space

    next()
})


router.get('/:id/messages', async (req, res, next) => {
    const messages = await getConnection()
    .getRepository(Message)
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.space", req.params.id)
    .getMany()

    res.json(messages)
})

router.post('/:id/messages', async (req, res) => {
    authMiddleware(req, res, null)

    const did = req.message.user.did
    console.log(did)
    
    // Lookup user
    const user = await getConnection()
    .getRepository(User)
    .findOneOrFail({
        did,
    }, {
        relations: ["addresses"]
    })

    // Check membership of space
    const addresses = user.addresses.map(x => x.address)
    console.log(user, addresses)

    const Space = contractWrappers.contract('Space')
    console.log(
        await Space.methods.isMember(addresses[0]).call()
    )
    
    // You can only post messages to a space you're a part of
    const message = req.message.body
    
    
    // check ethereum address belongs to space

    // const space = await getConnection()
    // .getRepository(Space)
    // .create({
    //     name: "dog",
    // })
    
    const messages = await getConnection()
    .getRepository(Message)
    .create({
        content: message.text,
        space: req.space,
        time: parseInt(''+new Date),
        creator: null
    })

    // res.json(messages).send()
})



module.exports = router