import React from 'react';
import {useStateContext} from "../../contexts/ContextProvider";

const CreateTechHelpConfirm = ({onclose, confirm}) => {
	const {currentColor} = useStateContext();
	
	return (
		<>
			<div
				className="fixed top-0 right-0 w-full h-screen flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]"
				style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
			>
				<div
					className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-2/4 py-8 px-16"
				>
					<div className="w-full h-full flex-wrap flex items-center justify-center">
						<h1 className="dark:text-white text-center text-2xl w-2/4">
							Kiritilgan ma'lumotlarni tahrirlash imkoniyati cheklanganligi sababli, qayta tekshirib ko'rishingizni
							so'raymiz. Ma'lumotlarni tasdiqlaysizmi?
						</h1>
						<div className="w-full flex justify-between items-center">
							<button
								className={`px-4 py-2 rounded border border-red-500 text-red-500`}
								onClick={onclose}
							>
								Yopish
							</button>
							<button
								className={`px-4 py-2 rounded text-white disabled:opacity-25`}
								style={{backgroundColor: currentColor}}
								onClick={confirm}
							>
								Saqlash
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateTechHelpConfirm;