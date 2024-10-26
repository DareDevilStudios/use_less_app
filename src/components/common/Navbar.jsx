import supabase from '@/supabase'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Toast from './Toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [DropDown, setDropDown] = useState(false);
    const [loader, setLoader] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = () => {
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const openDropDown = () => {
        setDropDown(!DropDown);
    };

    const auth = async () => {
        supabase.auth.signInWithOAuth({
            provider: 'google'
        })
            .then(async ({ data, error }) => {
                if (error) {
                    //   showToast('Sign-in failed!');
                } else {
                    setTimeout(() => {

                        showToast();
                    }, 5000);
                }
            })
            .catch(err => {
                // showToast('An error occurred!');
            });
    };

    const signout = async () => {
        setDropDown(false);
        setLoader(true);  // Show the loader when the signout starts
        await supabase.auth.signOut();
        setUser(null);    // Manually clear user state after signout
        setLoader(false); // Hide the loader after signout
        router.push('/');
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();  // Get the user data
            setUser(user);  // Update the user state
            console.log("user", user);
            

            let { data: user_info, error } = await supabase
                .from('user_info')
                .select("*")
                .eq('user_id', user?.id)

            console.log(user_info);
            if (user && user_info.length === 0) {
                const { data, error } = await supabase
                    .from('user_info')
                    .upsert({ info: user.user_metadata, user_id: user.id })
                    .select()
            }
        };

        getUser();
    }, []);


    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <h1 className="text-2xl">💀</h1>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Thantha vibe.ai</span>
                    </a>
                    {toastVisible && <Toast message="Logged in successfully!" onClose={hideToast} bgcolor="bg-green-500" />}
                    {user ? (
                        <div className="flex items-center space-x-3">
                            <p className='hidden md:flex'>Welcome {user?.user_metadata?.full_name}</p>
                            <button onClick={openDropDown}>
                                <Image className='rounded-full' src={user?.user_metadata?.picture} width={30} height={20} alt="User Picture" />
                            </button>
                            {DropDown && (
                                <div className="absolute right-0 top-4 mt-12 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-1">
                                    {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a> */}
                                    <button
                                        onClick={signout}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        disabled={loader} // Disable button when loader is true
                                    >
                                        <span>Sign out</span>
                                        {loader && (
                                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={auth}
                            className="flex items-center border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                                alt="Google Logo"
                                className="w-5 h-5 mr-2"
                                width={20}
                                height={20}
                            />
                            Sign in with Google
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
}