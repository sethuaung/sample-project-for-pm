(function(){
  const now = new Date();
  function iso(offsetHours){ return new Date(now.getTime() - offsetHours*3600*1000).toISOString(); }
  function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  window.DEMO = {
    limits: { p2pPerTx: 1000000, p2pDaily: 5000000, p2mDaily: 10000000 },
    users: [
      { id: "u1", name: "Aye", nrc: "12/ABC(N)12345", kycLevel: "verified" },
      { id: "u2", name: "Min", nrc: null, kycLevel: "basic" },
      { id: "u3", name: "Hla", nrc: "13/XYZ(N)54321", kycLevel: "verified" },
      { id: "u4", name: "Zaw", nrc: "14/DEF(N)67890", kycLevel: "verified" }
    ],
    wallets: [
      { id: "w1", ownerId: "u1", provider: "Wave Money", balance: 1500000, type: "consumer" },
      { id: "w2", ownerId: "u2", provider: "TrueMoney", balance: 500000, type: "consumer" },
      { id: "w3", ownerId: "u3", provider: "KBZPay", balance: 800000, type: "consumer" },
      { id: "m1", ownerId: null, provider: "Merchant-A", balance: 25000000, type: "merchant" },
      { id: "m2", ownerId: null, provider: "Merchant-B", balance: 12000000, type: "merchant" }
    ],
    mmqrSamples: [
      { id: "mm1", merchantName: "Merchant-A", merchantCity: "Yangon", currency: "MMK", amount: 20000, payload: "000201...ABCD" },
      { id: "mm2", merchantName: "Merchant-B", merchantCity: "Mandalay", currency: "MMK", amount: 75000, payload: "000201...EFGH" }
    ],
    transactions: []
  };

  const types = ['p2p','p2m'];
  const statuses = ['settled','pending','failed'];
  const fromCandidates = ['w1','w2','w3'];
  const toCandidates = ['w1','w2','w3','m1','m2'];
  for(let i=1;i<=50;i++){
    const from = fromCandidates[rnd(0,fromCandidates.length-1)];
    let to = toCandidates[rnd(0,toCandidates.length-1)];
    if(to === from && Math.random() < 0.6) to = toCandidates[rnd(0,toCandidates.length-1)];
    const type = (to.startsWith('m') ? 'p2m' : (Math.random()<0.6 ? 'p2p' : 'p2m'));
    const amount = Math.round(Math.max(1000, Math.min(300000, Math.abs(rnd(1,300000)))));
    const hourOffset = rnd(0,72);
    const tx = {
      id: `t${String(i).padStart(3,'0')}`,
      from,
      to,
      type,
      amount,
      currency: "MMK",
      timestamp: iso(hourOffset),
      status: statuses[rnd(0,statuses.length-1)],
      mmqr: (to.startsWith('m') && Math.random()<0.8) ? (Math.random()<0.6 ? 'mm1' : 'mm2') : null
    };
    window.DEMO.transactions.push(tx);
  }

  window.DEMO.transactions.slice(0,10).forEach(tx=>{
    const fromW = window.DEMO.wallets.find(w=>w.id===tx.from);
    const toW = window.DEMO.wallets.find(w=>w.id===tx.to);
    if(tx.status === 'settled'){
      if(fromW) fromW.balance = Math.max(0, fromW.balance - tx.amount);
      if(toW) toW.balance = (toW.balance||0) + tx.amount;
    }
  });

  document.dispatchEvent(new Event("DEMO_LOADED"));
})();
