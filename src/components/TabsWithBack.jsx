import React, {useEffect} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {HiArrowUturnUp} from "react-icons/hi2";
import {useStateContext} from "../contexts/ContextProvider";

const Tabs = ({ color, tabs, openTab, setOpenTab, isQuery }) => {
	const {currentColor} = useStateContext();
	const {pathname} = useLocation()
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate()
	
	useEffect(() => {
		if (isQuery) {
			const typeOfDocument = searchParams.get('type_of_document');
			if (typeOfDocument) {
				const index = typeOfDocument === '1' ? 0 : 1;
				setOpenTab(index);
			}
		}
	}, [searchParams, isQuery]);
	
	return (
		<>
			<div className="flex items-center flex-wrap w-full gap-4">
				<div className="cursor-pointer flex flex-col items-center w-[5%] border-r border-gray-200" onClick={() => navigate(-1)}>
					<HiArrowUturnUp style={{color: currentColor}} className="size-6"/>
					<span className={'text-xs mt-1'}>orqaga</span>
				</div>
				<div className="w-2/4">
					<ul
						className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
						role="tablist"
					>
						{tabs && tabs.map((item, idx) => (
							<li key={idx} className="-mb-px mr-2 last:mr-0 text-center hover:bg-gray-100 hover:rounded">
								<a
									className={
										"text-xs font-bold uppercase px-5 py-3 rounded block leading-normal"
									}
									style={{
										// backgroundColor: idx === openTab ? color : '#fff',
										color: idx === openTab ? color : '#ccc',
										borderBottom: idx === openTab ? `1px solid ${color}` : ''
									}}
									onClick={e => {
										e.preventDefault();
										setOpenTab(idx);
										if (pathname === '/application') {
											localStorage.setItem('tabIndex', idx)
										}
										
										if (isQuery) {
											setSearchParams({
												type_of_document: idx === 0 ? 1 : 2,
											});
										}
									}}
									data-toggle="tab"
									href={`#link${idx}`}
									role="tablist"
								>
									{item.title}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default function TabsWithBack({color, tabs, openTab, setOpenTab, isQuery}) {
	return (
		<Tabs color={color} tabs={tabs} openTab={openTab} setOpenTab={setOpenTab} isQuery={isQuery}/>
	);
}
