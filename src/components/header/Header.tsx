import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                Home
            </Link>
            <Link to="/feedback" className="item">
                Feedbacks
            </Link>
            <div className="right menu">
                <Link to="/login" className="item">
                    Log in
                </Link>
            </div>
        </div>
    )
}

export default Header