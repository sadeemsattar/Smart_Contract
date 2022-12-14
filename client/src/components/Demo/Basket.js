import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import web3 from "web3";
import "./table.css";
export default function Basket(props) {
  const {
    state: { contract, accounts },
  } = useEth();
  const { cartItems, setCartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const [btnCheck, setbtnCheck] = useState(false);
  let totalPrice = itemsPrice;
  const [history, setHistory] = useState([]);

  const addToCart = async (e) => {
    console.log(cartItems.length);

    for (let i = 0; i < cartItems.length; i++) {
      let date = new Date();
      let updateDate = date.toLocaleString();
      console.log(contract);
      await contract.methods
        .addToCart(
          cartItems[i].name,
          cartItems[i].id,
          cartItems[i].price * cartItems[i].qty,
          cartItems[i].qty,
          updateDate
        )
        .send({
          from: accounts[0],
        });
    }
  };

  const confirmOrder = async (e) => {
    setbtnCheck(true);
    await contract.methods.confirmOrder().send({
      from: accounts[0],
    });
  };

  const payBil = async (e) => {
    const result = await contract.methods.payOwner().send({
      from: accounts[0],
      value: web3.utils.toWei(`${totalPrice}`, "ether"),
      gas: "3000000",
    });
    console.log("Result", result);
    setbtnCheck(false);
    setCartItems([]);
    totalPrice = 0;
    console.log(cartItems);
  };

  const getHistory = async () => {
    const result = await contract.methods.getProductHistory().call({
      from: accounts[0],
      value: web3.utils.toWei(`${totalPrice}`, "ether"),
      gas: "3000000",
    });
    console.log("Product History", result);
    setHistory(result);
  };
  return (
    <aside className="block col-1">
      <h2>Cart Items</h2>
      <div>
        {cartItems.length === 0 && <div>Cart is empty</div>}
        {cartItems.map((item) => (
          <div key={item.id} className="row">
            <div className="col-2">{item.name}</div>
            <div className="col-2">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{" "}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>

            <div className="col-2 text-right">
              {item.qty} x ${item.price.toFixed(2)}
            </div>
          </div>
        ))}

        {cartItems.length !== 0 && (
          <>
            <hr></hr>
            <div className="row">
              <div className="col-2">Items Price</div>
              <div className="col-1 text-right">${itemsPrice.toFixed(2)}</div>
            </div>

            <div className="row">
              <div className="col-2">
                <strong>Total Price</strong>
              </div>
              <div className="col-1 text-right">
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
            </div>
            <hr />
            <div className="row">
              <button disabled={btnCheck} onClick={addToCart}>
                Add To Contract
              </button>
            </div>
            <div className="row">
              <button onClick={confirmOrder}>Confirmed Order</button>
            </div>
            <div className="row">
              <button onClick={payBil}>Pay Owner</button>
            </div>
          </>
        )}
      </div>
      <div>
        <button onClick={getHistory}> Check History</button>
        {history.length > 0 ? (
          <table border="1" className="customers">
            <thead>
              <td>Product ID</td>
              <td>Name</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Time / Date</td>
              {/* <td>Buyer ID</td> */}
            </thead>
            {history.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.date}</td>
                {/* <td>{item.Buyer}</td> */}
              </tr>
            ))}
          </table>
        ) : (
          ""
        )}
      </div>
    </aside>
  );
}
