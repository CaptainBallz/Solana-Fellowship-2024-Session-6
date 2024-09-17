import React from 'react'

const ProductsList = ({addToCart}) => {
    const products = [
        { id: 1, name: "Product A", price: 0.02 },
        { id: 2, name: "Product B", price: 0.03 },
        { id: 3, name: "Product C", price: 0.01 },
    ];
  return (
    <div className='products-div'>
    {products.map((product) => (
        <div className='product-card' key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price} SOL</p>
            <button className='add-to-cart-btn' onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
    ))}
</div>
  )
}

export default ProductsList
