// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import TableServerSide from './TableServerSide'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <TableServerSide />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
