import React, {useEffect, useState} from 'react';
import {Button, Input, TabsRender} from "../../components";
import Logo from "../../assets/images/logo";
import AuthLogo from "../../assets/images/AuthLogo";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {api_url, APIS} from "../../config";
import instance from "../../API";
import {HooksCommission} from "../../components/eSign/eSignConfig";
import {
	oneIdGetUserDetail,
	refreshToken,
	setAccess,
	setTinOrPin,
	setUser
} from "../../redux/slices/auth/authSlice";
import {toast} from "react-toastify";

const tabs = [
	{
		title: 'One id',
		active: true
	},
	{
		title: "ERI",
		active: false
	},
	// {
	//   title: "PINFL",
	//   active: false
	// }
];

const Login = () => {
	const {signIn, AppLoad} = HooksCommission()
	
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const [pin_or_tin, setPinOrTin] = useState('')
	const [password, setPassword] = useState('')
	
	const [check, setCheck] = useState(false)
	
	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	
	useEffect(() => {
		if (openTab === 1) {
			AppLoad()
		}
	}, [openTab]);
	
	const login = async () => {
		window.location.href =
			`${api_url}/api/oauth/oneid-login?path=` + window.location.origin
	}
	
	const loginPin = async () => {
		try {
			const response = await instance.post(APIS.customLogin, {pin_or_tin, password})
			instance.defaults.headers.common = {Authorization: `Bearer ${response?.data?.access}`}
			if (response?.data?.success) {
				dispatch(setAccess(response?.data?.access))
				dispatch(refreshToken({refresh: response?.data?.refresh, role: response?.data?.role, navigate: navigate}))
				if (response?.data?.role !== 'mijoz') {
					await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
						await dispatch(setTinOrPin(res?.payload?.pin))
						await dispatch(setUser(res))
						navigate('/dashboard')
						window.location.reload()
					})
				} else {
					setPinOrTin('')
					setPassword('')
				}
			}
		} catch (e) {
			toast.error(e.message)
		}
	}
	
	const loginEri = async () => {
		await instance.get(`${APIS.eriLogin}`).then(({data}) => {
			localStorage.setItem('challenge', data?.challenge)
			signIn()
		})
	}
	
	const renderTypeLogin = (value) => {
		switch (value) {
			case 0:
				return (
					<>
						<div className={'flex justify-center'}>
							<Button
								text={'Kirish'}
								color={'white'}
								className={'bg-[#3C4B64] w-full rounded mt-2 mx-auto text-center disabled:opacity-25'}
								width={'24'}
								onClick={login}
								disabled={!check}
								// disabled={password === '' || password.length <= 7 || pin_or_tin === ''}
							/>
						</div>
					</>
				)
			case 1:
				return (
					<div className={'w-full'}>
						<select
							name="S@loxiddin"
							id="S@loxiddin"
							className="sign w-full px-2 py-2 rounded border-2 border-blue-600 focus:outline-none focus:border-blue-500 mx-auto"
						/>
						<div className={'w-full flex justify-center'}>
							<Button
								text={'Kirish'}
								color={'white'}
								className={'bg-blue-600 w-full rounded mt-2 mx-auto text-center disabled:opacity-25'}
								width={'24'}
								onClick={loginEri}
								disabled={!check}
							/>
						</div>
					</div>
				)
			case 2:
				return (
					<>
						<div className={'mb-2'}>
							<Input
								type={'text'}
								placeholder={'PINFL'}
								value={pin_or_tin || ''}
								onChange={(e) => setPinOrTin(e.target.value)}
							/>
						</div>
						<div>
							<Input
								type={'password'}
								placeholder={'Parol'}
								value={password || ''}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className={'w-full flex justify-center'}>
							<Button
								text={'Kirish'}
								color={'white'}
								className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
								width={'24'}
								onClick={loginPin}
								disabled={password === '' || password.length <= 7 || pin_or_tin === ''}
							/>
						</div>
					</>
				)
			default:
				return null
		}
	}
	
	return (
		<>
			<div className="flex">
				<div className={'flex justify-center items-center h-screen bg-login-bg w-2/4'}>
					<div className={'w-8/12 mx-auto'}>
						<div className="flex justify-center">
							<Logo/>
						</div>
						<div className={'flex justify-center mt-5 border-t-white border-t border-b pt-2 py-4'}>
							<span className="text-white text-center">
                "UNICON.UZ - Fan-texnika va marketing tadqiqotlari markazi" Mas’uliyati cheklangan jamiyatining mijozlarga xizmatlar ko'rsatishga doir jarayonlarni raqamlashtirishga mo'ljallangan avtomatlashtirilgan axborot tizimi
							</span>
						</div>
						<span className={'text-white flex justify-center mt-4'}>
                © Copyright 2022.{" "}
							<a href="https://unicon.uz/" className={'text-underline underline'} target="_blank" rel="noreferrer">
                  UNICON.UZ
              </a>
            </span>
						<div className="absolute left-0 bottom-0">
							<AuthLogo/>
						</div>
					</div>
				</div>
				
				<div className="flex flex-col justify-center items-center h-screen w-2/4">
					<div className="w-8/12 mx-auto">
						<div>
							<div>
								<h3 className="text-4xl">Tizimga kirish</h3>
							</div>
							<div className="flex gap-2 mt-4 items-start border-l-8 border-l-blue-500 pl-3 py-3">
								<input type="checkbox" onChange={(e) => setCheck(e.target.checked)} value={check} defaultChecked={check} className="w-[25px] h-[25px]"/>
								<h2 className="text-xl font-semibold">Shaxsiy ma'lumotlarimni uzatilishiga va tizimdan foydalanish
									shartlariga roziman.</h2>
							</div>
						</div>
						<div className={'flex flex-col justify-center items-center border-b-white border-b pb-2'}>
							{/*<TabsRender*/}
							{/*	tabs={tabs}*/}
							{/*	color={'rgb(59 130 246)'}*/}
							{/*	openTab={openTab}*/}
							{/*	setOpenTab={setOpenTab}*/}
							{/*/>*/}
							
							<div className="flex w-full">
								<ul
									className="flex justify-between mb-0 list-none flex-wrap pt-3 pb-4 flex-row w-full"
									role="tablist"
								>
									<button
										className="-mb-px mr-2 py-2 px-2 text-lg rounded w-[49%] last:mr-0 text-center hover:bg-gray-100 hover:rounded"
										style={{
											backgroundColor: 0 === openTab ? '#3C4B64' : '#fff',
											color: 0 === openTab ? '#fff' : '#000',
											border: 0 === openTab ? `` : '1px solid #3C4B64'
										}}
										onClick={() => setOpenTab(0)}
									>
										One id orqali kirish
									</button>
									<button
										className="-mb-px mr-2 py-2 px-2 text-lg rounded w-[49%] last:mr-0 text-center hover:bg-red-500 hover:text-white hover:rounded"
										style={{
											backgroundColor: 1 === openTab ? 'rgb(37 99 235)' : '#fff',
											color: 1 === openTab ? '#fff' : 'crimson',
											border: 1 === openTab ? `` : '1px solid rgb(37 99 235)'
										}}
										onClick={() => setOpenTab(1)}
									>
										ERI orqali kirish
									</button>
								</ul>
							</div>
						
						</div>
						{renderTypeLogin(openTab)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;