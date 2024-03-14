import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

 

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            setLoading(false);
            toast.error('Please Fill all the Fields', {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        // console.log(email, password);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                `/api/user/login`,
                {
                    email,
                    password
                },
                config
            );
            // console.log(data);
            toast.success('Login Successful', {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            setLoading(false);
            localStorage.setItem("userInfo", JSON.stringify(data));
            Navigate("/chats");
        } catch (error) {
            setLoading(false);
            toast.error(`Error has Occured! \n${error}`, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light"
            });
        }
    };

    return (
        <form className="row g-3 signUp needs-validation col-md-12" noValidate>
            <div className="col-md-12">
                <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    placeholder='Email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='email'
                />
            </div>
            <div className="col-md-12">
                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="inputPassword"
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ border: "none" }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <div className="col-12">

                {
                    loading ? <div className="spinner-border m-5" role="status">
                        <span className="sr-only"></span>
                    </div>
                        :
                        <button
                            type="submit"
                            className="btn btn-success"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent the default form submission behavior
                                submitHandler(); // Call your handleClick function
                            }}
                        >
                            Log In
                        </button>
                }
            </div>
            <div className="col-12">
                <button
                    className="btn btn-danger"
                    onClick={(e) => {
                        e.preventDefault();
                        setEmail("guest@example.com");
                        setPassword("123456")
                    }}
                >
                    Get Guest User Credentials
                </button>
            </div>


            <a href="/">forgotten Password</a>
            <ToastContainer autoClose={false} />
        </form>
    );
}
