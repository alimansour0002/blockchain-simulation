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
} from '@chakra-ui/react';
import { PhoneIcon, AddIcon, WarningIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { ethers } from "ethers";
import BalancesTable from './components/balancesTable'

function App() {
  const [wallet, setWallet] = useState();
  const [targetWallet, setTargetWallet] = useState();
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState([]);
  const [amount, setAmount] = useState('');

  function handleTransaction() {
    
  }

  function createWallet(balance) {
    let newWallets = [...wallets];
    newWallets.push({ privateKey: newWallet.privateKey, publicKey: newWallet.publicKey });
    console.log('he', balances.length);
    setWallets(newWallets);
    setBalances([...balances, balance]);
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
          <Stack direction="row" mt='10' maxW='90vh'>
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
            <Select value={wallet} onChange={(event) => setTargetWallet(event.target.value)} maxW='20vh' variant='filled' placeholder='select wallet' justifySelf="flex-start">
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

        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
