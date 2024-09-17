import './App.css';
import { useEffect, useState } from 'react';
import ProductsList from './Components/ProductsList';
import Cart from './Components/Cart';

function App() {
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const addToCart = (item)=>{
    setCartItems([...cartItems, item])
    setTotalAmount(totalAmount + item.price)
  }
  const removeFromCart = (item)=>{
    setCartItems(cartItems.filter(cItem => cItem != item))
    setTotalAmount(totalAmount - item.price)
  }
  useEffect(()=>{
    console.log("Cart items => ", cartItems)
  },[cartItems])
  return (
    <div className="App">
      <header className="App-header">
      <h1 className='purple-text'>Welcome to Solana Pay</h1>
      <p className='purple-text'>Add products to cart and click Checkout</p>
        <ProductsList addToCart={addToCart} />
    <Cart cart={cartItems} totalAmount={totalAmount} removeFromCart={removeFromCart}/>

      </header>
    </div>
  );
}

export default App;
