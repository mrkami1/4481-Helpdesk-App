import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import './styles.scss';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
    const {currentUser} = useContext(AuthContext);
    const ProtectedRoute = ({children}) => {
        if (!currentUser) {
            return <Navigate to="/login" />
        }

        return children;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='Login' element={<Login />} />
                    <Route path='Register' element={<Register />} />
                    <Route path='Privacy' element={<Privacy />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
