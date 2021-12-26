import './App.scss';
import {useEffect, useState} from "react";
import Guess from "./Guess";
import axios from "axios";
import Menu from "./Menu";
import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);
        let initialHistory = [];
        for (let i = 0; i < 8; i++) {
            initialHistory.push(['', '', '', '']);
        }
        this.state = {
            history: initialHistory,
            COLOR_SET: ['blue', 'red', 'green', 'yellow', 'pink', 'white'],
            current: 0,
            sessionOn: false,
            message: "请小心地输入游戏中给出的结果吧.",
            out: false
        };
    }

    setCurrent = (v) => {
        this.setState({current: v});
    }

    setHistoryItem = async (data, position) => {
        const updateHistory = this.state.history.map((item, key) => key === position ? data : item)
        this.setState({history: updateHistory});
    }

    startSession = async () => {
        let initial = [];
        for (let i = 0; i < 8; i++) {
            initial.push(['', '', '', '']);
        }
        await this.setState({
            history: initial,
            current: 0,
            out: false,
            message: "请小心地输入游戏中给出的结果吧."
        });
        axios({
            method: 'GET',
            url: '/api/start'
        }).then(async response => {
            if (response.data.code === 0) {
                await this.setHistoryItem(response.data.data, this.state.current);
                this.setState({sessionOn: true})
            } else {
                this.setState({message: `发生了错误: ${response.data.message}.`});
            }
        }).catch(error => {
            this.setState({message: `发生了错误: ${error}.`});
        });

    }

    render()
{
    return (
        <div className="App">
            <div className={'bg-img'}/>
            {!this.state.sessionOn &&
                <div className={'welcome'}>
                    <div className={'container'}>
                        <span className={'title'}>欢迎使用"<span style={{color: 'red'}}>猜</span><span
                            style={{color: 'green'}}>颜</span><span style={{color: 'blue'}}>色</span>"助手!</span>
                        <div className={'button'}
                             onClick={() => this.startSession()}>
                            开始!
                        </div>
                    </div>
                </div>}

            {this.state.sessionOn &&
                <div className={'message'}>
                    {this.state.message}
                </div>}

            {this.state.sessionOn &&
                <div className={'main'}>
                    <div className={'guesses'}>
                        {this.state.history.map((item, key) =>
                            <Guess key={key}
                                   out={this.state.out}
                                   setOut={this.state.setOut}
                                   setMessage={this.setMessage}
                                   COLOR_SET={this.state.COLOR_SET}
                                   current={this.state.current}
                                   data={item}
                                   setCurrent={this.setCurrent}
                                   setHistoryItem={this.setHistoryItem}
                                   index={key}/>)}
                    </div>
                </div>}
            {this.state.sessionOn &&
                <Menu startSession={this.startSession}/>}
        </div>
    );
}
}

export default App;
