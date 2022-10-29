import {
  IonPage,
  IonRow,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonLabel,
} from '@ionic/react';

import { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';

import { Web3Auth } from '@web3auth-mpc/web3auth';
import { OpenloginAdapter } from '@web3auth-mpc/openlogin-adapter';
import { SafeEventEmitterProvider } from '@web3auth-mpc/base';
import { tssDataCallback, tssGetPublic, tssSign, generatePrecompute } from 'torus-mpc';
import RPC from '../../api/web3RPCMpc';

const clientId =
  'BPbSJiBSPcXLB6OQ2UlNZfInvu972sAHLoqJnBkikrI5VdLhhYsO3EAp1Eu8t8iu8ofHHw0969UAQuoiv_AOuZ8'; // get from https://dashboard.web3auth.io

function Web3AuthMpc() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: clientId,
          // Additional uiConfig for Whitelabeling can be passed here
          uiConfig: {
            appLogo: 'https://images.web3auth.io/web3auth-logo-w.svg',
            theme: 'light',
            loginMethodsOrder: ['twitter', 'google'],
          },
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0x504', // hex of 1284, moonbeam mainnet
            rpcTarget: 'https://rpc.ankr.com/moonbeam',
            // Avoid using public rpcTarget in production.
            // Use services like Infura, Quicknode etc
            displayName: 'Moonbeam Mainnet',
            blockExplorer: 'https://moonbeam.moonscan.io',
            ticker: 'GLMR',
            tickerName: 'GLMR',
          },
          enableLogging: true,
        });

        const openloginAdapter = new OpenloginAdapter({
          // Multi Factor Authentication has to be mandatory
          loginSettings: {
            mfaLevel: 'mandatory',
          },
          // TSS Settings needed for TSS implementation
          tssSettings: {
            useTSS: true,
            tssGetPublic,
            tssSign,
            tssDataCallback,
          },
          adapterSettings: {
            // points to the beta mpc network containing TSS implementation
            _iframeUrl: 'https://mpc-beta.openlogin.com',
            // network has to be development
            network: 'development',
            clientId: clientId,
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        // config to remove the external wallet adapters
        await web3auth.initModal({
          modalConfig: {
            'torus-evm': {
              label: 'Torus Wallet',
              showOnModal: false,
            },
            metamask: {
              label: 'Metamask',
              showOnModal: false,
            },
            'wallet-connect-v1': {
              label: 'Wallet Connect',
              showOnModal: false,
            },
          },
        });
        setWeb3auth(web3auth);

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    generatePrecompute(); // <-- So one precompute would be available to your users.
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    // uiConsole(user);
    console.log('user info', user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole('ETH Address: ' + address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.signTransaction();
    uiConsole(receipt);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <IonButton onClick={getUserInfo}>get user information</IonButton>
      <IonButton onClick={signMessage}>sign message</IonButton>
      <IonButton onClick={getAccounts}>get accounts</IonButton>
      <IonButton onClick={logout}>Logout</IonButton>
    </>
  );

  const unloggedInView = (
    <>
      <IonButton onClick={login}>Login</IonButton>
    </>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MPC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{provider ? loggedInView : unloggedInView}</IonContent>
    </IonPage>
  );
}

export default Web3AuthMpc;
