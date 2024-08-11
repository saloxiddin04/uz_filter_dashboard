import React, {useState} from 'react';
import {Button, Input} from "../../components";
import AuthLogo from "../../assets/images/AuthLogo";
import {toast} from "react-toastify";
import instance from "../../API";
import {
	oneIdGetUserDetail,
	refreshToken,
	setAccess,
	setAccessToken,
	setLogout,
	setUser
} from "../../redux/slices/auth/authSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

const TwoFactor = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [password, setPassword] = useState('')
	
	const res = JSON.parse(localStorage.getItem('res') ? localStorage.getItem('res') : '[]' || '[]')

	const postTwoFactor = async () => {
		try {
			const headers = {
				"PINORTIN": res?.tin_or_pin ? res.tin_or_pin.toUpperCase() : undefined,
			};
			const response = await instance.post('/accounts/confirm-auth', {password}, {headers})
			if (response.data?.success) {
				await dispatch(setAccess(response?.data?.access))
				console.log(response)
				// dispatch(setAccessToken(response?.data?.access))
				dispatch(refreshToken({refresh: response?.data?.refresh, role: response?.data?.role, navigate: navigate}))
				if (response?.data?.role !== 'mijoz') {
					await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
						dispatch(setUser(res))
						navigate('/dashboard')
						// window.location.reload()
					})
				} else {
					toast.success('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
					dispatch(setLogout())
					setPassword('')
				}
			}
		} catch (e) {
			toast.error(e.response.data.err_msg)
		}
	}
	return (
		<div className={'flex justify-center items-center h-screen bg-login-bg'}>
			<div className={'container m-auto w-2/5'}>
				<Input
					type={'password'}
					placeholder={'Parol'}
					value={password || ''}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className={'w-full flex justify-center'}>
					<Button
						text={'Kirish'}
						color={'white'}
						className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
						width={'24'}
						onClick={postTwoFactor}
						disabled={password === '' || password.length <= 7}
					/>
				</div>
				<div className={'flex justify-center mt-5 border-t-white border-t pt-2'}>
          <span className={'text-white'}>
            © Copyright 2022.{" "}
	          <a href="https://unicon.uz/" className={'text-underline underline'} target="_blank" rel="noreferrer">
              UNICON.UZ
            </a>
          </span>
				</div>
				<div className="absolute left-0 bottom-0">
					<AuthLogo/>
				</div>
			</div>
		</div>
	);
};

export default TwoFactor;