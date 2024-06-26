import { Timestamp } from 'firebase/firestore'
import Card from 'react-bootstrap/Card'

const Item = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.text}</Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>{props.user}</Card.Subtitle>
        <Card.Text className='justify-content-end'>
          <span className='text-muted small'>{Timestamp.fromMillis(props.time).toDate().toUTCString()}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Item
