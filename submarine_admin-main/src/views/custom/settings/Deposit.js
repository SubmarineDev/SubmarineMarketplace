// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Store & Actions
import { getData, addEvent, updateEvent, deleteEvent } from './store'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { Plus, Edit, MoreVertical, Trash, ChevronDown, ChevronUp } from 'react-feather'

// ** Reactstrap Imports
import {
  Card, CardHeader, CardTitle, Input, Label, Row, Col, Button,
  Table, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap'

import IDL from "../../../constants/submarine_reward_contract.json"
import { Connection, PublicKey, SystemProgram, Keypair} from "@solana/web3.js"
import AddNewModal from './AddNewModal'
import { CLUSTER_API_URL, PROGRAM_ID, PV_KEY, DECIMAL } from '../../../configs'
import * as anchor from "@project-serum/anchor"
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import bs58 from 'bs58'
const Deposit = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.setting)
  const [amount, setAmount] = useState(0)
  const keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(PV_KEY)))
  const wallet = new NodeWallet(keypair)
  const connection = new Connection(CLUSTER_API_URL)
  const provider = new anchor.AnchorProvider(connection, wallet, 'confirmed')
  const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)
  // ** Get data on mount
  useEffect(() => {

  }, [dispatch])
  
  const deposit = async() => {
    try {
      const [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from('program data')], program.programId)
      const [vault, nonce_vault] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from('submarine vault')], program.programId)
      const value = Math.round(amount)
      const secondValue = (amount - value) * DECIMAL
      const tx = await program.methods.deposit(value, secondValue).accounts({
        data: dataPda,
        admin: wallet.publicKey,
        vault,
        systemProgram: SystemProgram.programId
      }).rpc()
      console.log(tx)
      setAmount(0)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Deposit</CardTitle>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label className='me-1' for='search-input'>

              </Label>
              <Input
                className='dataTable-filter'
                type='number'
                bsSize='md'
                id='search-input'
                style={{marginRight: "10px"}}
                onChange={e => setAmount(e.target.value)}
                value={amount}
              />
              <div className='d-flex mt-md-0 mt-1'>
                <Button className='ml-2' color='primary' onClick={() => deposit()}>
                  <span className='align-middle ml-50'>Save</span>
                </Button>
              </div>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}

export default memo(Deposit)
