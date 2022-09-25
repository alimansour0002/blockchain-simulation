const ethers = require('ethers');
const hex = require('string-hex');
const { keccak256 } = require('ethers/lib/utils');

function Hash(str) {
    return ethers.utils.keccak256('0x' + hex(str));
}

class Block {
    constructor(blockNumber, previousBlockHash = '') {
        this.blockNumber = blockNumber;
        this.previousBlockHash = previousBlockHash;
        this.transactions = [];
        this.data = '';
        this.nonce = 0;
        this.mined = false;
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.data += transaction.signature;
    }
    get blockHash() {
        return Hash(this.blockNumber.toString() + this.previousBlockHash + this.data + this.nonce.toString());
    }
    mine() {
        while (this.blockHash.substring(2, 7) != '00000') {
            this.nonce++;
        }
        this.mined = true;
    }
}

class Blockchain {
    constructor() {
        this.blocks.push(new Block(0, '0'));
        this.pending = new Block(1, '0');
        numberOfBlocks = 2;
    }
    addBlock(miner) {
        this.pending.mine();
        this.blocks.push(this.pending);
        this.numberOfBlocks++;
        this.pending = new Block(numberOfBlocks - 1, this.blocks[numberOfBlocks - 2].blockHash);
        this.pending.addTransaction(null,miner,this.miningReward);
    }
    addTransaction(transaction) {
        this.pending.addTransaction(transaction);
    }
}

class UnsignedTransaction {
    constructor(from, to, value, data) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.data = data;
        this.timestamp = new Date().getTime();
        this.message = this.from + this.to + this.value + this.data + this.timestamp;
    }
}
