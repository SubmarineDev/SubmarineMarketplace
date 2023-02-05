// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Store & Actions
import { getData, addEvent, updateEvent, deleteEvent, approveEvent, rejectEvent } from './store'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { Plus, Edit, MoreVertical, Trash, ChevronDown, ChevronUp } from 'react-feather'

// ** Reactstrap Imports
import {
  Card, CardHeader, CardTitle, Input, Label, Row, Col, Button,
  Table, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap'

import AddNewModal from './AddNewModal'
import DefaultImage from '@src/assets/images/custom/default.png'

import { BACKEND_URL, COLLECTION_STATUS } from '@src/configs'
import Loading from 'react-loading-components'

const Datatable = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.collection)

  // ** States
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [mode, setMode] = useState("NEW")
  const [filter, setFilter] = useState({
    currentPage: 1,
    column: 'name',
    direction: 'asc',
    rowsPerPage: 7,
    searchValue: ''
  })

  const [data, setData] = useState(
    {
      id: 0,
      name: '',
      symbol: '',
      creators: [],
      // totalSupply: 0,
      launchDate: new Date(),
      description: '',
      baseImage: '',
      twitterLink: '',
      discordLink: '',
      websiteLink: '',
      isNew: true,
      isUpcoming: true,
      isPopular: false,
      isDraft: false,
      isFeatured: false,
      isVerified: false
    }
  )

  const [newCreator, setNewCreator] = useState('')
  const [launchDate, setLaunchDate] = useState(new Date())
  const [baseImage, setBaseImage] = useState({
    src: DefaultImage,
    file: ''
  })

  const count = Math.ceil(store.total / filter.rowsPerPage)

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData(filter)
    )
  }, [dispatch])

  // ** Function to handle filter
  const handleFilter = e => {
    const filterData = {
      ...filter,
      searchValue: e.target.value,
      currentPage: 1
    }
    setFilter(filterData)

    dispatch(
      getData(filterData)
    )
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    const filterData = {
      ...filter,
      currentPage: page.selected + 1
    }
    setFilter(filterData)
    dispatch(
      getData(filterData)
    )
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const filterData = {
      ...filter,
      currentPage: 1,
      rowsPerPage: parseInt(e.target.value)

    }
    setFilter(filterData)
    dispatch(
      getData(filterData)
    )
  }

  const handleSort = (column) => {
    if (filter.column === column) {
      const filterData = {
        ...filter,
        currentPage: 1,
        column,
        direction: filter.direction === "asc" ? "desc" : "asc"
      }
      setFilter(filterData)
      dispatch(
        getData(filterData)
      )
    } else {
      const filterData = {
        ...filter,
        currentPage: 1,
        column,
        direction: "asc"
      }
      setFilter(filterData)
      dispatch(
        getData(filterData)
      )
    }
  }

  // Custom Functions

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)

  const handleEditChange = (event) => {
    switch (event.target.name) {
      case 'baseImage':
        {
          if (event.target.files && event.target.files[0]) {
            setBaseImage({
              src: URL.createObjectURL(event.target.files[0]),
              file: event.target.files[0]
            })
          }
        }
        break
      case 'newCreator':
        {
          setNewCreator(event.target.value)
        }
        break
      case 'isNew':
      case 'isUpcoming':
      case 'isPopular':
      case 'isDraft':
      case 'isFeatured':
      case 'isVerified':
        {
          setData({
            ...data,
            [event.target.name]: event.target.checked
          })
        }
        break
      default:
        setData({
          ...data,
          [event.target.name]: event.target.value
        })
    }
  }

  const handleDateChange = date => {
    setLaunchDate(date[0])
  }

  const handleNewModal = () => {
    setData({
      id: 0,
      name: '',
      symbol: '',
      creators: [],
      // totalSupply: 0,
      launchDate: new Date(),
      description: '',
      baseImage: '',
      twitterLink: '',
      discordLink: '',
      websiteLink: '',
      isNew: true,
      isUpcoming: true,
      isPopular: false,
      isDraft: false,
      isFeatured: false,
      isVerified: false
    })

    setBaseImage({ src: DefaultImage, file: '' })

    setMode("NEW")
    handleModal()
  }
  const handleEditRow = (event, id) => {
    event.preventDefault()
    setData({
      ...store.data[id],
      launchDate: new Date(store.data[id].launchDate)
    })

    setBaseImage({ src: store.data[id].baseImage === null ? DefaultImage : `${BACKEND_URL}${store.data[id].baseImage}`, file: '' })

    setMode("EDIT")
    handleModal()
  }

  const handleDeleteRow = (event, id) => {
    event.preventDefault()

    if (confirm("Do you want to delete this row?")) {
      dispatch(
        deleteEvent(store.data[id].id)
      )
    }
  }

  const handleApproveRow = (event, id) => {
    event.preventDefault()

    if (confirm("Do you want to approve this row?")) {
      dispatch(
        approveEvent(store.data[id].id)
      )
    }
  }

  const handleRejectRow = (event, id) => {
    event.preventDefault()

    if (confirm("Do you want to reject this row?")) {
      dispatch(
        rejectEvent(store.data[id].id)
      )
    }
  }

  const handleSubmitModal = async () => {
    setLoading(true)
    if (mode === "NEW") {

      const formData = new FormData()
      if (baseImage.file !== '') {
        formData.append('baseImage', baseImage.file)
      }
      formData.append('data', JSON.stringify(
        {
          ...data,
          launchDate
        }
      ))

      await dispatch(
        await addEvent(formData)
      )

      handleModal()
    } else {
      const formData = new FormData()
      if (baseImage.file !== '') {
        formData.append('baseImage', baseImage.file)
      }
      formData.append('data', JSON.stringify({ ...data, launchDate }))

      await dispatch(
        await updateEvent(formData)
      )
      handleModal()
    }
    setLoading(false)
  }

  const handleAddCreator = (event) => {
    const newCreators = [...data.creators]
    newCreators.push(newCreator)
    setNewCreator('')
    setData({
      ...data,
      creators: newCreators
    })
  }

  const handleCreatorChange = (event, index) => {
    const newCreators = data.creators
    newCreators[index] = event.target.value
    setData({
      ...data,
      creators: newCreators
    })
  }

  const handleDeleteCreator = (event, index) => {
    const newCreators = data.creators.filter((state, key) => key !== index)

    setData({
      ...data,
      creators: newCreators
    })
  }

  console.log('loading==============', loading)

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Collections</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ml-2' color='primary' onClick={handleNewModal}>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add Record</span>
            </Button>
          </div>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={filter.rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='me-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={filter.searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <Table striped responsive>
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => handleSort("name")} >
                Name {filter.column === "name" ? (filter.direction === "desc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />) : ""}
              </th>
              <th style={{ whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => handleSort("symbol")}>
                Symbol  {filter.column === "symbol" ? (filter.direction === "desc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />) : ""}
              </th>
              <th style={{ whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => handleSort("status")}>
                Status  {filter.column === "status" ? (filter.direction === "desc" ? <ChevronUp size={20} /> : <ChevronDown size={20} />) : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              store.data.map((element, index) => (
                <tr key={index}>
                  <td>
                    <span className='align-middle font-weight-bold'>{element.name}</span>
                  </td>
                  <td> {element.symbol} </td>
                  <td> {COLLECTION_STATUS[element.status]} </td>
                  <td>
                    <UncontrolledDropdown>
                      <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                        <MoreVertical size={15} />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem href='/' onClick={(event) => handleApproveRow(event, index)}>
                          <Edit className='mr-50' size={15} /> <span className='align-middle'>Approve</span>
                        </DropdownItem>
                        <DropdownItem href='/' onClick={(event) => handleRejectRow(event, index)}>
                          <Edit className='mr-50' size={15} /> <span className='align-middle'>Reject</span>
                        </DropdownItem>
                        <DropdownItem href='/' onClick={(event) => handleEditRow(event, index)}>
                          <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
                        </DropdownItem>
                        <DropdownItem href='/' onClick={(event) => handleDeleteRow(event, index)}>
                          <Trash className='mr-50' size={15} /> <span className='align-middle'>Delete</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              )
              )
            }
          </tbody>
        </Table>
        <ReactPaginate
          previousLabel={''}
          nextLabel={''}
          breakLabel='...'
          pageCount={count || 1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          activeClassName='active'
          forcePage={filter.currentPage !== 0 ? filter.currentPage - 1 : 0}
          onPageChange={page => handlePagination(page)}
          pageClassName='page-item'
          breakClassName='page-item'
          nextLinkClassName='page-link'
          pageLinkClassName='page-link'
          breakLinkClassName='page-link'
          previousLinkClassName='page-link'
          nextClassName='page-item next-item'
          previousClassName='page-item prev-item'
          containerClassName={
            'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
          }
        />
      </Card>
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        mode={mode}
        data={data}
        baseImage={baseImage}
        handleEditChange={handleEditChange}
        handleSubmitModal={handleSubmitModal}
        newCreator={newCreator}
        handleAddCreator={handleAddCreator}
        handleCreatorChange={handleCreatorChange}
        handleDeleteCreator={handleDeleteCreator}
        launchDate={launchDate}
        handleDateChange={handleDateChange}
      />
      {
        loading && <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', backgroundColor: 'transparent', opacity: '1', zIndex: '10000' }}>
        <div 
          style={{
            position: 'fixed',
            top: 'calc(50vh - 50px)',
            left: 'calc(50vw - 50px)'
          }}
        >
            <Loading type='puff' width={100} height={100} fill='#7367f0'/>
        </div>
      </div>
      }
    </Fragment>
  )
}

export default memo(Datatable)
