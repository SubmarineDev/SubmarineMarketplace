import { User, AlignCenter, Info, X } from 'react-feather'

// ** Reactstrap Imports
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
  Input,
  Label
} from 'reactstrap'

const AddNewModal = ({
  open,
  handleModal,
  mode,
  data,
  handleSubmitModal,
  handleEditChange
}) => {

  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-3' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>{mode === 'NEW' ? 'New Record' : 'Edit Record'}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label for='Key'>* Key</Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='Key' placeholder='Key' value={data.key} onChange={(event) => handleEditChange(event, 'key')} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label for='Value'>* Value</Label>
          <InputGroup>
            <InputGroupText>
              <Info size={15} />
            </InputGroupText>
            <Input id='Value' placeholder='Value' value={data.value} onChange={(event) => handleEditChange(event, 'value')} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label for='description'>Description</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input id='description' placeholder='Description' value={data.description} onChange={(event) => handleEditChange(event, 'description')} />
          </InputGroup>
        </div>
        <Button className='mr-1' color='primary' onClick={handleSubmitModal}>
          Submit
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal
