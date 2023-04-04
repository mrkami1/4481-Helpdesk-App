import React, { useContext, useEffect, useState } from "react";
import Chats from "./Chats";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ setDialog }) => {
    const { currentUser } = useContext(AuthContext);
    const [userView, setUserView] = useState(2);
    const [viewText, setViewText] = useState("All");
    let sidebarTitle = "Online Agents";

    currentUser.isAnonymous ? (sidebarTitle = "Assigned Agent") : (sidebarTitle = "Online Users");

    function changeView() {
        setUserView((userView + 1) % 3);
    }

    useEffect(() => {
        switch (userView) {
            case 0:
                setViewText("Agents");
                break;
            case 1:
                setViewText("Anon");
                break;
            case 2:
                setViewText("All");
                break;
        }
    }, [userView]);

    return (
        <>
            <div className="sidebar">
                <div className="title-container">
                    <link
                        rel="stylesheet"
                        href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
                    />
                    <span>
                        {sidebarTitle}
                    </span>
                    <div className="filter-container">
                        {!currentUser.isAnonymous && (
                            <span>{viewText}<i className="fi fi-rr-settings-sliders" onClick={changeView} /></span>
                        )}
                    </div>
                </div>
                <div className="chats-container">
                    <div className="chats-wrapper">
                        <Chats setDialog={setDialog} userView={userView} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
