// /* eslint-disable @typescript-eslint/no-unused-vars */
/* tailwindcss: ignore */

import AuthContext from "../Context/AuthContext"
import style from "./Nav.module.css"
import { useContext } from 'react'

function Nav() {
    let { logoutUser } = useContext(AuthContext)
    return (
        <header>

            <nav className={style.navbar}>
                <div className={style.container}>
                    <div className={style['left-side']}>
                        <a href="/" className={style["navbar-brand"]}>Dusty</a>
                        <a href="{% url 'posts:list' %}" className={style['navbar-brand']}>📤</a>
                    </div>
                    <div className={style.centered}>
                        <form action="% url 'search' %}" method="get" className={style['search-form']}>
                            <input type="text" name="q" placeholder="Search..."></input>
                            <button type="submit"><i className='fas fa-search'></i></button>
                        </form>
                    </div>
                    <ul className={style['navbar-nav']}>
                        <li><a href="/profile">Profile</a></li>
                        <li><a onClick={logoutUser} href="/">Logout</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Nav
