import * as Box from '3box'

async function run() {
    const did = "did:muport:QmcqMi1n6PySpZvcKkZq6SN6hWzxxGMnVtM8qTxHpiBptg"
    const profile = await Box.getProfile(did)
    const accounts = await Box.getVerifiedAccounts(profile)
    console.log(accounts)
    

    let validatedClaim = await Box.idUtils.verifyClaim(profile.proof_did, { audience: did })
    let record = validatedClaim.doc
    console.log(record)

    // let resolver = new Resolver({
    //     '3': () => threeid
    // })
    // let record = await resolver.resolve(did)
    
    // for(let l of record.publicKey) {
    //     if(l.ethereumAddress) {
    //         return l.ethereumAddress
    //     }
    // }



}


run()