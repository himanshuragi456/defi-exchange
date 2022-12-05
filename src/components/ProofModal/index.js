import Axios from 'axios'
import React, { useState } from 'react'
import { CloseIcon } from '../../assets/images/CloseIcon'
import { Modal } from '../Modal'
import {tradeUrl} from "../../api";

const ProofModal = ({show, hide, alert, currency}) => {

    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const submitProof = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log("FD",formData);
            const request = new FormData();

            request.append("upload", formData['upload'] || '');
            request.append("currency", currency);
            request.append("amount", formData['amount']);
            request.append("tid", formData['tid']);
            request.append("note", formData['note'] || '');
            await Axios.post(tradeUrl() + "/account/deposits/notify", request)
            alert({
                message: ["Proof of Payment Submitted"],
                type: "success",
            })
            setLoading(false);
            hide()
        } catch (e) {
            setLoading(false);
            alert({
                message: ["Proof of Payment Submission Failed"],
                type: "error",
            })
        }
    }


    const modalHeader = () => {
        return (
            <div className='d-flex justify-content-between'>
                <h2>Submit Proof of Payment</h2>
                <div onClick={hide}><CloseIcon /></div>
            </div>
        )
    }

    const onFileChange = event => {

        // Update the state
        setFormData({...formData, upload: event.target.files[0] });

    };


    const modalBody = () => {
        return (
            <form onSubmit={submitProof}>
                <div className='base-input form-control mb-3'>
                    <input className='w-100' type="number" placeholder='Amount *' name='amount' required onChange={handleChange} />
                </div>
                <div className='base-input form-control mb-3'>
                    <input className='w-100' type="text" placeholder='TID *' name='tid' required onChange={handleChange} />
                </div>
                <div className='base-input form-control mb-3'>
                    <input className='w-100' type="text" placeholder='Note (optional)' name='note' onChange={handleChange} />
                </div>
                <input required accept={'image/jpeg,image/jpg,image/png,application/pdf'} type="file" onChange={onFileChange} />
                <div className='text-center'>
                    <button disabled={loading} className='btn btn-primary'>Submit</button>
                </div>
            </form>
        )
    }
  return (
    <>
      <Modal
        show ={show}
        header={modalHeader()}
        content={modalBody()}
        footer={<></>}
      />
    </>
  )
}

export default ProofModal
