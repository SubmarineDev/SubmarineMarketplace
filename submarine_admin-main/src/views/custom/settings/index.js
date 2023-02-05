// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import Datatable from './Datatable'
import Deposit from './Deposit'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          {/* <Deposit /> */}
          <Datatable />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
