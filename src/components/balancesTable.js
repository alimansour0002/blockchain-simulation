import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Flex,
    Th,
    Td,
    TableCaption,
    TableContainer,
    propNames,
} from '@chakra-ui/react'
function BalancesTable(props) {
    console.log(props.balances.length);
    return (
        <Flex maxW="50vh" justifySelf="flex-end">
            <TableContainer>
                <Table fontSize='15px' variant='striped' colorScheme='teal' justifySelf="flex-end">
                    <TableCaption>Balances</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Wallet Number</Th>
                            <Th>Balance</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {props.balances.map((elem, ind) =>
                            <Tr>
                                <Td>Wallet {ind + 1}</Td>
                                <Td>{elem}$</Td>
                            </Tr>
                        )}


                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )

}

export default BalancesTable;