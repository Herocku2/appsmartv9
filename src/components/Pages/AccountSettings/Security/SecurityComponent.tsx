import { Card, Form } from 'react-bootstrap'

import { AcPassword } from './Components'

const SecurityComponent = () => {
  return (
    <>
      <Card className="mb-3 mb-md-4">
        <Card.Body>
            <AcPassword />
            <hr className="my-6 my-md-12" />
        
        </Card.Body>
      </Card>
    </>
  )
}

export default SecurityComponent
