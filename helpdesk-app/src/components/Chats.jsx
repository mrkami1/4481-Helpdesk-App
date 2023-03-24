import React, { useContext, createContext, useEffect, useState } from "react";
import { onSnapshot, collection, query, where, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Chats = ({ setDialog }) => {
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState([]);
    const [end, setEnd] = useState({show: false, data: null}); //
    const [currentData, setCurrentData] = useState({}); // data for the current user

    const anonIcon = "https://cdn-icons-png.flaticon.com/512/5595/5595500.png";
    const userIcon = "https://cdn-icons-png.flaticon.com/512/8748/8748111.png";

    useEffect(() => {
        const getUsers = () => {
            const q = query(collection(db, "users"), where("userStatus", "==", "online"));
            const unsub = onSnapshot(q, (querySnapshot) => {
                const userArray = [];
                const totalUserArray = [];
                querySnapshot.forEach((doc) => {
                    let userData = doc.data();
                    totalUserArray.push(userData);
                    if (userData.userID === currentUser.uid) setCurrentData(userData);
                    // If the user is anonymous, only show the agents that have this user assigned to them
                    if (
                        currentUser.isAnonymous &&
                        userData.userType === "agent" &&
                        userData.assignedUsers.includes(currentUser.uid)
                    ) {
                        userArray.push(userData);
                    }
                    // If the user is an agent, show everyone except themself
                    else if (!currentUser.isAnonymous && userData.userID !== currentUser.uid) {
                        userArray.push(userData);
                    }
                });
                setTotalUsers(totalUserArray);
                setUsers(userArray);
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getUsers();
    }, [currentUser.uid,]);

    // If theres no agents logged in, and an anonymous user logs in, wait until an agent logs in and assign them to the user
    useEffect(() => {
        console.log(totalUsers)
        for (let i = 0; i < totalUsers.length; i++) {
            if (totalUsers[i].userType === 'agent' && currentUser.isAnonymous && currentData.assignedAgent === '') {
                let newAssignedUsers = totalUsers[i].assignedUsers;
                newAssignedUsers.push(currentUser.uid);
                updateDoc(doc(db, 'users', currentUser.uid), {
                    assignedAgent: totalUsers[i].userID,
                })
                updateDoc(doc(db, 'users', totalUsers[i].userID), {
                    assignedUsers: newAssignedUsers,
                })
            }
        }
        
    }, [totalUsers])

    const openChat = async (usr, e) => {
        const chatID =
            currentUser.uid > usr.userID
                ? currentUser.uid + usr.userID
                : usr.userID + currentUser.uid;
        if (e.target.className !== "transfer-button" && e.target.className !== "endChat-button") {
            try {
                const response = await getDoc(doc(db, "chats", chatID));

                if (!response.exists() && usr.userID !== currentUser.uid) {
                    await setDoc(doc(db, "chats", chatID), { messages: [] }).then(() => {
                        console.log("created new convo");
                        dispatch({ type: "change_user", payload: usr });
                    });
                } else {
                    dispatch({ type: "change_user", payload: usr });
                }
            } catch (err) {}
        }
    };

    const endChat = async (e) => {
        setEnd({show: false, data: end.data});
        let a = currentData.assignedUsers;

        for (let i = 0; i < a.length; i++) {
            if (a[i] === end.data.userID) {
                a.splice(i, 1);
            }
        }

        await updateDoc(doc(db, "users", currentUser.uid), {
            assignedUsers: a,
        })
        .then(() => {
            console.log(a)
        })
    };

    return (
        <div className="chats">
            <link
                rel="stylesheet"
                href="https://cdn-uicons.flaticon.com/uicons-bold-straight/css/uicons-bold-straight.css"
            ></link>
            {Object.entries(users)?.map((user) => (
                <div
                    className="user-chat"
                    key={user[1].userID}
                    onClick={(e) => {
                        openChat(user[1], e);
                    }}
                >
                    <div className="picture">
                        <img
                            src={user[1].userType === "agent" ? userIcon : anonIcon}
                            alt="User"
                            width={45}
                            height={45}
                        ></img>
                    </div>
                    <div className="name">
                        <span className="username">
                            {user[1].userType === "agent"
                                ? user[1].firstName + " " + user[1].lastName
                                : "Anonymous User " + "(" + user[1].userID + ")"}
                        </span>
                    </div>
                    {user[1].userType === "anonymous" && currentData.assignedUsers?.includes(user[1].userID) && (
                        <button
                            className="transfer-button"
                            onClick={() => setDialog({ show: true, data: user[1] })}
                        >
                            Transfer
                        </button>
                    )}
                    {user[1].userType === "anonymous" && currentData.assignedUsers?.includes(user[1].userID) && (
                        <button className="endChat-button" onClick={() => setEnd({show: true, data: user[1]})}>
                            End chat
                        </button>
                    )}
                </div>
            ))}
            <Dialog
                open={end.show}
                onClose={() => setEnd({show: false, data: end.data})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                    },
                }}
                >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        backgroundColor: "rgb(39, 40, 48)",
                        color: "white",
                    }}
                    >
                    End chat
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "rgb(39, 40, 48)" }}>
                    <DialogContentText id="alert-dialog-description" sx={{ color: "white" }}>
                        Are you sure that you want to end this chat?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "rgb(39, 40, 48)" }}>
                    <Button
                        onClick={() => setEnd({show: false, data: end.data})}
                        sx={{
                            ":hover": {
                                backgroundColor: "rgb(78, 81, 95)",
                            },
                        }}
                        >
                        Cancel
                    </Button>
                    <Button
                        onClick={endChat}
                        autoFocus
                        sx={{
                            ":hover": {
                                backgroundColor: "rgb(78, 81, 95)",
                            },
                        }}
                        >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Chats;
