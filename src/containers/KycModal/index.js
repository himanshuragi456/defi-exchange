import React from 'react'
import { Modal } from '../../components'
import { CloseIcon } from "../../assets/images/CloseIcon"
import {Alert} from "../../assets/images/Alert"
import { Link } from 'react-router-dom'

const KycModal = ({show, hide}) => {

    const modalHeader = () => {
        return (
            <div className='d-flex justify-content-end'>
                <div onClick={hide}><CloseIcon /></div>
            </div>
        )
    }

    const modalBody = () => {
         return (
            <>
                <div className='text-center'>
                  <div className='text-danger mx-auto mb-4' style={{width: "15%"}}><Alert /> </div>
                    <h1 className='mb-3 text-white'>Reminder</h1>
                    <p style={{fontSize: "18px"}}>
                        {/* Complete new identity verification before 2021-12-01 to win a NFT gift. 
                        if you do not pass verification by this date. your feature will be limited
                        to withdrawal only. */}
                        Please click here to complete the KYC
                    </p>
                </div>
            </>
        )
    }

    const modalFooter = () => {
        return (
            <div className='d-flex justify-content-center mb-5'>
              <Link to="/confirm" className='btn btn-primary mx-2 text-center'>Verify Now</Link>
            </div>
        )
    }

  return (
    <>
      <Modal 
        show={show}
        header={modalHeader()}
        content={modalBody()}
        footer={modalFooter()}
      />
    </>
  )
}

export default KycModal