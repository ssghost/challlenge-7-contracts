import { ProxyAgent, setGlobalDispatcher } from "undici";

const PROXY_URL = "http://127.0.0.1:9910";

try {
  const proxyAgent = new ProxyAgent(PROXY_URL);
  setGlobalDispatcher(proxyAgent);
  console.log("✅ Hardhat is routing all network traffic through proxy: " + PROXY_URL);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ Failed to set up proxy dispatcher: " + errorMessage);
}

import * as dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";

const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "sepolia",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/" + providerApiKey,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: "https://arb-mainnet.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: "https://opt-mainnet.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: "https://opt-sepolia.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: "https://polygonzkevm-mainnet.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmCardona: {
      url: "https://polygonzkevm-cardona.g.alchemy.com/v2/" + providerApiKey,
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [deployerPrivateKey],
    },
    celoAlfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [deployerPrivateKey],
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
    ],
  },
  verify: {
    etherscan: {
      apiKey: etherscanApiKey,
    },
  },
  sourcify: {
    enabled: false,
  },
};

task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});

export default config;
