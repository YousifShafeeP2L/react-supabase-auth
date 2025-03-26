import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../utils/supabaseClient";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.updateUser({ password: password });
        if (error) {
            setMessage(error.message);
        } else if (data) {
            setMessage("Password updated");
        }
    };

    return <div>
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="submit">Reset Password</button>
        </form>
        <p>
            <Link to="/login">Login</Link>
        </p>
    </div>;
};

export default ResetPassword;
