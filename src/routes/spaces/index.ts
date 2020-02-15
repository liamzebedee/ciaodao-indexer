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
        // check if we have a valid space.
        let factory = await contractWrappers.getDeployedContract('SpaceFactory')
        let evs = await factory.getPastEvents(
            'NewSpace',
            {
                fromBlock: '0', 
                filter: {
                    space: tokenAddress
                }
            }
        )
        console.log(evs)
        if(!evs.length) {
            throw new Error(`No registered space for that address. Check if space is registered with SpaceCadetFactory at ${tokenAddress}.`)
        }

        // upsert
        space = await getConnection()
        .getRepository(Space)
        .create({
            name: tokenAddress,
            tokenAddress
        })

        await getConnection()
            .getRepository(Space)
            .save(space)
    }

    req.space = space

    next()
})



/**
 * 
 * {
 *  name: string,
 *  tokenAddress: string,
 *  isMember: boolean,
 *  latestMessage: null
 * }
 */
router.get('/:id', async (req, res) => {
    authMiddleware(req, res, null)

    const did = req.message.user.did

    // Lookup user
    const user = await getConnection()
        .getRepository(User)
        .findOneOrFail({
            did,
        }, {
            relations: ["addresses", "joinedSpaces"]
        })
    
    const space = req.space as Space
    
    // get latest message time.
    const messages_repo = await getConnection()
        .getRepository(Message)
    const messages = await messages_repo.find(
        { 
            take: 1,
            order: {
                time: "DESC"
            },
            join: {
                alias: "message",
                leftJoinAndSelect: {
                    space: "message.space"
                }
            },
            where: {
                space: space
            }
        }
    )
    let latestMessage
    if(messages.length == 0) latestMessage = 0
    else latestMessage = messages[0].time
    console.log(user.joinedSpaces)
    const isMember = user.joinedSpaces.map(space => space.id).indexOf(req.space.id) != -1

    res.json({
        name: space.name,
        tokenAddress: space.tokenAddress,
        isMember: isMember,
        latestMessage
    }).send()
})

router.get('/:id/messages', async (req, res, next) => {
    const space = req.space as Space
    const messages_repo = await getConnection()
        .getRepository(Message)
    
    const messages = await messages_repo.find(
        { 
            order: {
                time: "DESC"
            },
            join: {
                alias: "message",
                leftJoinAndSelect: {
                    author: "message.author"
                }
            },
            where: {
                space: space
            }
        }
    )
    // .createQueryBuilder("message")
    // .where({
    //     space: {
    //         eq: req.space.id
    //     }
    // })
    // .getMany()

    res.json(messages)
})

router.post('/:id/join', async (req, res) => {
    authMiddleware(req, res, null)

    const did = req.message.user.did
    
    // Lookup user
    const user = await getConnection()
        .getRepository(User)
        .findOneOrFail({
            did,
        }, {
            relations: ["addresses", "joinedSpaces"]
        })

    if(user.joinedSpaces.indexOf(req.space.id) != -1) {
        throw new Error("User already member of space")
    }

    // Check membership of space
    const addresses = user.addresses.map(x => x.address)
    console.log(addresses)

    const Space = contractWrappers.getContractAtAddress('Space', req.space.tokenAddress)
    
    let canJoin = await Space.methods.isMember(addresses[0]).call()
    // console.log(canJoin, addresses[0])
    if(!canJoin) {
        throw new Error("Can't join space - Space.isMember failed.")
    }

    
    user.joinedSpaces = user.joinedSpaces.concat(req.space)
    await getConnection()
        .getRepository(User)
        .save(user)
    
    console.log(`User ${user.did} joined space ${req.space.tokenAddress}`)

    res.json({}).send()
})

router.post('/:id/messages', async (req, res) => {
    authMiddleware(req, res, null)

    const did = req.message.user.did
    console.log(did)
    
    // Lookup user
    const user = await getConnection()
        .getRepository(User)
        .findOne(did, {
            relations: ["joinedSpaces"]
        })

    if(user.joinedSpaces.map(x => x.id).indexOf(req.space.id) == -1) {
        throw new Error("Can't post message - user is not a member.")
    }

    // You can only post messages to a space you're a part of
    const message = req.message.body.message
    console.log(`message: ${JSON.stringify(message)}`)
    // {"message":{"space":"0x38b8639d03D2367BbA4B66e1880DC847729AE1B1","text":"123","time":"2020-02-15T09:45:45.410Z"}}

    if(message.space != req.space.tokenAddress) {
        throw new Error(`Message is signed for a different space: expected ${req.space.tokenAddress}, got ${message.space}`)
    }
    
    const messages = await getConnection()
    .getRepository(Message)

    const messageEntity = messages
    .create({
        content: message.content,
        space: req.space,
        time: (new Date).getTime(),
        author: user
    })
    
    await messages.save(messageEntity)

    res.json({}).send()
})



module.exports = router



// check if exists 
// and if so, insert

// let SpaceContract
// try {
//     SpaceContract = contractWrappers.getContractAtAddress('Space', tokenAddress)
// } catch(ex) {
//     // TODO
//     throw new Error("Space doesn't exist: " + ex)
// }
// console.log(
//     await SpaceContract.methods.isMember(tokenAddress).call()
// );
