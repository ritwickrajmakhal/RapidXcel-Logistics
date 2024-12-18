import React from 'react'
// import logo from '../logo.png';
// import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg border-bottom border-body bg-dark" data-bs-theme="dark">
            <div className="container">
                <h1 className="navbar-brand">
                    RapidXcel Logistics
                </h1>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                    <ul className="navbar-nav">
                       {/* TODO: Add logout, User profile, dashboard options */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar