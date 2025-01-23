// /* eslint-disable @typescript-eslint/no-unused-vars */
/* tailwindcss: ignore */

import AuthContext from "../Context/AuthContext"
import style from "./Nav.module.css"
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Notification from '../Chats/Notifications'

function Nav() {
    let { logoutUser, user } = useContext(AuthContext)
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <header>

            <nav className={style.navbar}>
                <div className={style.container}>
                    <div className={style['left-side']}>
                        {user ? <a href="/feed" className={style["navbar-brand"]}>CareerLink</a> : <a href="/" className={style["navbar-brand"]}>CareerLink</a>}

                        {/* <a href="{% url 'posts:list' %}" className={style['navbar-brand']}>📤</a> */}
                        {user ? <><Notification />
                        </> : ''}
                    </div>
                    <div className={style.centered}>
                        <form onSubmit={handleSearch} className={style['search-form']}>
                            <input type="text" placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            ></input>
                            <button type="submit"><i className='fas fa-search'></i></button>
                        </form>
                    </div>
                    <ul className={style['navbar-nav']}>
                        {user ? <> <li><a href="/profile">Profile</a></li>
                            <li><a onClick={logoutUser} href="/">Logout</a></li>
                            <li><a href="/settings">settings</a></li>

                        </>
                            :
                            <><li><a href="/login">Login</a></li>
                                <li><a href="/register">Register</a></li>
                            </>
                        }


                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Nav
