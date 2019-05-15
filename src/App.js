import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({
      manager,
      players,
      balance
    });
  }

  onFormSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'Successfully entered contract.'})


  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Picking a winner...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const winner = await lottery.methods.lastWinner().call();
    console.log(winner);

    this.setState({message: `Congrats ${winner} you won ${this.state.balance} ether!`});
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by: {this.state.manager}.</p>
        <p>There are currently {this.state.players.length} people competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.</p>
        <form onSubmit={this.onFormSubmit}>
          <h4>Try your luck:</h4>
          <div>
            <label>Amount of ether to enter:</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})} 
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h2>Pick a winner</h2>
        <button onClick={this.onClick}>Pick</button>
        <hr />
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
