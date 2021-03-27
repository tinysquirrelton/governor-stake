import React from "react";
import { toast } from "react-toastify";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "e35323bc24d243c6a971cefcaaa55953", // required
    },
  },
};

export default class WalletConnect {
  constructor(onConnect, onResetConnect) {
    // Passed functions
    this.onConnect = onConnect;
    this.onResetConnect = onResetConnect;
    // Variables
    this.isConnected = false;
    this.account = "";
    this.web3 = null;
    this.provider = null;
    this.chainId = 1;
    this.networkId = 1;
    // Modal
    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions,
      disableInjectedProvider: false,
    });
  }

  connectWeb3Manual = async () => {
    await this.resetConnection();
    this.connectWeb3();
  };

  getWeb3 = () => {
    return this.web3;
  };

  initWeb3 = async (provider) => {
    const web3 = new Web3(provider);
    await web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    });
    return web3;
  };

  connectWeb3 = async () => {
    try {
      this.provider = await this.web3Modal.connect();
      await this.subscribeProvider(this.provider);
      this.web3 = await this.initWeb3(this.provider);
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      this.networkId = await this.web3.eth.net.getId();
      this.chainId = await this.web3.eth.chainId();
      this.isConnected = true;

      if (this.chainId === 1) {
        this.onConnect(this.web3);
      } else {
        this.account = null;
        toast.error("You need to be on the Ethereum Mainnet");
      }
    } catch (e) {
      console.log(e);
    }
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("disconnect", () => this.resetConnection());
    provider.on("accountsChanged", async (accounts) => {
      this.account = accounts[0];
      if (accounts[0] == null) {
        await this.resetConnection();
      }
    });
    provider.on("chainChanged", async (chainId) => {
      const networkId = await this.web3.eth.net.getId();
      this.chainId = chainId;
      this.networkId = networkId;
    });
    provider.on("networkChanged", async (networkId) => {
      const chainId = await this.web3.eth.chainId();
      this.chainId = chainId;
      this.networkId = networkId;
    });
  };

  resetConnection = async () => {
    if (
      this.web3 &&
      this.web3.currentProvider &&
      this.web3.currentProvider.close
    ) {
      await this.web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.isConnected = false;
    this.account = "";
    this.web3 = null;
    this.provider = null;
    this.chainId = 1;
    this.networkId = 1;
    await this.onResetConnect();
  };
}
