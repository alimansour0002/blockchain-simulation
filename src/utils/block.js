const ethers = require('ethers');
const hex = require('string-hex');
const { keccak256 } = require('ethers/lib/utils');

export function Hash(str) {
    return ethers.utils.keccak256('0x' + hex(str));
}

export class Block {
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
        this.data += Hash(transaction.message);
    }
    get blockHash() {
        return Hash(this.blockNumber.toString() + this.previousBlockHash + this.data + this.nonce.toString());
    }
    mine() {
        while (this.blockHash.substring(2, 6) != '0000') {
            this.nonce++;
        }
        this.mined = true;
    }
}

export class Blockchain {
    constructor() {
        this.blocks = [];
        this.blocks.push(new Block(0, '0'));
        this.pending = new Block(1, '0');
        this.numberOfBlocks = 1;
        this.miningRewar = 1;
    }
    addBlock(miner) {
        this.pending.mine();
        this.blocks.push(this.pending);
        this.numberOfBlocks++;
        this.pending = new Block(this.numberOfBlocks, this.blocks[this.numberOfBlocks - 1].blockHash);
    }
    balance(address) {
        let bal = 2;
        for (const block of this.blocks) {
            for (const trans of block.transactions) {
                if (trans.from == address) {
                    bal -= trans.value;
                }
                if (trans.to == address) {
                    bal += trans.value;
                }
            }
        }
        for (const trans of this.pending.transactions) {
            {
                if (trans.from == address) {
                    bal -= trans.value;
                }
                if (trans.to == address) {
                    bal += trans.value;
                }
            }
        }
        return bal;
    }
    addTransaction(transaction) {
        if (!(transaction?.signature)) return 'Transaction is not signed';
        if (!transaction.checkvalidity) return 'error';
        if (this.balance(transaction.from) < transaction.value) return 'no enough funds';
        this.pending.addTransaction(transaction);
        return 'Confirmed';
    }
}

export class Wallet {
    constructor(walletName) {
        this.walletName = walletName;
        this.wallet = ethers.Wallet.createRandom();
        this.privateKey = this.wallet.privateKey;
        this.publicKey = this.wallet.publicKey;
    }
     async signTransaction(unsignedTransaction) {
        const w = new SignedTransaction(unsignedTransaction, await this.wallet.signMessage(unsignedTransaction.message));
        return w;
    }
}

export class SignedTransaction {
    constructor(unsignedTransaction, signature) {
        this.from = unsignedTransaction.from;
        this.to = unsignedTransaction.to;
        this.value = unsignedTransaction.value;
        this.message = unsignedTransaction.message;
        this.signature = signature;
    }
    get checkvalidity() {
        return (this.from == ethers.utils.recoverPublicKey(ethers.utils.hashMessage(this.message), this.signature));
    }
}

export class UnsignedTransaction {
    constructor(from, to, value) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.timestamp = new Date().getTime().toString();
        this.message = this.from + this.to + this.value.toString() + this.timestamp;
    }
}
