import './App.scss';
import {useEffect, useState} from "react";
import Guess from "./Guess";
import axios from "axios";
import IconRefresh from "./resources/icon/refresh";
import Menu from "./Menu";

function App() {
    let initialGuess = [];
    for (let i = 0; i < 8; i++) {
        initialGuess.push(['', '', '', '']);
    }
    const [history, setHistory] = useState(initialGuess);
    const COLOR_SET = ['blue', 'red', 'green', 'yellow', 'pink', 'white'];
    const [current, setCurrent] = useState(0);
    const [sessionOn, setSessionOn] = useState(false);
    const [message, setMessage] = useState("请小心地输入游戏中给出的结果吧.");
    const [out, setOut] = useState(false);

    function setHistoryItem(data, position) {
        history[position] = data;
        setHistory(history);
    }

    useEffect(() => {
        document.title = 'Mastermind Solver'
    }, []);

    async function startSession() {
        let initial = [];
        for (let i = 0; i < 8; i++) {
            initial.push(['', '', '', '']);
        }
        console.log(initial)
        await setHistory(initial);
        await setCurrent(0);
        await setOut(false);
        await setMessage("请小心地输入游戏中给出的结果吧.")
        axios({
            method: 'GET',
            url: '/api/start'
        }).then(async response => {
            if (response.data.code === 0) {
                await setHistoryItem(response.data.data, current);
                setSessionOn(true);
            } else {
                setMessage(`发生了错误: ${response.data.message}.`);
            }
        }).catch(error => {
            setMessage(`发生了错误: ${error}.`);
        });

    }

    return (
        <div className="App">
            <div className={'bg-img'}/>
            {!sessionOn &&
                <div className={'welcome'}>
                    <div className={'container'}>
                        <span className={'title'}>欢迎使用"<span style={{color: 'red'}}>猜</span><span
                            style={{color: 'green'}}>颜</span><span style={{color: 'blue'}}>色</span>"助手!</span>
                        <div className={'button'} onClick={() => startSession()}>开始!</div>
                    </div>
                </div>}

            {sessionOn &&
                <div className={'message'}>
                    {message}
                </div>}

            {sessionOn &&
                <div className={'main'}>
                    <div className={'guesses'}>
                        {history.map((item, key) =>
                            <Guess key={key}
                                   out={out}
                                   setOut={setOut}
                                   setMessage={setMessage}
                                   COLOR_SET={COLOR_SET}
                                   current={current}
                                   data={item}
                                   setCurrent={setCurrent}
                                   setHistoryItem={setHistoryItem}
                                   index={key}/>)}
                    </div>
                </div>}
            {sessionOn &&
                <Menu startSession={startSession}/>}
        </div>
    );
}

export default App;
