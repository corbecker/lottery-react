import Web3 from 'web3';

//new instance of web3 from module and injecting the web3 provider coming from metamask
const web3 = new Web3(window.web3.currentProvider);

export default web3;