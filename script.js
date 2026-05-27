
// ==================== Arc On-Chain Integration ====================
const CONTRACT_ADDRESS = "0xfCA7019658BB591EDcd38cd1942052B8dEF9";

const ARC_TESTNET = {
  chainId: "0x4cef52",
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: ["https://rpc.testnet.arc.network"],
  blockExplorerUrls: ["https://testnet.arcscan.app"]
};

let connectedAccount = null;

// Wallet Connect
async function connectWallet() {
  if (!window.ethereum) return alert("Please install MetaMask!");

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedAccount = accounts[0];

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARC_TESTNET.chainId }]
    });

    document.getElementById('wallet-text').textContent = `${connectedAccount.slice(0,6)}...${connectedAccount.slice(-4)}`;
    document.getElementById('connect-btn').classList.add('!bg-green-500');
    
    alert("✅ Connected to Arc Testnet!");
  } catch (err) {
    console.error(err);
    alert("Failed to connect wallet");
  }
}

// Daily Check-in
async function dailyCheckIn() {
  if (!connectedAccount) return alert("First connect your wallet!");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const abi = ["function dailyCheckIn() public"];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const tx = await contract.dailyCheckIn();
    await tx.wait();
    alert("✅ Daily Check-in Successful! 🎉");
  } catch (err) {
    alert("You have already checked in today or transaction failed.");
  }
}

// Save Score on Blockchain (Quiz Submit এ কল করা হবে)
async function saveScoreOnChain(score) {
  if (!connectedAccount) {
    alert("Score saved locally. Connect wallet to save on blockchain.");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const abi = ["function saveScore(uint256 _score) public"];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const tx = await contract.saveScore(score);
    alert("⛓️ Saving score on Arc Testnet...");
    await tx.wait();
    alert(`✅ Score ${score}/200 saved on blockchain!`);
  } catch (err) {
    console.error(err);
    alert("Failed to save score on chain.");
  }
}// ==================== Arc Quiz Script ====================

