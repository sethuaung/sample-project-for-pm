// public/data.js — seeded demo state (20 transactions)
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
  transactions: [
    { id: "t001", from: "w1", to: "w2", type: "p2p", amount: 20000, currency: "MMK", timestamp: "2025-10-08T23:20:00.000Z", status: "settled", mmqr: null },
    { id: "t002", from: "w2", to: "m1", type: "p2m", amount: 150000, currency: "MMK", timestamp: "2025-10-09T00:10:00.000Z", status: "pending", mmqr: "mm1" },
    { id: "t003", from: "w3", to: "w1", type: "p2p", amount: 50000, currency: "MMK", timestamp: "2025-10-09T01:05:00.000Z", status: "settled", mmqr: null },
    { id: "t004", from: "w1", to: "m2", type: "p2m", amount: 75000, currency: "MMK", timestamp: "2025-10-09T02:30:00.000Z", status: "settled", mmqr: "mm2" },
    { id: "t005", from: "w2", to: "w3", type: "p2p", amount: 30000, currency: "MMK", timestamp: "2025-10-09T03:15:00.000Z", status: "failed", mmqr: null },
    { id: "t006", from: "w3", to: "m1", type: "p2m", amount: 120000, currency: "MMK", timestamp: "2025-10-09T04:40:00.000Z", status: "pending", mmqr: "mm1" },
    { id: "t007", from: "w1", to: "w3", type: "p2p", amount: 45000, currency: "MMK", timestamp: "2025-10-09T05:05:00.000Z", status: "settled", mmqr: null },
    { id: "t008", from: "w2", to: "m2", type: "p2m", amount: 90000, currency: "MMK", timestamp: "2025-10-09T05:50:00.000Z", status: "settled", mmqr: "mm2" },
    { id: "t009", from: "w3", to: "w2", type: "p2p", amount: 10000, currency: "MMK", timestamp: "2025-10-09T06:20:00.000Z", status: "pending", mmqr: null },
    { id: "t010", from: "w1", to: "m1", type: "p2m", amount: 250000, currency: "MMK", timestamp: "2025-10-09T07:00:00.000Z", status: "pending", mmqr: "mm1" },
    { id: "t011", from: "w2", to: "w1", type: "p2p", amount: 7500, currency: "MMK", timestamp: "2025-10-09T07:25:00.000Z", status: "settled", mmqr: null },
    { id: "t012", from: "w3", to: "m2", type: "p2m", amount: 50000, currency: "MMK", timestamp: "2025-10-09T08:10:00.000Z", status: "failed", mmqr: "mm2" },
    { id: "t013", from: "w1", to: "w2", type: "p2p", amount: 125000, currency: "MMK", timestamp: "2025-10-09T08:45:00.000Z", status: "pending", mmqr: null },
    { id: "t014", from: "w2", to: "m1", type: "p2m", amount: 60000, currency: "MMK", timestamp: "2025-10-09T09:30:00.000Z", status: "settled", mmqr: "mm1" },
    { id: "t015", from: "w3", to: "w1", type: "p2p", amount: 200000, currency: "MMK", timestamp: "2025-10-09T10:05:00.000Z", status: "pending", mmqr: null },
    { id: "t016", from: "w1", to: "m2", type: "p2m", amount: 85000, currency: "MMK", timestamp: "2025-10-09T10:50:00.000Z", status: "settled", mmqr: "mm2" },
    { id: "t017", from: "w2", to: "w3", type: "p2p", amount: 40000, currency: "MMK", timestamp: "2025-10-09T11:20:00.000Z", status: "settled", mmqr: null },
    { id: "t018", from: "w3", to: "m1", type: "p2m", amount: 175000, currency: "MMK", timestamp: "2025-10-09T11:55:00.000Z", status: "pending", mmqr: "mm1" },
    { id: "t019", from: "w1", to: "w2", type: "p2p", amount: 95000, currency: "MMK", timestamp: "2025-10-09T12:30:00.000Z", status: "failed", mmqr: null },
    { id: "t020", from: "w2", to: "m2", type: "p2m", amount: 300000, currency: "MMK", timestamp: "2025-10-09T13:05:00.000Z", status: "pending", mmqr: "mm2" }
  ]
};
document.dispatchEvent(new Event("DEMO_LOADED"));
