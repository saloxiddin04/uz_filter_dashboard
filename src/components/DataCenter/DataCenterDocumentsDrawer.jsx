import React from 'react';
import {Input} from "../index";
import {useStateContext} from "../../contexts/ContextProvider";

const DataCenterDocumentsDrawer = ({onclose}) => {
	const {currentColor} = useStateContext();
	
	return (
		<div
			className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
			style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
		>
			<div
				className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16">
				<div className="flex flex-col gap-4">
					<button
						className="px-4 py-2 w-[10%] rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
						onClick={onclose}
					>
						Yopish
					</button>
				</div>
				
				<div className="w-full my-4 flex flex-wrap gap-4">
					<div className="w-full">
						<Input label={'Nomlanishi'} />
					</div>
					<div className="w-full">
						<Input label={'Shartnoma sanasi'} />
					</div>
					
					<div className="w-full flex items-center justify-between">
						<button className="py-2 px-1 rounded" style={{border: `1px solid ${currentColor}`, color: currentColor}}>Saqlash</button>
						<button className="py-2 px-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white duration-500">Bekor qilish</button>
					</div>
				</div>
			</div>
		
		</div>
	);
};

export default DataCenterDocumentsDrawer;