import React, { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { onSnapshot, collection, query, where, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Snackbar, Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const Transfer = ({ dialog, setDialog }) => {
    const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

    const [agents, setAgents] = useState([]);
	const [currentData, setCurrentData] = useState();
    const [selected, setSelected] = useState('');
    const [okDialog, setOkDialog] = useState(false);
    const [alert, setAlert] = useState({type: 'info', message: 'default'});
    const [showSnackbar, setShowSnackbar] = useState(false)

    useEffect(() => {
        const getAgents = () => {
            const q = query(
                collection(db, "users"),
                where("userStatus", "==", "online"),
                where("userType", "==", "agent")
            );
            const unsub = onSnapshot(q, (querySnapshot) => {
                const agentsArray = [];
                querySnapshot.forEach((doc) => {
                    let agentData = doc.data();
                    if (agentData.userID !== currentUser.uid) {
                        agentsArray.push(agentData);
                    }
					else setCurrentData(agentData);
                });

                setAgents(agentsArray);
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getAgents();
    }, [currentUser.uid]);

    const sendTransfer = async () => {
        setOkDialog(false);
		setDialog({ show: false, data: dialog.data })
        
		let a = currentData.assignedUsers;

        for (let i = 0; i < a.length; i++) {
            if (a[i] === dialog.data.userID) {
                a.splice(i, 1);
            }
        }
		// update current agents assigned users
        await updateDoc(doc(db, "users", currentUser.uid), {
            assignedUsers: a,
        })
        .then(async () => {
            // update anonymous users assigned agent
			let newAgent = null;

			for (let i = 0; i < agents.length; i++) {
				if (agents[i].firstName + " " + agents[i].lastName + ' (' + agents[i].userID + ')' === selected) {
					newAgent = agents[i];
				}
			}

			await updateDoc(doc(db, "users", dialog.data.userID), {
				assignedAgent: newAgent.userID,
			})
			.then(async () => {
				// update new agents assigned users
				newAgent.assignedUsers.push(dialog.data.userID);
				await updateDoc(doc(db, "users", newAgent.userID), {
					assignedUsers: newAgent.assignedUsers,
				})
                .then(() => {
                    setAlert({type: 'success', message: 'Transfer completed'})
                })
			})
        })
        .then(() => {
            
            openSnackbar();
        })
    }
    
    const openSnackbar = () => {
        setShowSnackbar(true);
    }
    const closeSnackbar = () => {
        setShowSnackbar(false);
    }

    return (
        <>{
        dialog.show &&
        <div className="dialog-container">
            <div className="dialog-wrapper">
                <h2>Transfer User </h2>
                <h3>Select an Agent</h3>

                <div className="agent-list">
                    <select
                        className="agent-items"
                        onChange={(e) => setSelected(e.target.value)}
                        size={5}
                        >
                        {Object.entries(agents)?.map((agent) => (
                            <option key={agent[1].userID}>
                                {agent[1].firstName + " " + agent[1].lastName + ' (' + agent[1].userID + ')'}
                            </option>
                        ))}
                    </select>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                    >
                    Current selection
                </p>
                <p>Agent: {selected}</p>
                <p>User: Anonymous User ({dialog.data?.userID})</p>

                <Button
                    className="transfer-button"
                    variant="outlined"
                    onClick={() => setOkDialog(true)}
                    disabled={selected === ""}
                    >
                    Transfer
                </Button>

                <Dialog
                    open={okDialog}
                    onClose={() => setOkDialog(false)}
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
                        Transfer
                    </DialogTitle>
                    <DialogContent sx={{ backgroundColor: "rgb(39, 40, 48)" }}>
                        <DialogContentText
                            id="alert-dialog-description"
                            sx={{ color: "white" }}
                            >
                            Are you sure that you want to transfer this user to the selected
                            agent?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: "rgb(39, 40, 48)" }}>
                        <Button
                            onClick={() => setOkDialog(false)}
                            sx={{
                                ":hover": {
                                    backgroundColor: "rgb(78, 81, 95)",
                                },
                            }}
                            >
                            Cancel
                        </Button>
                        <Button
                            onClick={sendTransfer}
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

                <button
                    className="cancel-button"
                    onClick={() => {
                        setDialog({ show: false, data: dialog.data });
                        setSelected("");
                    }}
                    >
                    CANCEL
                </button>
            </div>
        </div>}
        <Snackbar open={showSnackbar} autoHideDuration={4000} onClose={closeSnackbar}>
            <Alert onClose={closeSnackbar} severity={alert.type} sx={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
        </>
    );
};

export default Transfer;
