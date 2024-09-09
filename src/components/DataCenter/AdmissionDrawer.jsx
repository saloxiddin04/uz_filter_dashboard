import React from 'react';
import {useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {Input, Loader} from "../index";
import moment from "moment";

const AdmissionDrawer = ({onclose, type}) => {

	const {currentColor} = useStateContext();
	
	const {loading, admissionLetterDetail, dataCenterList} = useSelector(state => state.dataCenter)
	
	return (
		<div
			className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
			style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
		>
			<div
				className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16"
			>
				<div className="flex flex-col gap-4">
					<button
						className="px-4 py-2 w-[10%] rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
						onClick={onclose}
					>
						Yopish
					</button>
				</div>

				{loading ? <Loader /> : (
					<>
						{type === 'get' && (
							<>
								<div className="font-bold text-center">Shartnoma maʼlumotlari</div>
								<div className="my-4 flex justify-between">
									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div className="showRack_rackBlock-infoBody-contractInfo_block_title">
											{/*<ContractIcon />*/}
											<span className="font-bold">Shartnoma</span>
										</div>
										<div className={'w-full flex items-end gap-4'}>
											<div className={'w-full'}>
												<Input
													value={admissionLetterDetail?.contract || ''}
													label={'Shartnoma raqami'}
													disabled={true}
													type={'text'}
												/>
											</div>
										</div>
										<div className="w-full">
											<Input
												label={'STIR/JShShIR'}
												value={admissionLetterDetail?.client?.pin_or_tin || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={"Xat bo'yicha xodim soni"}
												value={admissionLetterDetail?.employee_count || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
									</div>

									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div>
											<span className="font-bold">Mijoz</span>
										</div>
										<div className="w-full">
											<Input
												label={'F.I.SH'}
												value={admissionLetterDetail?.client?.name || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat raqami'}
												value={admissionLetterDetail?.letter_number || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat sanasi'}
												value={moment(admissionLetterDetail?.letter_date).format('DD-MM-YYYY') || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
									</div>
								</div>
								<div className="w-full flex flex-wrap gap-4 rounded border p-4">
									<div>
										<span className="font-bold">Xodim</span>
									</div>

									{admissionLetterDetail?.employees?.map((item, index) => (
										<div key={index} className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed">
											<div className="w-full flex items-end gap-4 justify-between">
												<div className={'w-full flex items-end justify-between gap-4'}>
													<div className={'w-[49%]'}>
														<Input
															label={'Passport malumotlari'}
															placeholder={'Passport seriyasi va raqami'}
															type={'text'}
															value={item.pport_no || ''}
															disabled={true}
														/>
													</div>
													<div className={'w-[49%]'}>
														<Input
															label={''}
															placeholder={'JShIShIR'}
															value={item?.pin || ""}
															disabled={true}
															type={'text'}
														/>
													</div>
												</div>
											</div>
											<div className={'w-full'}>
												<Input
													label={"Ism"}
													placeholder={"Ism"}
													type={'text'}
													value={item?.name || ''}
													disabled={true}
												/>
											</div>
											<div className={'w-full flex flex-col'}>
												<label
													className="block text-gray-700 text-sm font-bold mb-1 ml-3"
													htmlFor="device_name"
												>
													Ruxsatnoma turi
												</label>
												<div className="flex items-center gap-2">
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 2 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_type === 2 ? currentColor : ''
														}}
													>
														Qurilmalarni olib kirish/chiqish
													</div>
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_type === 1 ? currentColor : ''
														}}
													>
														Faqat kirish
													</div>
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_type === 0 ? currentColor : ''
														}}
													>
														Ekskursiya
													</div>
												</div>
											</div>
											<div className={'w-[49%] flex flex-col'}>
												<label
													className="block text-gray-700 text-sm font-bold mb-1 ml-3"
													htmlFor="device_name"
												>
													Ruxsatnoma vaqti
												</label>
												<div className="flex items-center gap-2 py-1.5">
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_time === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_time === 0 ? currentColor : ''
														}}
													>
														9:00 - 18:00
													</div>
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_time === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_time === 1 ? currentColor : ''
														}}
													>
														Kecha-kunduz
													</div>
												</div>
											</div>
											<div className={'w-[49%] flex flex-col'}>
												<label
													className="block text-gray-700 text-sm font-bold mb-1 ml-3"
													htmlFor="device_name"
												>
													Data markaz
												</label>
												<div className="flex flex-wrap gap-2">
													{dataCenterList && dataCenterList?.map((option) => (
														<div
															key={option?.id}
															className={`px-4 py-2 border rounded cursor-pointer 
                        ${item?.data_center.includes(option?.id) ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                      `}
															style={{
																background: item?.data_center.includes(option?.id) ? currentColor : ''
															}}
														>
															{option?.name}
														</div>
													))}
												</div>
											</div>
											<div className="w-full">
												<label
													className="block text-gray-700 text-sm font-bold mb-1 ml-3"
													htmlFor="device_name"
												>
													Izoh
												</label>
												<textarea
													value={item?.additional_info || ''}
													disabled={true}
													name="additional_info"
													id="additional_info"
													cols="30"
													rows="10"
													className="w-full rounded outline-none border p-2"
												/>
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AdmissionDrawer;