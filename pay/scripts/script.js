//Login Button Functionality
document.getElementById("LoginButton").addEventListener("click",function(e){
    e.preventDefault()
    const mobilenumber = 12345678910
    const pinNumber = 1234
    const mobileNumberValue = document.getElementById("mobile-number").value
    const mobileNumberValueConverted = parseInt (mobileNumberValue)

    const pinNumberValue = document.getElementById("pin-number").value
    const pinNumberValueConverted = parseInt (pinNumberValue)
    // console.log(mobileNumberValueConverted,pinNumberValueConverted)
    // Condition for Login
    if(mobileNumberValueConverted === mobilenumber && pinNumberValueConverted === pinNumber){
        window.location.href="./home.html"
    } else{
        alert("Invalid credential")
    }
})