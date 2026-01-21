const validPin = 1234
const transactionData = []
// predefined coupon codes and amounts
const validCoupons = {
  "BONUS100": 100,
  "WELCOME50": 50,
  "FREE10": 10
};

// functions to get input values
function getInputValueNumber (id){
    const inputField = document.getElementById(id)
    const inputFieldValue = inputField.value
    const inputFieldValueNumber = parseInt(inputFieldValue)
    return inputFieldValueNumber
}

function getInputValue (id){
    const inputField = document.getElementById(id)
    const inputFieldValue = inputField.value
    return inputFieldValue
}

// function to get innertext
function getInnerText(id){
    const element = document.getElementById(id)
    const elementValue = element.innerText
    const elementValueNumber = parseInt(elementValue)

    return elementValueNumber
}

// function to set innerText
function setInnerText(value){
    console.log(value)
    const availableBalanceElement = document.getElementById("available-balance")
    availableBalanceElement.innerText = value
}

//function to toggle
function handleToggle(id) {
    const forms = document.getElementsByClassName("form")
    for(const form of forms){
        form.style.display = "none"
    }
    document.getElementById(id).style.display = "block"
}

//function to toggle buttons
function handleButtonToggle(id){
    const formBtns = document.getElementsByClassName("form-btn")
    
    for(const btn of formBtns){
        btn.classList.remove("border-[#0874f2]","bg-[#0874f20d]")
        btn.classList.add("border-gray-300")
    }

document.getElementById(id).classList.remove("border-gray-300")
    document.getElementById(id).classList.add("border-[#0874f2]","bg-[#0874f20d]")
}


// Add Money Feature
document.getElementById("add-money-btn").addEventListener("click",function(e){
    e.preventDefault()
    const bank = getInputValue("bank");
    const accountNumber = document.getElementById("account-number").value

    const amount = getInputValueNumber("add-amount")
    
    if(amount<=0){
        alert("invalid amount")
        return;
    }

    const pinNumber = getInputValueNumber("add-pin")


    const availableBalance = getInnerText("available-balance")


    if(accountNumber.length<11){
        alert("Invalid account Number");
        return;
    }

    if(pinNumber !== validPin){
        alert("Invalid pin Number")
        return;
    }

    const totalNewAvailableBalance = amount+availableBalance

 
    setInnerText(totalNewAvailableBalance)

    const data = {
        name:"Bank Deposit",
        date:new Date().toLocaleTimeString()
    }

    transactionData.push(data)
    console.log(transactionData)
})


//Cashout Money Feature
document.getElementById("withdraw-btn").addEventListener("click",function(e){
    e.preventDefault()

    const accountNumber = document.getElementById("agent-number").value

    const pinNumber = getInputValueNumber("cashout-pin")
    
    const amount = getInputValueNumber("withdraw-amount")

    const availableBalance =getInnerText("available-balance")

    if(amount<=0 || amount>availableBalance){
        alert("invalid amount")
        return
    }

    if(accountNumber.length < 11){
        alert("Invalid account Number");
        return;
    }

    if(pinNumber !== validPin){
        alert("Invalid pin Number")
        return;
    }

    const totalNewAvailableBalance = availableBalance - amount

    console.log(totalNewAvailableBalance)

    setInnerText(totalNewAvailableBalance)
    
    const data = {
        name:"Cash Out",
        date:new Date().toLocaleTimeString()
    }

    transactionData.push(data)
    console.log(transactionData)
})

//Transfer Money Feature

document.getElementById("transfer-btn").addEventListener("click",function(e){
    e.preventDefault()

    const accountNumber = document.getElementById("transfer-number").value

    const pinNumber = getInputValueNumber("transfer-pin")
    
    const amount = getInputValueNumber("transfer-amount")

    const availableBalance =getInnerText("available-balance")

    if(amount<=0 || amount>availableBalance){
        alert("invalid amount")
        return
    }

    if(accountNumber.length < 11){
        alert("Invalid account Number");
        return;
    }

    if(pinNumber !== validPin){
        alert("Invalid pin Number")
        return;
    }

    const totalNewAvailableBalance = availableBalance - amount

    console.log(totalNewAvailableBalance)

    setInnerText(totalNewAvailableBalance)
    
    const data = {
        name:"Money Transfer",
        date:new Date().toLocaleTimeString()
    }

    transactionData.push(data)
    console.log(transactionData)
})

