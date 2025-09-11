# 🔑 Hướng Dẫn Lấy Keys Để Deploy Smart Contract

## 1. 🦊 PRIVATE_KEY từ MetaMask

### Cách lấy Private Key từ MetaMask:

1. **Mở MetaMask Extension**
2. **Click vào Account menu** (3 chấm dọc)
3. **Chọn "Account details"**
4. **Click "Show private key"**
5. **Nhập password MetaMask**
6. **Copy private key** (64 ký tự hex bắt đầu bằng 0x)

### ⚠️ Lưu ý bảo mật:
- **KHÔNG bao giờ share private key** với ai
- **Chỉ dùng testnet wallet** cho development
- **Tạo wallet riêng** cho testing, không dùng wallet chính
- **Backup private key** ở nơi an toàn

### 💡 Tạo Testnet Wallet mới (Khuyến nghị):
```bash
# Có thể tạo wallet mới bằng MetaMask hoặc dùng Hardhat
npx hardhat console
> const wallet = ethers.Wallet.createRandom()
> console.log("Address:", wallet.address)
> console.log("Private Key:", wallet.privateKey)
```

---

## 2. 🌐 SEPOLIA_RPC_URL từ Infura

### Cách tạo Infura API:

1. **Truy cập**: https://infura.io/
2. **Sign up/Login** tài khoản
3. **Create New Project**
   - Project Name: `PenGx DeFi`
   - Product: `Web3 API (formerly Ethereum)`
4. **Vào Dashboard** → **Settings**
5. **Copy Endpoint URLs**:
   - Sepolia: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
   - Mainnet: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

### 🔄 Các RPC alternatives:

**Alchemy (Alternative):**
- Website: https://alchemy.com/
- Sepolia: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

**QuickNode (Alternative):**
- Website: https://quicknode.com/
- Có free tier với rate limits

**Public RPC (Free nhưng slow):**
- Sepolia: `https://rpc.sepolia.org`
- **Không khuyến nghị** cho production

---

## 3. 🔍 ETHERSCAN_API_KEY từ Etherscan

### Cách lấy Etherscan API Key:

1. **Truy cập**: https://etherscan.io/
2. **Sign up/Login** tài khoản
3. **Vào My Account** → **API Keys**
4. **Create New API Key**
   - App Name: `PenGx Token Verification`
5. **Copy API Key**

### 🌍 Multi-chain Etherscan APIs:

- **Ethereum Mainnet**: https://etherscan.io/
- **Sepolia Testnet**: https://sepolia.etherscan.io/
- **Polygon**: https://polygonscan.com/
- **Arbitrum**: https://arbiscan.io/

---

## 4. 🛠️ Setup .env File

### Tạo file .env:
```bash
# Copy file example
cp .env.example .env
```

### Nội dung .env:
```env
# 🔑 Wallet Configuration
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# 🌐 RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# 🔍 Etherscan APIs
ETHERSCAN_API_KEY=YourEtherscanApiKey
POLYGONSCAN_API_KEY=YourPolygonscanApiKey

# 💰 Gas Configuration (Optional)
GAS_PRICE=20000000000
GAS_LIMIT=3000000
```

### ⚠️ Bảo mật .env:
```bash
# Đảm bảo .env trong .gitignore
echo ".env" >> .gitignore

# Check gitignore
cat .gitignore | grep .env
```

---

## 5. 💰 Fund Testnet Wallet

### Lấy Sepolia ETH (Free):

**Sepolia Faucets:**
1. **Alchemy Faucet**: https://sepoliafaucet.com/
2. **Infura Faucet**: https://www.infura.io/faucet/sepolia
3. **Chainlink Faucet**: https://faucets.chain.link/sepolia

**Cách nhận:**
1. Copy địa chỉ wallet từ MetaMask
2. Paste vào faucet website
3. Request 0.1-1 ETH
4. Chờ transaction confirm

### Check Balance:
```bash
# Check balance bằng Hardhat
npx hardhat console --network sepolia
> const balance = await ethers.provider.getBalance("YOUR_WALLET_ADDRESS")
> console.log("Balance:", ethers.utils.formatEther(balance), "ETH")
```

---

## 6. ✅ Test Configuration

### Verify setup:
```bash
# Test connection
npx hardhat console --network sepolia

# Test compile
npx hardhat compile

# Test deploy (dry run)
npx hardhat run scripts/testnet-deploy.js --network sepolia
```

---

## 🚀 Quick Setup Commands

### All-in-one setup:
```bash
# 1. Install dependencies
npm install

# 2. Create .env từ template
cp .env.example .env

# 3. Edit .env với keys của bạn
notepad .env

# 4. Compile contracts
npx hardhat compile

# 5. Deploy lên Sepolia
npx hardhat run scripts/testnet-deploy.js --network sepolia
```

### 🔍 Troubleshooting:

**Lỗi "insufficient funds":**
- Check wallet có đủ ETH không
- Request thêm từ faucet

**Lỗi "invalid private key":**
- Đảm bảo private key có 64 ký tự hex
- Bắt đầu với 0x

**Lỗi "network not found":**
- Check RPC URL đúng không
- Test RPC bằng curl/browser

---

## 📱 Frontend Integration Sau Deploy

Sau khi deploy thành công:
```bash
# Contract addresses sẽ được log ra console
# Copy và update vào:
# - src/config/contracts.ts
# - Database
# - Frontend components
```

**🎯 Bước tiếp theo:** Sau khi có đủ keys → Deploy testnet → Verify contracts → Update frontend!
