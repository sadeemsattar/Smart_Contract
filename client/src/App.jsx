import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Demo/Header";
import Main from "./components/Demo/Main";
import Basket from "./components/Demo/Basket";
import data from "./data";

import { useState } from "react";
function App() {
  const { products } = data;
  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };
  return (
    <EthProvider>
      <div className="App">
        <Header countCartItems={cartItems.length}></Header>
        <div className="row">
          <Main products={products} onAdd={onAdd}></Main>
          <Basket
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
          ></Basket>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
