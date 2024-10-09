import { Card } from 'react-bootstrap'
import { AccountAvatarCover, AccountInformation } from './Components.tsx'

const AccountComponent = () => {
  return (
    <>
      <Card>
        <Card.Body>
          <AccountAvatarCover />
          <hr className="my-6 my-md-12" />
          <AccountInformation />
          <hr className="my-6 my-md-12" />
        </Card.Body>
      </Card>
    </>
  )
}

export default AccountComponent
