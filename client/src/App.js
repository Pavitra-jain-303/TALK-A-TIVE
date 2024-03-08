import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/homePage/homePage.jsx';
import ChatPage from './pages/chatPage/chatPage.jsx';
import ChatState from './Context/chatState.js';

function App() {
    return (
        <div className="App">
            <ChatState>
                <Routes>
                    <Route path="/" element={
                        <HomePage />
                    } />
                    <Route path="/chats" element={
                        <ChatPage />
                    } />
                    <Route path="*" element={
                        <div>Hello</div>
                    } />
                </Routes>
            </ChatState>
        </div>
    );
}

export default App;

