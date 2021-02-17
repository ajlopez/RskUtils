# Generate Ethereum/RSK Addresses

Install npm packages:

```
npm install
```

Execute
```
node genaddresses <naddresses>
```

Example
```
node genaddresses 4
```

Sample output
```
[
{
    "privateKey": "0xdc67a1ee5bcf26436ea311ba8807b98ee1f18b560d4c938f36c294c55267c81b",
    "publicKey": "0xa9c91e6a2e34366713db168f6b8b1c426a93c14f81469f3f8e2366082ecb92980662fc01be710e66d591684473532896e08b3ea3c096e2d3412a8fb134c3f2eb",
    "address": "0x74d9bf546ff9c8da635126a91a6447335e06f1f2"
}
,
{
    "privateKey": "0x858980bd094d99f2ba19037ebcb07297962f96216dc1d36587e7782fdbfe3930",
    "publicKey": "0x873f21ed3d6f8ff10c11cbd28fb97b6f23d11a59a31e768ac33773a0b2fff33d5c306f8b4794064bb77d99e7ae3b4351cd8d6cfdff486af20b5b837fbdaeb75d",
    "address": "0x82152b3428529598793760fb3e39c49cf5a59bcd"
}
,
{
    "privateKey": "0xf188067e72f7bb73b82097658e6ba07f12651caf5bdbe0475de81c5a9e2f3f1d",
    "publicKey": "0xb50546db727248e9ac5820a9995c9c68cba7b5c6ea814e0205bdb2e74c7cf4df8ae3723b593707bc94c8bba83c9f407e08c0f57be7549416f2dbde1f8e0bf1db",
    "address": "0x6929d31d7599e561c91107a9cf1d3bb903b5ac27"
}
,
{
    "privateKey": "0x78db121db06eab4c23c559712fef902fda396e5bcedee232b1e2195e26aa1db2",
    "publicKey": "0x6f6bf8021226bc08399b929b6c7c0bcf8520a4630782806f207217991fff8ff14b7c1626df0a241cb3c03440510dad2f8807f41ed5b808e1532252e0636bb5a1",
    "address": "0xbff747bc535a48caef934df2b90190026bd164ca"
}
]
```

## References

- [Secp256k1](https://en.bitcoin.it/wiki/Secp256k1)
- [Ethereum: How to generate Private key, public key and address](https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address)
- [ethereumjs-util CDN](https://www.jsdelivr.com/package/npm/ethereumjs-util)
- [ethereumjs-util: Docs, Tutorials, Reviews | Openbase](https://openbase.com/js/ethereumjs-util)

