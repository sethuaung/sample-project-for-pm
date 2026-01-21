# 💳 FE-Pay Mobile Banking

This project is a simple **Digital Wallet System** built with **HTML**, **CSS** and **JavaScript**.
It simulates basic financial operations like depositing money, withdrawing, transferring funds, applying bonuses, paying bills, and viewing transaction history.

---

## 🔗 Live Demo

🚀 [Click Here to Try Now](https://sandbox-felixent.vercel.app/)

---

## 💰 App Features

* **Add Money (Bank Deposit)**
  Deposit money into your wallet using a valid account number and PIN.

* **Cash Out (Withdraw)**
  Withdraw money to an agent number securely with PIN verification.

* **Transfer Money**
  Transfer money to another account number after PIN verification.

* **Bonus Coupons**
  Redeem predefined coupon codes (e.g., `BONUS100`, `WELCOME50`, `FREE10`) to get bonus money.

  * ✅ One-time usable codes
  * ✅ Updates balance instantly

* **Pay Bills**
  Pay bills such as **Electricity, Gas, Internet, or Water**.

  * Requires biller account number
  * Verifies balance & PIN before deduction

* **Transaction History**
  Every successful operation (deposit, withdrawal, transfer, bill, bonus) is logged in the **Transaction History** section.

* **UI Toggle System**

  * Simple form switching between different features (Add Money, Cash Out, Transfer, etc.)
  * Active button highlighting

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS (with Tailwind classes)
* **Logic:** Vanilla JavaScript
* **Icons:** Font Awesome

---

## 📂 Project Structure

```
/project-folder
│── index.html       # Login UI
│── script.js        # LogIn functionality
│── home.html        # Main UI
│── home.js          # All wallet functionality
│── /assets          # Images/icons (e.g., wallet.png)
│── Payoo-MFS.fig    # Figma design file
│── README.md        # Project documentation
```

---

## 🔑 Login Information

To access the wallet system, use the following credentials:

* **Account Number:** `12345678910`
* **PIN:** `1234`

---

## ⚙️ How It Works

1. **Initial Balance** → Starts with available balance shown on UI.
2. **User Actions** → Choose feature (Add Money, Cash Out, Transfer, Pay Bill, Bonus).
3. **Validation**

   * Account numbers must be **11+ digits**.
   * Amounts must be **greater than 0** (and not exceed available balance).
   * PIN must match the predefined `validPin` (Default `1234`).
4. **Transaction Updates**

   * Balance is updated dynamically.
   * Transaction log is updated in history.

---

## 🔰 Example Test Data

* **Valid PIN:** `1234`

* **Valid Coupons:**

  * `BONUS100` → +100
  * `WELCOME50` → +50
  * `FREE10` → +10

* **Sample Account Numbers:**

  * `12341234123`
  * `09876543210`

---

## 📸 Screenshots

**🚩 The app design is available in Figma File.**

👉 [Figma File](./FE-Pay-MFS.fig)

---

## 📌 Future Improvements

* Persistent storage with **localStorage** or **database**
* Authentication & multiple users
* Responsive design improvements
* Dark mode UI

---
