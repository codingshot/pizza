async function createDAODrop() {
    const path = require("path");
const homedir = require("os").homedir();

// const { KeyPair, keyStores, connect } = require("near-api-js");
const { UnencryptedFileSystemKeyStore } = require("@near-js/keystores-node");
var assert = require('assert');
const { Account } = require("@near-js/accounts");
const { Near } = require("@near-js/wallet-account");


require('dotenv').config();
let telegram_public_bot = process.env.TELEGRAM_KEYBOT;


const keypom = require("@keypom/core");
// const { DEV_CONTRACT } = require("./configurations");
// const TESTNET_DAO_CONTRACT = "onboard.sputnikv2.testnet";
let chatID = process.env.groupChatID;
const args = process.argv.slice(2);

// Check if the argument was passed
if (args.length === 0) {
  console.error('Please provide a number as an argument.');
  process.exit(1);
}

// Get the argument value and convert it to a number
const numberOfKeys = parseInt(args[0], 10);
if (isNaN(numberOfKeys)) {
  console.error('Invalid number provided as an argument.');
  process.exit(1);
}
const { parseNearAmount } = require("@near-js/utils");

// Use the number in your script
// console.log(`The number of keys to generate is: ${numberOfKeys}.`);
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(telegram_public_bot, { polling: false });
const CREDENTIALS_DIR = ".near-credentials";     // Initiate connection to the NEAR blockchain.
const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

const {
	initKeypom,
	getEnv,
	createDrop,
    // parseNearAmount,
    createNFTSeries,
    formatLinkdropUrl
} = keypom

const NETWORK_ID = "mainnet"; // mainnet only big ballin
const FUNDER_ACCOUNT_ID = "rarepizzas.near"; // change to your account
const roleName = "Onboardees";
const DAO_CONTRACT = "onboarddao.sputnik-dao.near";
const NFT_TOKEN_ID = "keypom-token-" + Date.now().toString();

// const numberOfkey = 1; // basically number of links, this is arg through CLI
let keyStore = new UnencryptedFileSystemKeyStore(credentialsPath); 
console.log("debug 1 line 66");
let nearConfig = {
    networkId: NETWORK_ID,
    keyStore: keyStore,
    nodeUrl: `https://rpc.${NETWORK_ID}.near.org`,
    walletUrl: `https://wallet.${NETWORK_ID}.near.org`,
    helperUrl: `https://helper.${NETWORK_ID}.near.org`,
    explorerUrl: `https://explorer.${NETWORK_ID}.near.org`,
};  

    
let near = new Near(nearConfig);

const fundingAccount = new Account(near.connection, FUNDER_ACCOUNT_ID)
// If a NEAR connection is not passed in and is not already running, initKeypom will create a new connection
// Here we are connecting to the testnet network
await initKeypom({
    near,
    network: NETWORK_ID,
});

// console.log("debug before the drop");

// Create drop with 10 keys and 2 key uses each
let {keys, dropId} = await createDrop({
    account: fundingAccount,
    numKeys: numberOfKeys,
    config: {
        usesPerKey: 1
    },
            depositPerUseNEAR: "0.01",

    fcData: {
        methods: [
            [
                {
                    receiverId: "nft-v2.keypom.near", // check if this
                    methodName: "nft_mint",
                    args: JSON.stringify({
                        // Change this token_id if it already exists -> check explorer transaction
                        token_id: NFT_TOKEN_ID,
                        metadata: {
                            title: "Global Pizza Day POAP 2023",
                            description: "PizzaDAO comes to North Africa. With this NFT you are automatically onboarded on-chain to North Africa DAO, Onboard DAO, and Pizza DAO on NEAR.",
                            media: "https://ipfs.near.social/ipfs/bafkreigjhig32jinjqeje4jva5ygki5345rfzhyg7vksbhlvwoiaw7ew3e",
                        }
                    }),
                    accountIdField: "receiver_id",
                    dropIdField: "mint_id",
                    // Attached deposit of 1 $NEAR for when the receiver makes this function call
                    attachedDeposit: parseNearAmount("0.01")  // give less and see what happens
                },
                {
                    receiverId: "onboarddao.sputnik-dao.near", //change to your dao
                    methodName: "add_proposal",
                    args: JSON.stringify(
                        {
                            "proposal": {
                            "description": "Welcome to Onboard DAO. Thanks for coming to Global Pizza Day Tangier 🍕🌍",// change to your message in proposl
                            "kind": {
                                "AddMemberToRole": {
                                "role": "Onboardeee" // change to your dao role

                                }
                            }
                            }
                        }
                    ),
                    accountIdField: "proposal.kind.AddMemberToRole.member_id",
                    funderIdField: "funder",
                    attachedDeposit: parseNearAmount("0.01")  // change to the bond of your dao
                },
                {
                    receiverId: "africa.sputnik-dao.near", // change to your DAO
                    methodName: "add_proposal",
                    args: JSON.stringify(
                        {
                            "proposal": {
                            "description": "Welcome to North Africa Blockchain. Thanks for coming to Global Pizza Day Tangier 🍕🌍", // change to your message in proposl
                            "kind": {
                                "AddMemberToRole": {
                                "role": "members" // change to your dao role

                                }
                            }
                            }
                        }
                    ),
                    accountIdField: "proposal.kind.AddMemberToRole.member_id",
                    funderIdField: "funder",
                    attachedDeposit: parseNearAmount("0.01") // change to the bond of your dao
                },
                {
                    receiverId: "pizza.sputnik-dao.near", // change to your DAO
                    methodName: "add_proposal",
                    args: JSON.stringify(
                        {
                            "proposal": {
                            "description": "Welcome to Pizza DAO on NEAR. Thanks for coming to Global Pizza Day Tangier 🍕🌍", // change to your message in proposl
                            "kind": {
                                "AddMemberToRole": {
                                "role": "Pizza Trainee"  // change to your dao role

                                }
                            }
                            }
                        }
                    ),
                    accountIdField: "proposal.kind.AddMemberToRole.member_id",
                    funderIdField: "funder",
                    attachedDeposit: parseNearAmount("0.01")  // change to the bond of your dao
                }

            ],
        ] 
    }
            
    })   
await createNFTSeries ({
    account: fundingAccount,
    dropId,
    metadata:{
        title: "Global Pizza Day POAP 2023",
        description: "PizzaDAO comes to North Africa. With this NFT you are automatically onboarded on-chain to North Africa DAO, Onboard DAO, and Pizza DAO on NEAR.", // change to your nft series
        media: "https://ipfs.near.social/ipfs/bafkreigjhig32jinjqeje4jva5ygki5345rfzhyg7vksbhlvwoiaw7ew3e",
        copies: numberOfKeys,

    }
    

});

// console.log("debugg after drop";
const {contractId: KEYPOM_CONTRACT} = getEnv()
let membership = formatLinkdropUrl({
customURL: "https://wallet.near.org/linkdrop/CONTRACT_ID/SECRET_KEY", // wallet.near.org is being sunset
secretKeys: keys.secretKeys,
contractId: KEYPOM_CONTRACT,
})
console.log(`

For NEW PizzaDAO Members: 

${membership}


`)
let output = "You are now part of PizzaDAO, North Africa Blockchain, and OnboardDAO and received a POAP for Global Pizza Day 2023"+ JSON.stringify(membership); // this is part of telegram message

bot.sendMessage(chatID, output);

// need to put qr code stuff here

return keys
}
// console.log("before create dao drop");


createDAODrop()

module.exports = {
createDAODrop
}