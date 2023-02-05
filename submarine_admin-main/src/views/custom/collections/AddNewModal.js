import { useState } from 'react'

import { User, AlignCenter, Info, X, PlusCircle, MinusCircle } from 'react-feather'

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

// ** Third Party Components
import Flatpickr from 'react-flatpickr'

import '@styles/react/libs/flatpickr/flatpickr.scss'

import styles from './index.module.scss'

const AddNewModal = ({
  open,
  handleModal,
  mode,
  data,
  baseImage,
  handleSubmitModal,
  handleEditChange,
  newCreator,
  handleAddCreator,
  handleCreatorChange,
  handleDeleteCreator,
  launchDate,
  handleDateChange
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
          <Label>* Name</Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input name='name' value={data.name} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>* Symbol</Label>
          <InputGroup>
            <InputGroupText>
              <Info size={15} />
            </InputGroupText>
            <Input name='symbol' value={data.symbol} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>Creator</Label>
          {
            data.creators.map((creator, index) => {
              return (
                <InputGroup key={index} className='mb-1'>
                  <InputGroupText>
                    <Info size={15} />
                  </InputGroupText>
                  <Input value={creator} onChange={(event) => handleCreatorChange(event, index)} />
                  <Button.Ripple className='btn-icon' color='danger' onClick={(event) => handleDeleteCreator(event, index)}>
                    <MinusCircle size={16} />
                  </Button.Ripple>
                </InputGroup>
              )
            })
          }
        </div>
        <div className='mb-1'>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input placeholder='New Creator' name='newCreator' value={newCreator} onChange={handleEditChange} />
            <Button.Ripple className='btn-icon' color='primary' onClick={handleAddCreator}>
              <PlusCircle size={16} />
            </Button.Ripple>
          </InputGroup>
        </div>
        {/* <div className='mb-1'>
          <Label>Total Supply</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input name='totalSupply' value={data.totalSupply} onChange={handleEditChange} />
          </InputGroup>
        </div> */}
        <div className='mb-1'>
          <Label>Launch Date</Label>
          <Flatpickr
            value={launchDate}
            data-enable-time
            name='launchDate'
            className='form-control'
            onChange={date => handleDateChange(date)}
          />
        </div>
        <div className='mb-1'>
          <Label>Description</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input name='description' value={data.description} onChange={handleEditChange} />
          </InputGroup>
        </div>
        {/* base image import */}
        <div className='mb-1'>
          <div>Base Imgae</div>
          <div className={styles.icon_content}>
            <img src={baseImage.src} />
            <input name='baseImage' type='file' onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Twitter Link</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input name='twitterLink' value={data.twitterLink} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>Discord Link</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input name='discordLink' value={data.discordLink} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>Website Link</Label>
          <InputGroup>
            <InputGroupText>
              <AlignCenter size={15} />
            </InputGroupText>
            <Input name='websiteLink' value={data.websiteLink} onChange={handleEditChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label>New Collection</Label>
          <div className='form-switch'>
            <Input name='isNew' type='switch' checked={data.isNew} onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Upcoming Collection</Label>
          <div className='form-switch'>
            <Input name='isUpcoming' type='switch' checked={data.isUpcoming} onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Pupular Collection</Label>
          <div className='form-switch'>
            <Input name='isPopular' type='switch' checked={data.isPopular} onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Darft Collection</Label>
          <div className='form-switch'>
            <Input name='isDraft' type='switch' checked={data.isDraft} onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Featured Collection</Label>
          <div className='form-switch'>
            <Input name='isFeatured' type='switch' checked={data.isFeatured} onChange={handleEditChange} />
          </div>
        </div>
        <div className='mb-1'>
          <Label>Verified Collection</Label>
          <div className='form-switch'>
            <Input name='isVerified' type='switch' checked={data.isVerified} onChange={handleEditChange} />
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
