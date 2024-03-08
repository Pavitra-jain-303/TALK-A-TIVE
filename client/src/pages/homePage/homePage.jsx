import { useState, useEffect} from 'react';
import SignIn from '../../components/signIn/signIn.jsx';
import SignUp from '../../components/singUp/signUp.jsx';
import './homePage.css';
import { useNavigate } from 'react-router-dom';

// "/"
function HomePage() {
    
    const [activeTab, setActiveTab] = useState('signin');

    const [user, setUser] = useState();
    const navigate = useNavigate();
    // useEffect(() => {
    //     const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    //     if(!userInfo) {
    //         redirect('/');
    //     }

    //     setUser(userInfo);
    // }, [])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (userInfo) {
            navigate('/chats');
        }

    }, [navigate]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <div className="homePageContainer row justify-content-evenly">
            <div className='col-3'><h1 className="display-3">Talk-A-Tive</h1></div>

            <div className="centeredContent col-5">
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio1"
                        autoComplete="off"
                        defaultChecked
                        style={{ backgroundColor: "white", color: "black", borderColor: "Background" }}
                        onClick={() => handleTabClick('signin')} />
                    <label
                        className="btn btn-outline-primary"
                        htmlFor="btnradio1">
                        sign in
                    </label>

                    <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio3"
                        autoComplete="off"
                        style={{ backgroundColor: "white", color: "black", borderColor: "Background" }}
                        onClick={() => handleTabClick('signup')}
                    />
                    <label
                        className="btn btn-outline-primary"
                        htmlFor="btnradio3">
                        sign up
                    </label>
                </div>

                <div className='credentials_container'>
                    {activeTab === 'signin' && <SignIn />}
                    {activeTab === 'signup' && <SignUp />}
                </div>
            </div>
        </div>
    );
}

export default HomePage;