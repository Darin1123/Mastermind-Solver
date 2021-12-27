import IconRefresh from "../resources/icon/refresh";
import './Menu.scss';
import {useEffect, useRef, useState} from "react";

export default function Menu(props) {

    const [openReloadConfirm, setOpenReloadConfirm] = useState(false);

    return (
        <div className={'menu'}>
            <div className={'reload'}>
                <div className={'svg-container'}
                     onClick={() => setOpenReloadConfirm(true)}>
                    <IconRefresh/>
                </div>
                {openReloadConfirm &&
                    <ReloadConfirm
                        startSession={props.startSession}
                        setOpenReloadConfirm={setOpenReloadConfirm}/>}
            </div>
        </div>
    );
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(props, ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.setOpenReloadConfirm(false);
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

function ReloadConfirm(props) {

    const wrapperRef = useRef(null);
    useOutsideAlerter(props, wrapperRef);

    return (
        <div className={'reload-confirm'} ref={wrapperRef}>
            <div>确认要重新开始吗?</div>
            <div className={'buttons'}>
                <div onClick={() => {
                    props.startSession();
                    props.setOpenReloadConfirm(false);
                }}>确认</div>
                <div onClick={() => props.setOpenReloadConfirm(false)}>取消</div>
            </div>
        </div>
    );
}