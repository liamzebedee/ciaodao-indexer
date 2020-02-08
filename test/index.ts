const exampleClaim = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1Nzk3NTE1MzUsImFiYyI6MTIzLCJpc3MiOiJkaWQ6bXVwb3J0OlFtWTJ3REhUakJ1NmE1TjRqUmY1SDJKbVRyNFVWTTFBVUZFWmJ4RGdwWFA4aEMifQ.9NqGGw93I8lrGdy363SwN74AMXpTfdWKyQaOJPFTNkUMA_12lANrGVo0LjijulQaHH_4Tsh__55yhsGnH24Lvg'

// const Box = require('3box')
// const { idUtils } = require('3box')

const didJWT = require('did-jwt')

async function run() {
    
    console.log(
        didJWT.decodeJWT(exampleClaim, { auth: true })
        /*
        { header: { typ: 'JWT', alg: 'ES256K' },
        payload:
        { iat: 1579751535,
            abc: 123,
            iss: 'did:muport:QmY2wDHTjBu6a5N4jRf5H2JmTr4UVM1AUFEZbxDgpXP8hC' },
        signature:
        '9NqGGw93I8lrGdy363SwN74AMXpTfdWKyQaOJPFTNkUMA_12lANrGVo0LjijulQaHH_4Tsh__55yhsGnH24Lvg',
        data:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1Nzk3NTE1MzUsImFiYyI6MTIzLCJpc3MiOiJkaWQ6bXVwb3J0OlFtWTJ3REhUakJ1NmE1TjRqUmY1SDJKbVRyNFVWTTFBVUZFWmJ4RGdwWFA4aEMifQ' }
        */
       
    )
}

run()