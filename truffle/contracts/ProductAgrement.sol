
// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract ProductAgrement{

    struct Product {
        uint id;
        string name;
        uint price;
        uint quantity;
        string date;
        address Buyer;
    }

    mapping (address => Product[]) public keepRecord;


    address payable public immutable _owner;

    address payable public  _buyer;


    Product[] public ProductList;

    uint totalAmount = 1 ether;
    uint public amount = 0;


    enum State {UnLocked ,Locked }
    State public _state;

    constructor() payable{
        _owner = payable(msg.sender);
    }


    function getAmount() external view returns(uint){
        return amount;
    }

    /// Funtion Cannot call at this time 
    error InvalidState();

    modifier checkState(State state)
    {
       
        if(state != _state){
            revert InvalidState();
        }
        _;
    }


     /// Only Valid Buyer Can Call This Function
    error OnlyBuyer();

    modifier onlyBuyer
    {
        
        if(msg.sender != _buyer && msg.sender != _owner){
            
            revert OnlyBuyer();
        }
        _;
    }

     /// Low Balance 
    error CheckBalance();

    modifier checkBalance
    { 
        if(msg.value < (amount * totalAmount)){
            revert CheckBalance();
        }
        _;
    }


    function addToCart(string memory name,uint id,uint price,uint quantity,string memory date) external checkState(State.UnLocked){
        amount += price ;
        ProductList.push(Product(id,name,price ,quantity,date,msg.sender));
        keepRecord[msg.sender].push(Product(id,name,price,quantity,date,msg.sender));
    }


    function confirmOrder() external checkState(State.UnLocked) payable{
        _buyer = payable(msg.sender);
        _state = State.Locked;
    }
    
    


    function payOwner() external  checkState(State.Locked) checkBalance onlyBuyer  payable{
       bool sent = _owner.send(msg.value);
       require(sent, "Failed to send Ether");
        amount = 0 ;
         _state = State.UnLocked;
    }

    function payBill() public checkState(State.Locked) onlyBuyer payable{
       require(msg.value < (amount*totalAmount),"Low Balance");
       bool sent = _owner.send(msg.value);
       require(sent, "Failed to send Ether");
    }
   
   function getProductHistory() public view returns(Product[] memory){
    return keepRecord[msg.sender];
   }
}