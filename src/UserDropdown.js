
import { Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from "./contexts/AuthUserContext";
import { Alert } from "react-bootstrap";
import React, {  useState } from "react";

function UserDropdown() {
    const { currentUser } = useAuthUser();
    const { logout } = useAuthUser();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Declare state variables for current user and show dropdown
    const [showDropdown, setShowDropDown] = useState(false);
    const handleLogout = async () => {
        setError("");
        try {
          await logout();
          navigate("/");
        } catch (error) {
          setError("Failed to log out");
        }
      };
    
      // Toggle drop-down menu function
      const toggleDropdown = () => setShowDropDown(!showDropdown);


return(
    <>
    {error && <Alert variant="danger">{error}</Alert>}

<div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
  {currentUser ? (
    <>
      <Button onClick={toggleDropdown}>
        {currentUser.username} {/* Display User name */}
      </Button>
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
            padding: '12px 16px',
            zIndex: 1001,
          }}
        >
          <Link to={`/user/${currentUser.username}`} style={{ marginBottom: '10px', display: 'block' }}>
            My Account
          </Link>
          <Link to={`/user/${currentUser.username}/privateWrapped`} style={{ marginBottom: '10px', display: 'block' }}>
            Wrapped
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              color: 'blue',
              cursor: 'pointer',
              textDecoration: 'underline',
              border: 'none',
              padding: 0,
              font: 'inherit',
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </>
  ) : (
    <Button onClick={() => navigate('/')}>Login</Button> 
  )}
</div>
    </>
);
}

export default UserDropdown;