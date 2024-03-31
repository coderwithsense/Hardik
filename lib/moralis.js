import Moralis from 'moralis';
import Web3 from 'web3';
import dotenv from 'dotenv';

dotenv.config();

const web3 = new Web3(Web3.givenProvider || process.env.ETH_RPC);
Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

export async function getTokenList(address) {
    try {
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: '0x1',
            address: address
        });
        return response.raw;
    } catch (error) {
        if (error.code === 'C0005') {
            return "Enter a valid address"
        }
        return "Something went wrong"
    }
}

export async function getTokenInformation(address) {
    try {
        const metadata = await Moralis.EvmApi.token.getTokenMetadata({
            "chain": "0x1",
            "addresses": [
                address
            ]
        });
        const price = await Moralis.EvmApi.token.getMultipleTokenPrices({
            "chain": "0x1",
            "include": "percent_change"
          },{
            "tokens": [
              {
                "tokenAddress": address
              }
            ]
          });
        const metadataResponse = metadata.jsonResponse;
        const priceResponse = price.jsonResponse;
        return `Name: ${metadataResponse[0].name}\nSymbol: ${metadataResponse[0].symbol}\nDecimals: ${metadataResponse[0].decimals}\nPrice: ${priceResponse[0].usdPriceFormatted}\nExchange: ${priceResponse[0].exchangeName}\n24hr Percent Change: ${priceResponse[0]['24hrPercentChange']}`;
    } catch (error) {
        console.log(error);
        return "Something went wrong"
    }
}

async function getBlockInfo() {
    try {
        const response = await web3.eth.getBlock('latest');
        console.log(response);
    } catch (error) {
        console.log(error);
        return "Something went wrong"
    }
}

async function getNumberOfTransactions(block) {
    try {
        const response = await web3.eth.getBlockTransactionCount(block);
        console.log(response);
    } catch (error) {
        console.log(error);
        return "Something went wrong"
    }
}

getNumberOfTransactions('latest')