//Bonus Money Feature
document.getElementById("get-bonus-btn").addEventListener("click", function(e) {
  e.preventDefault();

  const couponCode = getInputValue("bonus-coupon").trim();
  const availableBalance = getInnerText("available-balance");

  const message = document.getElementById("bonus-message");

  if (validCoupons[couponCode]) {
    const bonusAmount = validCoupons[couponCode];
    const totalNewAvailableBalance = availableBalance + bonusAmount;

    // update balance
    setInnerText(totalNewAvailableBalance);

    // show success message
    message.style.color = "green";
    message.innerText = `Success! $${bonusAmount} added.`;

    // add to transaction history
    const data = {
      name: "Bonus Added",
      date: new Date().toLocaleTimeString()
    };

    transactionData.push(data);
    console.log(transactionData);

    // make coupon one-time usable
    delete validCoupons[couponCode];
  } else {
    message.style.color = "red";
    message.innerText = "Invalid or already used coupon!";
  }

  // clear input
  document.getElementById("bonus-coupon").value = "";
});

// Pay Bill Money Feature
document.getElementById("pay-bill-btn").addEventListener("click", function(e) {
    e.preventDefault();

    const billType = document.getElementById("bill").value; // ✅ get selected bill type
    const accountNumber = document.getElementById("biller-number").value;
    const pinNumber = getInputValueNumber("bill-pin");
    const amount = getInputValueNumber("bill-amount");
    const availableBalance = getInnerText("available-balance");

    if (amount <= 0 || amount > availableBalance) {
        alert("invalid amount");
        return;
    }

    if (accountNumber.length < 11) {
        alert("Invalid account Number");
        return;
    }

    if (pinNumber !== validPin) {
        alert("Invalid pin Number");
        return;
    }

    const totalNewAvailableBalance = availableBalance - amount;

    setInnerText(totalNewAvailableBalance);

    const data = {
        name: billType, // ✅ will now show “Electricity Bill”, “Gas Bill”, etc.
        date: new Date().toLocaleTimeString()
    };

    transactionData.push(data);
    console.log(transactionData);
});


//Transiction Feature
document.getElementById("transactions-button").addEventListener("click",function(){
    const transactionContainer = document.getElementById("transaction-container")
    transactionContainer.innerText = ""

    for(const data of transactionData){
        const div = document.createElement("div")
        div.innerHTML=`
        <div class=" bg-white rounded-xl p-3 flex justify-between items-center mt-3">
              <div class="flex items-center">
                  <div class="p-3 rounded-full bg-[#f4f5f7]">
                    <img src="./assets/wallet1.png" class="mx-auto" alt="" />
                  </div>
                  <div class="ml-3">
                    <h1>${data.name}</h1>
                    <p>${data.date}</p>
                  </div>
              </div>
      
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
        `

        transactionContainer.appendChild(div)
    }
})


// toggling feature

document.getElementById("add-button").addEventListener("click",function(e){
    handleToggle("add-money-parent")

    handleButtonToggle("add-button")

})
document.getElementById("cash-out-button").addEventListener("click",function(){
    handleToggle("cash-out-parent")
    handleButtonToggle("cash-out-button")
 
})

document.getElementById("transfer-button").addEventListener("click",function(){

    handleToggle("transfer-money-parent")
    handleButtonToggle("transfer-button")
})
document.getElementById("bonus-button").addEventListener("click",function(){
    handleToggle("get-bonus-parent")
    handleButtonToggle("bonus-button")
})
document.getElementById("bill-button").addEventListener("click",function(){
    handleToggle("pay-bill-parent")
    handleButtonToggle("bill-button")
})
document.getElementById("transactions-button").addEventListener("click",function(){
    handleToggle("transactions-parent")
    handleButtonToggle("transactions-button")
})
