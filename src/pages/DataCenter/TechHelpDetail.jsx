import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TabsWithBack from "../../components/TabsWithBack";
import {useStateContext} from "../../contexts/ContextProvider";
import {Loader} from "../../components";

const tabs = [
	{
		title: "Shartnoma ma'lumotlari",
		active: true
	},
	{
		title: "Fayl",
		active: false
	}
]

const TechHelpDetail = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const {id} = useParams()
	
	const {loading} = useSelector(state => state.dataCenter)
	
	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	
	const displayStep = () => {
		switch (openTab) {
			case 0:
				return (
					<></>
				)
			case 1:
				return (
					<></>
				)
			default:
				return null
		}
	}
	
	return (
		<>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<TabsWithBack
					tabs={tabs}
					color={currentColor}
					openTab={openTab}
					setOpenTab={setOpenTab}
				/>
			</div>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				{loading ? <Loader /> : displayStep()}
			</div>
		</>
	);
};

export default TechHelpDetail;