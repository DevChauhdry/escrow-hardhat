import { ethers } from 'ethers';
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

const provider = new ethers.providers.Web3Provider(window.ethereum.isConnected());
await window.ethereum.request({ method: 'eth_requestAccounts' });

export default async function addContract(
  id,
  contract,
  arbiter,
  beneficiary,
  value,
  hash
) {
  const buttonId = `approve-${id}`;

  const container = document.getElementById('container');
  container.innerHTML += createHTML(buttonId, arbiter, beneficiary, value, hash);

  contract.on('Approved', () => {
    document.getElementById(buttonId).className = 'complete';
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
  });

  document.getElementById(buttonId).addEventListener('click', async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).approve();
  });
}

function createHTML(buttonId, arbiter, beneficiary, value, hash) {
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${value} </div>
        </li>
        <li>
          <div> Hash </div>
          <div> ${hash} </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}
