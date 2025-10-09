// public/admin.js — simple client-side admin actions (no secrets, static)
const $ = s => document.querySelector(s);

document.addEventListener("DOMContentLoaded", ()=> {
  $("#signBtn").addEventListener("click", applySignedWebhook);
  $("#listBtn").addEventListener("click", listPending);
});

function findTx(id){ return (window.DEMO.transactions||[]).find(t=>t.id===id); }

function applySignedWebhook(){
  const txId = $("#adminTxId").value.trim();
  const event = $("#adminEvent").value;
  if(!txId) return alert("Enter tx id");
  const tx = findTx(txId);
  if(!tx) return alert("Transaction not found");
  if(event === "payment_captured"){
    tx.status = "settled";
    const from = window.DEMO.wallets.find(w=>w.id===tx.from);
    const to = tx.to ? window.DEMO.wallets.find(w=>w.id===tx.to) : null;
    if(from) from.balance = Math.max(0, from.balance - tx.amount);
    if(to) to.balance = (to.balance || 0) + tx.amount;
  } else if(event === "payment_declined"){
    tx.status = "failed";
  }
  document.getElementById("adminOut").textContent = JSON.stringify(tx, null, 2);
  alert(`Applied ${event} to ${txId}`);
}

function listPending(){
  const pending = (window.DEMO.transactions||[]).filter(t=>t.status==="pending");
  document.getElementById("adminOut").textContent = JSON.stringify(pending, null, 2);
}
