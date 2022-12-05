import React from 'react'
import { Modal } from '../../components'
// import { CloseIcon } from "../../assets/images/CloseIcon"
import avatar from "../NavBar/open-avatar.svg"
import { Link } from 'react-router-dom'

const LoginModal = ({show, hide}) => {

    const modalHeader = () => {
        return (
            <div className='d-flex justify-content-start'>
                {/* <div onClick={hide}><CloseIcon /></div> */}
            </div>
        )
    }

    const modalBody = () => {
         return (
            <>
                <div className='text-center'>
                  <div className='text-danger mx-auto mb-4'>
                    <img style={{width: "80px", height: "80px"}} src={avatar} alt="avatar" />
                  </div>
                    {/* <h1 className='mb-3 text-white'>Reminder</h1> */}
                    <p style={{fontSize: "16px", fontWeight: "normal"}}>
                        You have not logged into your Wenbit account yet. 
                        Please log in first to continue using Convert Trading 
                        Service
                    </p>
                </div>
            </>
        )
    }

    const modalFooter = () => {
        return (
            <div className='d-flex justify-content-center flex-wrap flex-column-reverse flex-md-row mb-5 mt-3'>
                <button onClick={hide} className='btn m-2 text-center'>Cancel</button>
                <Link to="/signin" className='btn btn-wenbit m-2 text-center'>Log In</Link>
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

export default LoginModal