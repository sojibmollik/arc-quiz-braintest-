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

const questions = [ /* তোমার ২০টা প্রশ্ন এখানে আছে বলে ধরে নিলাম */ ];

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

window.selectAnswer = (i) => { userAnswers[currentQuestion] = i; renderQuestion(); };
window.nextQuestion = () => { if(currentQuestion < 19) { currentQuestion++; renderQuestion(); } };
window.prevQuestion = () => { if(currentQuestion > 0) { currentQuestion--; renderQuestion(); } };

// Submit + Save Score
window.submitQuiz = async () => {
  let score = 0;
  questions.forEach((q, i) => { if(userAnswers[i] === q.correct) score += 10; });

  document.getElementById('score-display').textContent = score;
  document.getElementById('score-message').innerHTML = score === 200 ? "🏆 Perfect Score!" : "🎉 Good Job!";
  document.getElementById('results-modal').classList.remove('hidden');

  if (connectedAccount) await saveScoreOnChain(score);
};

// ==================== ON-CHAIN FUNCTIONS ====================

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
  if (!connectedAccount) return alert("Wallet Connect করো আগে!");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function dailyCheckIn() public"], signer);
    const tx = await contract.dailyCheckIn();
    alert("⛓️ Transaction Sent! Confirm করো MetaMask এ");
    await tx.wait();
    alert("✅ Daily Check-in Successful!");
  } catch (err) {
    alert("Already checked in or Transaction Failed");
  }
}

async function saveScoreOnChain(score) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ["function saveScore(uint256 _score) public"], signer);
    
    const tx = await contract.saveScore(score);
    alert("⛓️ Transaction Sent! MetaMask এ Confirm করো...");
    await tx.wait();
    alert(`✅ Score ${score}/200 Saved on Arc Testnet!`);
  } catch (err) {
    console.error(err);
    alert("Score Save Failed - Check MetaMask");
  }
}

async function showLeaderboard() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `<div class="bg-slate-900 rounded-3xl p-8 text-center"><h2 class="text-3xl font-bold mb-6">🏆 Leaderboard</h2><p>Coming Soon...</p></div>`;
}

window.restartQuiz = () => location.reload();

renderQuestion();
