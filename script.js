const CONTRACT_ADDRESS = "0xfCA7019658BB591EDcd38cd1942052B8dEF9";

const ARC_TESTNET = {
  chainId: "0x4cef52",
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: ["https://rpc.testnet.arc.network"]
};

let connectedAccount = null;
let currentQuestion = 0;
let userAnswers = new Array(20).fill(null);

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

// ==================== CORE QUIZ FUNCTIONS ====================
function renderQuestion() {
  const q = questions[currentQuestion];
  let html = `<div class="bg-slate-900 rounded-3xl p-8">
    <div class="flex gap-4 mb-6">
      <div class="w-10 h-10 bg-cyan-500 text-black rounded-2xl flex items-center justify-center font-bold text-xl">${q.id}</div>
      <h2 class="text-2xl font-semibold">${q.question}</h2>
    </div>`;

  q.options.forEach((opt, i) => {
    const selected = userAnswers[currentQuestion] === i ? 'bg-cyan-400 text-black' : 'border-slate-700 hover:border-cyan-400';
    html += `<div onclick="selectAnswer(${i})" class="option ${selected} px-6 py-5 rounded-2xl text-lg mb-3 cursor-pointer border">${opt}</div>`;
  });
  html += `</div>`;
  document.getElementById('quiz-container').innerHTML = html;

  document.getElementById('submit-btn').classList.toggle('hidden', currentQuestion !== 19);
}

window.selectAnswer = (i) => {
  userAnswers[currentQuestion] = i;
  renderQuestion();
};

window.nextQuestion = () => {
  if (currentQuestion < 19) {
    currentQuestion++;
    renderQuestion();
  }
};

window.prevQuestion = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
};

window.submitQuiz = async () => {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) score += 10;
  });

  document.getElementById('score-display').textContent = score;
  document.getElementById('score-message').innerHTML = score === 200 ? "🏆 Perfect Score!" : "🎉 Good Job!";
  document.getElementById('results-modal').classList.remove('hidden');

  if (connectedAccount) await saveScoreOnChain(score);
};

// ==================== WALLET & ON-CHAIN ====================
async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask Install করো!");
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedAccount = accounts[0];
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ARC_TESTNET.chainId }] });
    document.getElementById('wallet-text').textContent = `${connectedAccount.slice(0,6)}...${connectedAccount.slice(-4)}`;
    alert("✅ Connected to Arc Testnet!");
  } catch (err) {
    alert("Wallet Connect Failed");
  }
}

async function dailyCheckIn() {
  if (!connectedAccount) return alert("Wallet Connect করো আগে!");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function dailyCheckIn() public"], signer);
    const tx = await contract.dailyCheckIn();
    await tx.wait();
    alert("✅ Daily Check-in Successful!");
  } catch (err) {
    alert("Already checked in today!");
  }
}

async function saveScoreOnChain(score) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function saveScore(uint256 _score) public"], signer);
    const tx = await contract.saveScore(score);
    await tx.wait();
    alert(`✅ Score ${score}/200 Saved on Blockchain!`);
  } catch (err) {
    console.error(err);
  }
}

async function showLeaderboard() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div class="bg-slate-900 rounded-3xl p-8">
      <h2 class="text-3xl font-bold text-center mb-8">🏆 Arc Quiz Leaderboard</h2>
      <div class="space-y-4">
        <div class="flex justify-between bg-slate-800 p-5 rounded-2xl">
          <span>1. 0x1234...abcd</span>
          <span class="text-cyan-400 font-bold">200/200</span>
        </div>
        <div class="flex justify-between bg-slate-800 p-5 rounded-2xl">
          <span>2. ${connectedAccount ? connectedAccount.slice(0,8)+'...' : 'Your Address'}</span>
          <span class="text-cyan-400 font-bold">Your Score</span>
        </div>
      </div>
    </div>`;
}

window.restartQuiz = () => location.reload();

// Start Quiz
renderQuestion();
