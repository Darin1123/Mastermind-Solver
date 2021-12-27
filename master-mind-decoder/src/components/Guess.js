import './Guess.scss';
import axios from "axios";
import {useEffect, useRef, useState} from "react";

export default function Guess(props) {

    // const [full, setFull] = useState(-1);
    // const [half, setHalf] = useState(-1);
    const [openFullMenu, setOpenFullMenu] = useState(false);
    const [openHalfMenu, setOpenHalfMenu] = useState(false);

    function makeGuess() {
        if (props.out) {
            return;
        }

        if (full === -1) {
            props.setMessage("请输入全对.");
            return;
        }
        if (half === -1) {
            props.setMessage("请输入半对.");
            return;
        }

        let data = {
            guess: props.data.guess,
            full: full,
            half: half
        };
        axios({
            method: 'POST',
            url: '/api/guess',
            data: data
        }).then(response => {
            if (response.data.code === 0) {
                let data = {
                    guess: response.data.data,
                    full: -1,
                    half: -1
                }
                props.setHistoryItem(data, props.current + 1);
                props.setCurrent(props.current + 1);
                props.setMessage("请小心地输入游戏中给出的结果吧.");
            } else if (response.data.code === 200) {
                let data = {
                    guess: response.data.data,
                    full: -1,
                    half: -1
                }
                props.setMessage("这次一定对了!");
                props.setHistoryItem(data, props.current + 1);
                props.setCurrent(props.current + 1);
                props.setOut(true);
            } else if (response.data.code === 500) {
                props.setMessage("想不出来了... 请重新开始吧.");
                props.setOut(true);
            } else {
                props.setMessage(`发生了错误: ${response.data.message}`);
            }
        }).catch(e => {
            props.setMessage(`发生了错误: ${e}`);
        })
    }

    let full = props.data.full;
    let half = props.data.half;

    function setFull(value) {
        let data = props.data;
        data.full = value;
        props.setHistoryItem(data, props.index);
    }

    function setHalf(value) {
        let data = props.data;
        data.half = value;
        props.setHistoryItem(data, props.index);
    }

    return (
        <div className={'guess'}>
            <div className={'guess-num'}>
                {props.index + 1}
            </div>
            <div className={'guess-main'}>
                {props.data.guess.map((color, key) =>
                    <div key={key}
                         className={`hole ${color} ${color.length > 0 ? 'spot' : ''}`}/>)}
            </div>
            {props.index === props.current &&
                <div className={'result-input'}>
                    <div className={'input-container full'}>
                    <span>
                        全对
                    </span>
                    <span className={'full-button'}
                          onClick={() => setOpenFullMenu(true)}>
                        {full === -1 ? '?' : full}
                    </span>
                        {openFullMenu &&
                            <FullMenu setOpenFullMenu={setOpenFullMenu}
                                      setFull={setFull}
                                      half={half}/>}
                    </div>
                    <div className={'input-container half'}>
                    <span>
                        半对
                    </span>
                    <span className={'half-button'}
                          onClick={() => setOpenHalfMenu(true)}>
                        {half === -1 ? '?' : half}
                    </span>
                        {openHalfMenu &&
                            <HalfMenu setOpenHalfMenu={setOpenHalfMenu}
                                      setHalf={setHalf}
                                      full={full}/>}
                    </div>
                    <div className={`confirm ${props.out ? 'out' : ''}`}
                         onClick={makeGuess}>
                        确认
                    </div>
                </div>}

            {props.index < props.current &&
                <div className={'result-history'}>
                    <div className={'input-container full'}>
                    <span>
                        全对
                    </span>
                        <span className={'history-full'}>{full}</span>
                    </div>
                    <div className={'input-container half'}>
                    <span>
                        半对
                    </span>
                        <span className={'history-half'}>{half}</span>
                    </div>
                </div>}
        </div>
    );
}

function useFullOutsideAlerter(props, ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.setOpenFullMenu(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

function FullMenu(props) {

    const wrapperRef = useRef(null);
    useFullOutsideAlerter(props, wrapperRef);

    let max = props.half === -1 ? 3 : (4 - props.half);
    let options = [];
    for (let i = 0; i < max + 1; i++) {
        options.push(i);
    }

    return (
        <div className={'full-menu'} ref={wrapperRef}>
            {options.map((value, key) =>
                <div className={'option'}
                     key={key}
                     onClick={() => {
                         props.setFull(value);
                         props.setOpenFullMenu(false);
                     }}>{value}</div>)}
        </div>
    );
}

function useHalfOutsideAlerter(props, ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.setOpenHalfMenu(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

function HalfMenu(props) {

    const wrapperRef = useRef(null);
    useHalfOutsideAlerter(props, wrapperRef);

    let max = props.full === -1 ? 4 : (props.full === 3 ? 0 : 4 - props.full);
    let options = [];
    for (let i = 0; i < max + 1; i++) {
        options.push(i);
    }

    return (
        <div className={'half-menu'} ref={wrapperRef}>
            {options.map((value, key) =>
                <div className={'option'}
                     key={key}
                     onClick={() => {
                         props.setHalf(value);
                         props.setOpenHalfMenu(false);
                     }}>{value}</div>)}
        </div>
    );
}


