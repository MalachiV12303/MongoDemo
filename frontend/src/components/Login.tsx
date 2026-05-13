import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8000/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.access_token);

            alert("Login successful");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out");
        window.location.reload();
    };

    type TokenPayload = {
        email: string;
        role: string;
    };

    const token = localStorage.getItem("token");

    let userRole = "Guest";

    if (token) {
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            userRole = decoded.role;
        } catch {
            userRole = "Guest";
        }
    }

    return (
        <div className="p-4 border flex flex-col gap-2">
            <span className="text-xl">user authentication</span>
            <div className="flex items-end gap-2">
                <input
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-min border-b border-foreground block focus:outline-none"
                />

                <input
                    placeholder="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-min border-b border-foreground block focus:outline-none"
                />

                <button
                    onClick={handleLogin}
                    className="h-min bg-primary hover:bg-primary-muted transition-colors text-foreground px-3 py-1"
                >
                    Login
                </button>

                <button
                    onClick={handleLogout}
                    className="h-min bg-primary hover:bg-primary-muted transition-colors text-foreground px-3 py-1"
                >
                    Logout
                </button>
                <div className="ml-2">
                    <span className="text-xs text-foreground-muted">credentials for testing:</span>
                    <div className="flex gap-4 text-sm">
                        <div className="flex flex-col">
                            <span>email: malachi@demo.com</span>
                            <span>pass: password123</span>
                        </div>
                        <div className="flex flex-col">
                            <span>email: malachiadmin@demo.com</span>
                            <span>pass: password1234</span>
                        </div>
                    </div>
                </div>
                <span className="ml-auto">current role: {userRole}</span>
            </div>
        </div>
    );
}