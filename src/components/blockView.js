import { Button, Input, Flex, Select, Heading, List, ListItem, Stack, ListIcon } from "@chakra-ui/react";
import { CheckIcon, TimeIcon } from '@chakra-ui/icons'
import { useEffect, useState } from "react";
export default function BlockView(props) {
    return (
        <Stack alignItems='center' >
            <Flex direction='column' background='gray.700' p={12} rounded={12}>
                {
                    props.block.mined &&
                    <Heading mt='-8' mb='10'>Block{props.block.blockNumber}</Heading>
                }
                {!props.block.mined &&
                    <Heading mt='-8' mb='10'>Pending</Heading>}
                <List spacing={3}>
                    {
                        props.block.transactions.map((elem) => {
                            return (
                                <ListItem>

                                    {props.block.mined && <ListIcon as={CheckIcon} color='green.500' />}
                                    {!props.block.mined && <ListIcon as={TimeIcon} color='gray.400' />}

                                    {elem.value}$
                                    From{' '}
                                    {props.addressesMapping[elem.from]}
                                    {' '}
                                    to{' '} {props.addressesMapping[elem.to]}
                                </ListItem>)
                        })
                    }
                </List>

                <Heading size='5xl' mt='25'>Block Hash</Heading>
                <Input value={props.block.blockHash}></Input>

                <Heading size='5xl' mt='2'>Nonce</Heading>
                <Input value={props.block.nonce}></Input>
                {
                    !props.block.mined&&
                    <Heading size='5xl' mt='3'>Miner:</Heading>
                
                }
                {
                    !props.block.mined &&
                    <Select

                        value={props.miner}
                        onChange={(event) => props.setMiner(event.target.value)}
                        maxW='30vh' variant='filled'
                        placeholder='select receiver'
                        justifySelf='center'>
                        {props.getWallets()}
                    </Select>
                }

                {((!props.block.mined) && (!props.mining)) && <Button mt='5' onClick={
                    props.mineBlock
                }>Mine</Button>}

                {props.mining &&
                    <Button
                        mt='5'
                        isLoading
                        loadingText='Mining'
                        colorScheme='teal'
                    >
                        Submit
                    </Button>}
                {props.block.mined && <Heading mt='5' color='green' size='5xl'>Mined</Heading>}
            </Flex>


        </Stack>
    )
}