import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
interface UserMetadata {
    username: string;
    fullName: string;
    bio: string;
}

function ChangeUsername() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [userMetadata, setUserMetadata] = useState<UserMetadata>({
        username: "",
        fullName: "",
        bio: ""
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.user_metadata) {
                setUserMetadata({
                    username: user.user_metadata.username || "",
                    fullName: user.user_metadata.fullName || "",
                    bio: user.user_metadata.bio || ""
                });
                console.log(userMetadata);
            }
        };
        getCurrentUser();
    }, []);

    const validateProfile = (data: UserMetadata): string | null => {
        if (!data.username.trim()) {
            return "Username is required";
        }
        if (data.username.length < 3) {
            return "Username must be at least 3 characters long";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            return "Username can only contain letters, numbers, and underscores";
        }
        if (data.fullName.length > 50) {
            return "Full name must be less than 50 characters";
        }
        if (data.bio.length > 200) {
            return "Bio must be less than 200 characters";
        }
        return null;
    };

    const updateProfile = async () => {
        if (!user) return;

        const validationError = validateProfile(userMetadata);
        if (validationError) {
            setProfileError(validationError);
            return;
        }

        try {
            setIsLoading(true);
            setProfileError(null);

            const { error } = await supabase.auth.updateUser({
                data: userMetadata
            });

            if (error) {
                setProfileError(error.message);
                return;
            }

            // Update local user state
            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);
            setIsEditingProfile(false);
        } catch (error) {
            setProfileError("Failed to update profile");
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ... existing todo-related functions ...

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{
                marginBottom: '30px',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
            }}>
                <h1 style={{ marginBottom: '20px' }}>Hello {user?.email}</h1>

                {isEditingProfile ? (
                    <div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                            <input
                                type="text"
                                value={userMetadata.username}
                                onChange={(e) => setUserMetadata(prev => ({ ...prev, username: e.target.value }))}
                                placeholder="Enter username"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                            <input
                                type="text"
                                value={userMetadata.fullName}
                                onChange={(e) => setUserMetadata(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="Enter full name"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Bio</label>
                            <textarea
                                value={userMetadata.bio}
                                onChange={(e) => setUserMetadata(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Enter bio"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    minHeight: '100px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={updateProfile}
                                disabled={isLoading}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        {profileError && (
                            <p style={{ color: 'red', marginTop: '10px' }}>{profileError}</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Username:</strong> {userMetadata.username || 'Not set'}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Full Name:</strong> {userMetadata.fullName || 'Not set'}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Bio:</strong> {userMetadata.bio || 'Not set'}
                        </div>
                        <button
                            onClick={() => setIsEditingProfile(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
            <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
}

export default ChangeUsername;