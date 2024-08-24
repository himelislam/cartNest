import React from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import auth from '../../../firebase.init';
import auth from "../../src/firebase.init"
// import Loading from '../Shared/Loading';

const Signup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const [updateProfile, updating, dError] = useUpdateProfile(auth);
    const [
        createUserWithEmailAndPassword,
        cUser,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();

    const from = location.state?.from?.pathname || '/';

    const onSubmit = async data => {
        await createUserWithEmailAndPassword(data.email, data.password);
        await updateProfile({ displayName: data.name });
        const email = data.email;
        const user = {
            name: data.name,
            email: data.email
        }
        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token && user) {
                    fetch('http://localhost:4000/user', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ user })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if(data.acknowledged){
                                navigate(from, { replace: true });
                            }
                            window.location.reload()
                        });
                }
                localStorage.setItem('accessToken', data.accessToken)
            });
    }

    if (loading || gLoading || updating) {
        // return <Loading></Loading>
    }

    let signUpError;
    if (error || gError || dError) {
        signUpError = <p className='text-red-600'><small>{error?.message || gError?.message || dError?.message}</small></p>
    }

    if (cUser || gUser) {
        const email = gUser?.user?.email;
        const user = {
            name: gUser?.user?.displayName,
            email: gUser?.user?.email
        }
        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    fetch('http://localhost:4000/user', {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ user })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if(data.acknowledged){
                                navigate(from, { replace: true });
                            }
                        });
                }
                localStorage.setItem('accessToken', data.accessToken)
            })
    }
    return (
        <div className='flex mt-10 items-center justify-center'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-bold">Sign Up</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="input input-bordered w-full max-w-xs"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'name is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.name?.type === 'required' && <span className="label-text-alt text-red-600">{errors.name.message}</span>}

                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Email is Required'
                                    },
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                        message: 'Provide a valid Email'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span className="label-text-alt text-red-600">{errors.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-600">{errors.email.message}</span>}

                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Your Password"
                                className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Password is Required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Must be 6 characters or longer'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.password?.type === 'required' && <span className="label-text-alt text-red-600">{errors.password.message}</span>}
                                {errors.password?.type === 'minLength' && <span className="label-text-alt text-red-600">{errors.password.message}</span>}

                            </label>
                        </div>
                        {signUpError}
                        <input className='btn w-full max-w-xs text-white' type="submit" value='Sign Up' />
                    </form>
                    <p><small>Already Have an Account? <Link to='/login' className='text-success'>Please Login</Link></small></p>
                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-outline">Conitnue With Google</button>
                </div>
            </div>
        </div>
    );
};

export default Signup;