const questions = [
  { id: 1, question: "What is Arc primarily described as?", options: ["A) A DeFi protocol on Ethereum", "B) An Economic Operating System (OS) for the internet, built as a stablecoin-native L1 blockchain", "C) A centralized payment app", "D) A Layer-2 scaling solution"], correct: 1 },
  { id: 2, question: "When was Arc's public testnet launched?", options: ["A) August 2025", "B) October 28, 2025", "C) December 2025", "D) May 2026"], correct: 1 },
  { id: 3, question: "What unique feature does Arc use for gas fees?", options: ["A) Its native token only", "B) Programmable stablecoins like USDC as native gas", "C) ETH only", "D) No gas fees"], correct: 1 },
  { id: 4, question: "What is Arc's target block time and finality characteristic?", options: ["A) 12 seconds with probabilistic finality", "B) Deterministic sub-second finality (targeting ~500ms per block)", "C) 2-minute blocks", "D) Variable based on congestion"], correct: 1 },
  { id: 5, question: "Which of these is NOT a key design feature of Arc?", options: ["A) Opt-in configurable privacy", "B) EVM compatibility", "C) Native integration with Circle’s stack (USDC, CCTP, Gateway)", "D) Proof-of-Work consensus"], correct: 3 },
  { id: 6, question: "How many launch and design participants were involved at Arc public testnet launch?", options: ["A) Fewer than 20", "B) Over 100 companies across finance, fintech, and tech", "C) Only Circle affiliates", "D) Exactly 50"], correct: 1 },
  { id: 7, question: "Which major institutions have engaged with Arc testnet?", options: ["A) Only crypto-native projects", "B) BlackRock, Visa, HSBC, Goldman Sachs, AWS, etc.", "C) Solely retail users", "D) No institutional interest yet"], correct: 1 },
  { id: 8, question: "Arc is purpose-built for which real-world finance areas?", options: ["A) Only meme coins", "B) Onchain lending, FX, payments, capital markets, and tokenized assets", "C) Gaming NFTs only", "D) Social media tokens"], correct: 1 },
  { id: 9, question: "What role does Arc aim to play in the multichain ecosystem?", options: ["A) A isolated chain", "B) Global settlement hub that routes liquidity across chains using CCTP and Gateway", "C) Only a bridge", "D) A replacement for Ethereum"], correct: 1 },
  { id: 10, question: "Arc supports what kind of privacy model?", options: ["A) Fully anonymous only", "B) Opt-in configurable privacy for compliance-friendly transactions", "C) No privacy features", "D) Mandatory public transactions"], correct: 1 },
  { id: 11, question: "What is the Arc Builders Fund?", options: ["A) A charity program", "B) A Circle Ventures initiative funding early-stage projects building on Arc", "C) A testnet faucet", "D) A governance token sale"], correct: 1 },
  { id: 12, question: "Which hackathon featured Arc bounties with winning teams building on testnet?", options: ["A) ETHGlobal Buenos Aires (with winners like OneTX, Coco, ArcBeam)", "B) Devcon only", "C) No hackathons yet", "D) Solana Hacker House"], correct: 0 },
  { id: 13, question: "What is Arc House?", options: ["A) The official community hub/platform for Arc builders and discussions", "B) A physical office", "C) A trading platform", "D) A wallet app"], correct: 0 },
  { id: 14, question: "How is Arc evolving toward governance?", options: ["A) Remains fully centralized forever", "B) Toward a distributed, community-driven system with expanded validators and governance", "C) No plans for community involvement", "D) Immediate full DAO launch"], correct: 1 },
  { id: 15, question: "What testnet activities can community members participate in?", options: ["A) Only holding tokens", "B) Deploying smart contracts, bridging USDC, building dApps, and stress-testing", "C) Mining with GPUs", "D) Voting on mainnet upgrades immediately"], correct: 1 },
  { id: 16, question: "What is the current status of Arc as of mid-2026?", options: ["A) Mainnet live with real value", "B) Public testnet live with strong activity (mainnet expected 2026)", "C) Shut down", "D) Private only"], correct: 1 },
  { id: 17, question: "Circle has been exploring what for Arc?", options: ["A) Shutting it down", "B) A network token (ARC) and potential shift to broader Proof-of-Stake", "C) Making it permissioned only", "D) Removing stablecoin support"], correct: 1 },
  { id: 18, question: "What percentage of Arc's initial token supply is planned for network participants/builders?", options: ["A) 10%", "B) Around 60% to participants who build, use, and contribute", "C) 100% to Circle", "D) Only for VCs"], correct: 1 },
  { id: 19, question: "Which AI-related integration has been highlighted for Arc development?", options: ["A) No AI support", "B) Anthropic’s Claude Agent SDK and AI agent wallets", "C) Only basic chatbots", "D) Bitcoin integration"], correct: 1 },
  { id: 20, question: "What is the main goal of the Arc community?", options: ["A) Speculative trading only", "B) Building and testing the Economic OS — driving onchain real-world finance, innovation, and eventual decentralized governance", "C) Competing with Solana memes", "D) Central bank digital currency replacement"], correct: 1 }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

// Render Current Question
function renderQuestion() {
  const container = document.getElementById('quiz-container');
  const q = questions[currentQuestion];

  let html = `
    <div class="bg-slate-900 rounded-3xl p-8 question-card">
      <div class="flex gap-3 mb-6">
        <div class="w-8 h-8 bg-cyan-500 text-black font-bold rounded-2xl flex items-center justify-center flex-shrink-0">${q.id}</div>
        <h2 class="text-2xl font-semibold leading-tight">${q.question}</h2>
      </div>
      <div class="space-y-3" id="options-container">
  `;

  q.options.forEach((option, index) => {
    const isSelected = userAnswers[currentQuestion] === index;
    html += `
      <div onclick="selectAnswer(${index})" 
           class="option cursor-pointer border border-slate-700 hover:border-cyan-400 ${isSelected ? 'selected' : ''} px-6 py-5 rounded-2xl text-lg">
        ${option}
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;

  // Progress
  document.getElementById('current-q').textContent = q.id;
  document.getElementById('progress-bar').style.width = `${((currentQuestion + 1) / 20) * 100}%`;

  // Buttons
  document.getElementById('submit-btn').classList.toggle('hidden', currentQuestion !== 19);
  document.getElementById('next-btn').classList.toggle('hidden', currentQuestion === 19);
}

// Select Answer
window.selectAnswer = function(index) {
  userAnswers[currentQuestion] = index;
  renderQuestion();
};

// Next Question
window.nextQuestion = function() {
  if (currentQuestion < 19) {
    currentQuestion++;
    renderQuestion();
  }
};

// Previous Question
window.prevQuestion = function() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
};

// Submit Quiz
// Save score on blockchain
if (connectedAccount) {
  await saveScoreOnChain(score);   // 
}
window.submitQuiz = function() {
  let score = 0;
  let resultsHTML = '';
  // Save to blockchain
if (score > 0) {
  saveScoreOnChain(score);
}

  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const isCorrect = userAns === q.correct;
    if (isCorrect) score += 10;

    resultsHTML += `
      <div class="mb-6 p-6 rounded-2xl ${isCorrect ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}">
        <div class="flex justify-between items-start">
          <p class="font-medium pr-4">${q.id}. ${q.question}</p>
          <span class="font-mono text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}">
            ${isCorrect ? '✓' : '✕'}
          </span>
        </div>
        <div class="mt-4 text-sm">
          <p class="text-gray-400">Your answer: <span class="${isCorrect ? 'text-green-400' : 'text-red-400'}">${q.options[userAns] || 'Not answered'}</span></p>
          ${!isCorrect ? `<p class="text-cyan-400 mt-1">Correct answer: ${q.options[q.correct]}</p>` : ''}
        </div>
      </div>
    `;
  });

  document.getElementById('score-display').textContent = score;
  document.getElementById('score-message').innerHTML = 
    score === 200 ? "🏆 Perfect Score! You are an Arc Expert!" :
    score >= 150 ? "🎉 Excellent! You're ready to build on Arc." :
    "👍 Good effort! Keep learning about Arc.";

  document.getElementById('results-list').innerHTML = resultsHTML;
  document.getElementById('results-modal').classList.remove('hidden');
};

// Restart Quiz
window.restartQuiz = function() {
  currentQuestion = 0;
  userAnswers = new Array(questions.length).fill(null);
  document.getElementById('results-modal').classList.add('hidden');
  renderQuestion();
};

// Initialize
renderQuestion();
// ==================== LEADERBOARD FUNCTION ====================
async function showLeaderboard() {
  const container = document.getElementById('quiz-container');
  
  container.innerHTML = `
    <div class="bg-slate-900 rounded-3xl p-8 min-h-[500px]">
      <h2 class="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        🏆 Arc Quiz Leaderboard
      </h2>
      <div id="leaderboard-content" class="space-y-4">
        <p class="text-center text-gray-400">Loading leaderboard...</p>
      </div>
    </div>`;

  try {
    // Public RPC দিয়ে হাই স্কোর দেখানো হচ্ছে
    const provider = new ethers.JsonRpcProvider("https://rpc.testnet.arc.network");
    const abi = ["function highScores(address) view returns (uint256)"];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    // এখন কয়েকটা ঠিকানা দেখানো হবে (তোমারটা সহ)
    const sampleAddresses = [
      connectedAccount || "0xYourAddress...",
      "0x8aA4b5cD1234567890abcdef1234567890",
      "0x7bB9eF1234567890abcdef1234567890",
      "0x9cC8fG1234567890abcdef1234567890"
    ];

    let html = '';

    for (let i = 0; i < sampleAddresses.length; i++) {
      let score = "180"; // পরে রিয়েল স্কোর আসবে
      try {
        if (sampleAddresses[i] !== "0xYourAddress...") {
          const s = await contract.highScores(sampleAddresses[i]);
          score = s.toString();
        }
      } catch (e) {}

      html += `
        <div class="flex justify-between items-center bg-slate-800 px-6 py-4 rounded-2xl">
          <div class="flex items-center gap-4">
            <span class="font-bold text-xl">${i+1}</span>
            <span class="font-mono">${sampleAddresses[i].slice(0,8)}...${sampleAddresses[i].slice(-6)}</span>
          </div>
          <div class="text-right">
            <span class="text-cyan-400 font-bold text-2xl">${score}</span>
            <span class="text-gray-400 text-sm">/200</span>
          </div>
        </div>`;
    }

    document.getElementById('leaderboard-content').innerHTML = html;

  } catch (err) {
    console.error(err);
    document.getElementById('leaderboard-content').innerHTML = `<p class="text-red-400 text-center">Leaderboard 
    </p>`;
  }
}
// ==================== WALLET & ON-CHAIN FUNCTIONS ====================

async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask Install করো!");
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedAccount = accounts[0];
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ARC_TESTNET.chainId }] });
    
    document.getElementById('wallet-text').textContent = `${connectedAccount.slice(0,6)}...${connectedAccount.slice(-4)}`;
  } catch (err) {
    alert("Wallet Connect Failed");
  }
}

async function dailyCheckIn() {
  if (!connectedAccount) return alert("First connect your wallet!");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function dailyCheckIn() public"], signer);
    const tx = await contract.dailyCheckIn();
    await tx.wait();
    alert("✅ Daily Check-in Successful!");
  } catch (err) {
    alert("You already checked in today!");
  }
}

async function showLeaderboard() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div class="bg-slate-900 rounded-3xl p-8">
      <h2 class="text-3xl font-bold text-center mb-8">🏆 Arc Quiz Leaderboard</h2>
      <div class="space-y-4">
        <div class="bg-slate-800 p-5 rounded-2xl flex justify-between">
          <span>1. 0x1234...abcd</span>
          <span class="text-cyan-400 font-bold">200/200</span>
        </div>
        <div class="bg-slate-800 p-5 rounded-2xl flex justify-between">
          <span>2. ${connectedAccount ? connectedAccount.slice(0,8)+'...' : 'Your Wallet'}</span>
          <span class="text-cyan-400 font-bold">Your Score</span>
        </div>
      </div>
    </div>`;
}