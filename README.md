# 🍕🔑 PizzaDAO Keypom Onboard
The following is a script that uses keypom (https://docs.keypom.xyz) on NEAR protocol to issue a linkdrop (ability to claim a series of nft/ft/near/function calls with or without an account).

## Functionality
- create an account
- get a NFT
- get added via proposal to a series of DAOs

```
npm install
```


Switch to mainnet in cli

```
export NEAR_ENV=mainnet
```

```
near login 
```

- after you near login replace the FUNDER_ACCOUNT with your account
- change the DAO name with your DAO and a custom message and the specific role (case sensistive) you want to add these members to. 
- you can also changed the deposit per link to a larger or smaller amount depending how muhc NEAR you want to load each account win
- put telegram api key and chatID (use telegram raw bot to get your chat id https://t.me/RawDataBot) in .env (check example.ev) 
- make sure in your DAO the v2.keypom.near contract has permission to add_member as a porposal. Note this does not allow for autoregistration to prevent the keypom contract from having to much permission over your DAO. 


```
node pizza.ts {number-of-keypom-drops}
```


# ToDo
- add QR code generator for to generate QR code for each link


# Future
- have them post to social.near

