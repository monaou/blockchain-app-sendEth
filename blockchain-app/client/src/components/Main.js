import React from 'react'
import { useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext'

const Main = () => {
  const { connectWallet, sendTransaction, handleChange, inputFormData } = useContext(TransactionContext);
  const handleSubmit = () => {
    console.log(inputFormData.addressTo);

    if (inputFormData.addressTo === "" || inputFormData.addressTo === "") {
      return;
    } else {
      sendTransaction();
    }
  };
  return (
    <div className='mainContainer'>
      { }
      <div className='cryptContainer'>
        <h1 className='title'>crypto Card</h1>
        <button type="button">
          <p className="buttonText" onClick={connectWallet}>wallet connect</p>
        </button>
      </div>
      { }
      <div className='inputContainer'>
        <input type="text" placeholder='address' name='address' onChange={(e) => handleChange(e, "addressTo")} />
        <input type="number" placeholder='ETH' name='amount' step={0.0001} onChange={(e) => handleChange(e, "amount")} />
        <button type="button" onClick={handleSubmit}>
          <p className="buttonText">send</p>
        </button>
      </div>
    </div>
  )
}

export default Main