import React from "react";

export default function Product(props) {
  const { product, onAdd } = props;

  return (
    <div className="card">
      <img className="small" src={product.image} alt={product.name} />
      <h3
        style={{
          padding: "5px",
          backgroundColor: "grey",
          marginBottom: "5px",
          borderRadius: "0.5rem",
          textAlign: "center",
        }}
      >
        {product.name}
      </h3>
      <div
        style={{
          padding: "5px",
          backgroundColor: "pink",
          marginBottom: "5px",
          borderRadius: "0.5rem",
          textAlign: "center",
        }}
      >
        {product.price} ETH
      </div>
      <div>
        <button onClick={() => onAdd(product)}>Add To Cart</button>
      </div>
    </div>
  );
}
