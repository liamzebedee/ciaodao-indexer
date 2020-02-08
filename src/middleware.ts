const didJWT = require('did-jwt')

export function authMiddleware(req, res, next) {
    // check message is signed.
    const jwt = req.body.jwt
    const claim = didJWT.decodeJWT(jwt, { auth: true })
    const body = claim.payload.message
    const userDid = claim.payload.iss

    req.message = {
        claim,
        body,
        user: {
            did: userDid,
        }
    }
}



// https://ipfs.3box.io/profile?did=did:muport:QmQKuX46stz5zutJ7jTjzShw96efJkHuma9UBnUjsTqvmp
// let proof = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1NjY2MzcwODgsImlzcyI6ImRpZDptdXBvcnQ6UW1RS3VYNDZzdHo1enV0SjdqVGp6U2h3OTZlZkprSHVtYTlVQm5VanNUcXZtcCJ9.SE9X6oSchY18k0Hx7RAOk-FYaE0ErzZtXCfFafxi4MMKrl8_vh7Ewc7W7xkDu8DUXNYqMb-k2QIYcK0R9Yyigg"
// didJWT.decodeJWT(proof, { auth: true })