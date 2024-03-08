import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export default function SignUp() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const Navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const submitHandler = async () => {
        if (!name || !email || !password || !confirmpassword) {
            toast.error('Please Fill all the Fields', {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast.error('Passwords Do Not Match', {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }
        // console.log(name, email, password, pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/register",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );
            // console.log(data);
            toast.success('SignUP Successful', {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            Navigate("/chats");
        } catch (error) {
            setPicLoading(false);
            console.log(error);
            toast.error('Error has Occured!', {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light"
            });
        }
    };

    const postDetails = (pics) => {
        setPicLoading(true);
        if (!pics) { // Check if pics is undefined or null
            toast.warning("Please Select an Image!", {
                position: "bottom",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light"
            });
            setPicLoading(false);
            return;
        }
        // console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "TALK-A-TIVE");
            data.append("cloud_name", "skywalker303cloud");
            fetch("https://api.cloudinary.com/v1_1/skywalker303cloud/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data);
                    setPic(data.url.toString());
                    // console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast.warning("Please Select an Image!", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light"
            });
            setPicLoading(false);
            return;
        }
    };



    return (
        <form className="row g-3 signUp needs-validation col-md-12" noValidate>
            <div className="col-md-12">
                <input
                    type="text"
                    className="form-control"
                    id="inputName"
                    placeholder='Name'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="col-md-12">
                <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    placeholder='Email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="col-md-6">
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
            <div className="col-md-6">
                <div className="input-group">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        id="inputCPassword"
                        placeholder='Confirm Password'
                        required
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ border: "none" }}
                    >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <div className="input-group mb-3">
                <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile02"
                    required
                    onChange={(e) => postDetails(e.target.files[0])}
                    style={{ overflow: "hidden" }}
                />

                <label className="input-group-text" htmlFor="inputGroupFile02" style={{ border: "none", background: "none" }}>Profile Pic</label>
            </div>
            <div className="col-12">
                {
                    picLoading ? <div className="spinner-border m-5" role="status">
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
                            Register
                        </button>
                }
            </div>
            <ToastContainer autoClose={false} />
        </form>
    );
}
