import { useState, useContext } from 'react';
import AuthContext from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
    const [showError, setShowError] = useState(false);
    let { loginUser } = useContext(AuthContext)

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!e.target.username.value || !e.target.password.value) {
            setShowError(true);

        } else {
            setShowError(false);
            loginUser(e).then((response) => {
                if (response) {
                    navigate(from, { replace: true }); // Redirect to the previous page
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-grow flex flex-col justify-center px-6 py-12 lg:px-8">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="flex justify-center mb-4">
                        {/* <img
                            alt="Your Company"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-16 w-auto transition-all duration-300 ease-in-out transform hover:scale-110"
                        /> */}
                    </div>
                    <div className="rounded-lg shadow-xl overflow-hidden bg-white transition-shadow duration-300 ease-in-out hover:shadow-2xl">
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="text-center sm:mt-5">
                                <h2 className="text-3xl font-extrabold text-gray-900 transition-colors duration-300 ease-in-out hover:text-indigo-600">Sign in to your account</h2>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                                <div className="-space-y-px rounded-md shadow-sm">
                                    <div>
                                        <label htmlFor="email-address" className="sr-only">UserName</label>
                                        <input
                                            id="email-address"
                                            name="username"
                                            type="username"
                                            required
                                            autoComplete="email"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Username"
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="sr-only">Password</label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Password"
                                            defaultValue={""}
                                        />
                                    </div>
                                </div>

                                {showError && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-red-600 font-medium">Please fill in all fields.</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-600 ml-2">
                                            <path d="M18 15a1 1 0 010 2h-7v-5a1 1 0 010-2h7zm-7 2h-6a1 1 0 01-1-1v-4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1z"></path>
                                        </svg>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 transition-colors duration-300 ease-in-out hover:text-indigo-600">Remember me</label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-all duration-200 ease-in-out">Forgot your password?</a>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:transform-none w-full sm:w-auto"
                                    >
                                        {showError && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                {/* Heroicon name: solid/exclamation-circle */}
                                                <svg className="h-5 w-5 text-red-500 group-hover:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3a1 1 0 015-5h8a1 1 0 015 5zM7 8a1 1 0 012 0v6a1 1 0 102 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 100 2V8a1 1 0 110-2z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

