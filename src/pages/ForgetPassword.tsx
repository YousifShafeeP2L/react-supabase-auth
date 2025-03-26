import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabaseClient";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: import.meta.env.VITE_RESET_URL
        });
        if (error) {
            setMessage(error.message);
        } else if (data) {
            setMessage("Reset link sent to email");
        }
    };
    return <div>
        <h2>Forget Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Send Reset Link</button>
        </form>
        <Link to="/login">Back to Login</Link>
    </div>;
};

export default ForgetPassword;
