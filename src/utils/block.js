const ethers = require('ethers');
const { keccak256 } = require('ethers/lib/utils');
class Block {
    constructor(blockNumber, previousBlockHash = '') {
        this.blockNumber = blockNumber;
        this.previousBlockHash = previousBlockHash;
        this.data = '';
        this.transactions = [];
    }
    get blockHash() {
        return ethers.utils.sha256(this.blockNumber + this.previousBlockHash + this.data);
    }
}

class UnsignedTransaction {
    constructor(from, to, value, data) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.data = data;
        this.timestamp = new Date().getTime();
        this.message=this.from+this.to+this.value+this.data+this.timestamp;
    }
}
