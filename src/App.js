import { useState, useEffect } from 'react'
import {
  ChakraProvider,
  Box,
  Stack,
  Select,
  Grid,
  InputGroup,
  Input, InputLeftElement,
  InputRightElement,
  theme,
  Button,
  useColorMode,
} from '@chakra-ui/react';

import _ from 'lodash'

import { PhoneIcon, AddIcon, WarningIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { ethers } from "ethers";
import BalancesTable from './components/balancesTable'
import { Blockchain, Block, Wallet, UnsignedTransaction, SignedTransaction, Hash } from '../src/utils/block'
import BlockView from './components/blockView'

function App() {
  const [blockchain, setBlockchain] = useState(new Blockchain());
  const [wallet, setWallet] = useState();
  const [targetWallet, setTargetWallet] = useState();
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState([]);
  const [amount, setAmount] = useState('');
  const [addresses, setAddresses] = useState({ [blockchain.coinBase.publicKey]: 'CoinBase' });
  const [isMining, setIsMining] = useState(false);
  const [miner, setMiner] = useState('');

  const { toggleColorMode } = useColorMode();
  useEffect(() => {
    let x = createWallet();
    setMiner(0);

  }, [])

  useEffect(() => {
    let x = [];
    for (let i = 0; i < wallets.length; i++) {
      x.push(blockchain.balance(wallets[i].publicKey));
    }
    setBalances(x);

  }, [blockchain.blocks.length])

  useEffect(() => {
    if (!isMining) return;
    setBlockchain((prev) => {
      let newBlockchain = _.cloneDeep(prev);
      newBlockchain.addBlock(wallets[miner].publicKey);
      return newBlockchain;
    });
    setIsMining(false);
  }, [isMining])

  async function handleTransaction() {
    const unsignedTransaction = new UnsignedTransaction(wallets[wallet].publicKey, wallets[targetWallet].publicKey, parseInt(amount));
    const signedTransaction = await wallets[wallet].signTransaction(unsignedTransaction);
    setBlockchain((prev) => {
      let newBlockchain = _.cloneDeep(prev);
      let al = newBlockchain.addTransaction(signedTransaction);
      if (al != 'Confirmed') alert(al);
      return newBlockchain;
    });
  }

  function createWallet(balance) {
    let newWallets = [...wallets, new Wallet('a')];
    setAddresses((prev) => {
      let newAddresses = _.cloneDeep(prev);
      let x = newWallets[newWallets.length - 1].publicKey;
      newAddresses[x] = 'wallet ' + newWallets.length.toString();
      return newAddresses;
    });
    setWallets(newWallets);
    setBalances([...balances, 2]);
    return newWallets[newWallets.length - 1].publicKey;
  }

  function mineBlock() {
    if (miner=='') {
      alert('Select a miner');
      return;
    }
    setIsMining(true);
  }

  function getWallets() {
    return (
      wallets.map((elem, ind) =>
        <option value={ind} >wallet {ind + 1}</option>)

    );
  }


  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="10vh" p={3}>

          <ColorModeSwitcher justifySelf="flex-end" />
          <Stack direction="row">

            <Select value={wallet} onChange={(event) => setWallet(event.target.value)} maxW='20vh' variant='filled' placeholder='select wallet' justifySelf="flex-start">
              {getWallets()}
            </Select>
            <Button onClick={() => createWallet(10)}>Create Wallet</Button>
          </Stack>
          <Stack direction="row" mt='10' mb='10'>
            <InputGroup maxW='40vh'>
              <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children='$'
              />

              <Input placeholder='Enter amount' onChange={(event) => setAmount(event.target.value)} value={amount} />
              {(amount <= balances[wallet]) &&
                <InputRightElement children={<CheckIcon color='green.500' />} />
              }
              {(amount > balances[wallet]) &&
                <InputRightElement children={<CloseIcon color='red.500' />} />
              }
            </InputGroup>
            <Select value={targetWallet} onChange={(event) => setTargetWallet(event.target.value)} maxW='25vh' variant='filled' placeholder='select receiver' justifySelf="flex-start">
              {getWallets()}
            </Select>

            {(amount > balances[wallet]) &&
              <h1>insufficient funds</h1>
            }
            {(amount <= balances[wallet]) &&
              <Button onClick={handleTransaction}>Send money</Button>
            }

          </Stack>

          <BalancesTable balances={balances} />

          <Stack direction='row' >
            {
              blockchain.blocks.map((elem, ind) => {
                if (ind > 0 && blockchain.blocks.length - 3 <= ind) return <BlockView block={elem}
                  addressesMapping={addresses}
                />
              })
            }

            <BlockView block={blockchain.pending}
              mineBlock={mineBlock}
              addressesMapping={addresses}
              mining={isMining}
              miner={miner}
              setMiner={setMiner}
              getWallets={getWallets}
            />
          </Stack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
