# 💰 WALLET CẦN SEPOLIA ETH ĐỂ DEPLOY!

## 🔍 **Tình trạng hiện tại:**
- ✅ Smart contracts đã compile thành công
- ✅ Environment variables đã được config
- ✅ Deployer address: `0x8086CCcb97A2AD3421B27273cdD6dF35FD9AFFF6`
- ❌ **Balance: 0.0 ETH** - KHÔNG ĐỦ ĐỂ DEPLOY!

## 🚰 **Lấy Sepolia ETH (FREE):**

### 1. Alchemy Sepolia Faucet (Khuyến nghị):
🔗 **Link**: https://sepoliafaucet.com/
- Paste address: `0x8086CCcb97A2AD3421B27273cdD6dF35FD9AFFF6`
- Nhận: **0.5 ETH/ngày**
- ⏰ Thời gian: ~1-2 phút

### 2. Infura Faucet:
🔗 **Link**: https://www.infura.io/faucet/sepolia
- Cần đăng nhập Infura account
- Nhận: **0.5 ETH**

### 3. Chainlink Faucet:
🔗 **Link**: https://faucets.chain.link/sepolia
- Cần connect MetaMask
- Nhận: **0.1 ETH**

### 4. QuickNode Faucet:
🔗 **Link**: https://faucet.quicknode.com/ethereum/sepolia
- Nhận: **0.1 ETH**

## 🔄 **Sau khi nhận ETH:**

### Check Balance:
```bash
npx hardhat console --network sepolia
> const balance = await ethers.provider.getBalance("0x8086CCcb97A2AD3421B27273cdD6dF35FD9AFFF6")
> console.log("Balance:", ethers.formatEther(balance), "ETH")
```

### Deploy ngay:
```bash
npx hardhat run scripts/testnet-deploy.cjs --network sepolia
```

## 💸 **Chi phí ước tính:**

**Sepolia Testnet Deploy:**
- PenGx Token (Upgradeable): ~0.02 ETH
- Oracle Aggregator: ~0.015 ETH  
- Circuit Breaker: ~0.01 ETH
- Mock Oracles: ~0.005 ETH
- **Total**: ~0.05 ETH

**👍 Chỉ cần 0.1 ETH là đủ deploy tất cả!**

## 🎯 **Next Steps:**

1. **Vào 1 trong các faucet links trên**
2. **Paste address**: `0x8086CCcb97A2AD3421B27273cdD6dF35FD9AFFF6`
3. **Request ETH** (ít nhất 0.1 ETH)
4. **Chờ transaction confirm** (~1-2 phút)
5. **Run deploy command** sau khi có ETH

## 🚀 **Deploy Command (sẵn sàng):**
```bash
# Kiểm tra balance trước
npx hardhat console --network sepolia

# Deploy all contracts
npx hardhat run scripts/testnet-deploy.cjs --network sepolia
```

**Contracts đã sẵn sàng 100%, chỉ cần ETH để deploy!** 🎉
