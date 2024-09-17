import React, { useEffect } from 'react'
import { encodeURL } from '@solana/pay';
import { useState } from 'react';
import {QRCodeCanvas}  from 'qrcode.react';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { notification} from 'antd';


const Cart = ({ cart, totalAmount, removeFromCart}) => {
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [reference, setReference] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, msg="", desc="") => {
        api[type]({
          message: msg,
          description:
            desc,
        });
      };
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // const monitorTransaction = (reference) => {
    //     console.error('monitoring');
    //     // Use 'onSignature' to listen for real-time confirmation of the transaction
    //     connection.onSignature(
    //       reference.toString(),
    //       (result, context) => {
    //         if (result.err) {
    //           console.error('Transaction failed:', result.err);
    //           setPaymentStatus('Transaction failed');
    //         } else {
    //           console.log('Transaction confirmed:', reference.toString());
    //           setPaymentStatus('Transaction confirmed');  // Update payment status to 'confirmed'
    //         }
    //       },
    //       'confirmed' // Track when the transaction is confirmed on the network
    //     );
    //   };

    const handleCheckout = async () => {
        const recipientAddress = 'CZUCegptcxeDwNXSYwbEyXKzXuUuzhaDZb5rngv8LZrJ';
        let recipient;

        try {
          recipient = new PublicKey(recipientAddress); 
        } catch (error) {
          console.error("Invalid recipient address:", error);
          return;
        }
        const amount = new BigNumber(totalAmount);  
        const newReference = Keypair.generate().publicKey;  // Generate random reference key for the transaction
        setReference(newReference)
        try {
            // Generate Solana Pay payment URL without reference
            const url = encodeURL({ recipient, amount, newReference });
            console.log(url.toString());
            setPaymentUrl(url.toString());

          } catch (error) {
            console.error("Failed to generate payment URL:", error);
          }

    };


    useEffect(() => {
        if (!reference) return;
    
        const interval = setInterval(async () => {
          try {
            // Get transaction signatures for the reference address
            console.log("Checking Transaction");
            const signatures = await connection.getSignaturesForAddress(reference);
    
            if (signatures.length > 0) {
              const transactionSignature = signatures[0].signature; // Get the first transaction signature
    
              console.log('Transaction detected:', transactionSignature);
    
              // Confirm the transaction and update payment status
              const result = await connection.confirmTransaction(transactionSignature, 'confirmed');
    
              if (result.value.err) {
                setPaymentStatus('Transaction failed');
                openNotificationWithIcon("error","Transaction failed")
            } else {
                setPaymentStatus('Transaction confirmed');
                openNotificationWithIcon("success","Transaction confirmed")
              }
    
              // Clear the interval once the transaction is confirmed
              clearInterval(interval);
            }
          } catch (error) {
            console.error('Error fetching signatures:', error);
          }
        }, 5000); // Poll every 5 seconds
    
        return () => clearInterval(interval); // Clean up the interval when the component is unmounted
      }, [reference]);
    // async function monitorTransaction(reference) {
    //     const connection = new Connection('https://api.mainnet-beta.solana.com');
    //     const signatureInfo = await connection.confirmTransaction(signature);
        
    //     if (signatureInfo.value.err == null) {
    //         setPaymentConfirmed(true);  // Update UI for payment confirmation
    //     }
    // }
  return (
    <div>
            <h2 className='purple-text'>Cart</h2>
            <ul>
                {cart.map((item) => (
                    <li className='purple-text' key={item.id}>{item.name} - {item.price} SOL <img onClick={()=>removeFromCart(item)} className='remove-from-cart-btn' src='../assets/images/trash-icon.png' /></li>
                ))}
            </ul>
            <p>Total: {totalAmount} SOL</p>
            <button className='checkout-btn' onClick={handleCheckout}>Checkout</button>

            {paymentUrl && (
                <div>
                    <h4>Scan to Pay:</h4>
                    <QRCodeCanvas value={paymentUrl} style={{width:250, height: 250, border: "2px solid white", padding:5}}/>
                </div>
            )}

            {paymentConfirmed && <p>Payment Confirmed!</p>}
        </div>
  )
}

export default Cart
