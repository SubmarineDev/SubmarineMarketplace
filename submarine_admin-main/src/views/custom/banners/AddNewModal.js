import { User, Info, X } from 'react-feather'

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

import styles from './index.module.scss'

const AddNewModal = ({
  open,
  handleModal,
  mode,
  data,
  baseImage,
  handleBaseImageChange,
  bannerImage,
  handleBannerImageChange,
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
          <Label>* Title</Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input name='title' value={data.title} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>* Description</Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input name='description' value={data.description} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>* Action Name</Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input name='actionName' value={data.actionName} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>* Action Link</Label>
          <InputGroup>
            <InputGroupText>
              <Info size={15} />
            </InputGroupText>
            <Input name='actionLink' value={data.actionLink} onChange={handleEditChange} />
          </InputGroup>
        </div>
        {/* base image import */}
        <div className='mb-1'>
          <div>Base Imgae</div>
          <div className={styles.icon_content}>
            <img src={baseImage.src} />
            <input type='file' onChange={handleBaseImageChange} />
          </div>
        </div>
        {/* banner image import */}
        <div className='mb-1'>
          <div>Banner Imgae</div>
          <div className={styles.icon_content}>
            <img src={bannerImage.src} />
            <input type='file' onChange={handleBannerImageChange} />
          </div>
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
