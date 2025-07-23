import React from 'react'

import { Link, useParams } from 'react-router-dom'
const PaymentSuccess = ({user}) => {
    const params =useParams()

  return (
    <div className='payment-success-page'>
        {user && 
        <div className='success-message'>
            <h2>
                Payment Successfull
            </h2>
            <p>Your Course Subscription has been Activated</p>
            <p>Reference no - {params.id}</p>
            <Link to={`/${user._id}/dashboard`} className='common-btn'>Go to Dashboard</Link>
        </div>
        }
    </div>
  )
}

export default PaymentSuccess