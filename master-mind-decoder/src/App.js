import './App.scss';
import Guess from "./components/Guess";
import axios from "axios";
import Menu from "./components/Menu";
import React from "react";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            COLOR_SET: ['blue', 'red', 'green', 'yellow', 'pink', 'white'],
            current: 0,
            sessionOn: false,
            message: "请小心地输入游戏中给出的结果吧.",
            out: false,
            option: 0
        };
    }

    setCurrent = (v) => {
        this.setState({current: v});
    }

    setMessage = (v) => {
        this.setState({message: v});
    }

    setOut = (v) => {
        this.setState({out: v});
    }

    setHistoryItem = async (data, position) => {
        const updateHistory = this.state.history.map((item, key) => key === position ? data : item)
        this.setState({history: updateHistory});
    }

    startSession = async () => {
        let initialHistory = [];
        for (let i = 0; i < 8; i++) {
            initialHistory.push({
                guess: ['', '', '', ''],
                full: -1,
                half: -1
            });
        }
        await this.setState({
            history: initialHistory,
            current: 0,
            out: false,
            message: "请小心地输入游戏中给出的结果吧."
        });
        axios({
            method: 'GET',
            url: '/api/start'
        }).then(async response => {
            if (response.data.code === 0) {
                let data = {
                    guess: response.data.data,
                    full: -1,
                    half: -1
                }
                await this.setHistoryItem(data, this.state.current);
                this.setState({sessionOn: true})
            } else {
                this.setState({message: `发生了错误: ${response.data.message}.`});
            }
        }).catch(error => {
            this.setState({message: `发生了错误: ${error}.`});
        });
    }

    componentDidMount() {
        document.title = "猜颜色助手";
    }

    render() {
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

                {this.state.sessionOn && this.state.option === 0 &&
                    <div className={'solver-main'}>
                        <div className={'message'}>
                            {this.state.message}
                        </div>
                        <div className={'main'}>
                            <div className={'guesses'}>
                                {this.state.history.map((item, key) =>
                                    <Guess key={key}
                                           out={this.state.out}
                                           setOut={this.setOut}
                                           setMessage={this.setMessage}
                                           COLOR_SET={this.state.COLOR_SET}
                                           current={this.state.current}
                                           data={item}
                                           setCurrent={this.setCurrent}
                                           setHistoryItem={this.setHistoryItem}
                                           index={key}/>)}
                            </div>
                        </div>
                        <Menu startSession={this.startSession}/>
                    </div>}
            </div>
        );
    }
}

export default App;
