import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {getAllProducts} from "../../redux/slices/products/productSlice";
import {getAllDiscounts} from "../../redux/slices/discounts/discountSlice";
import {toast} from "react-toastify";
import {createAssignment} from "../../redux/slices/discountAssignment/discountAssignmentSlice";
import {Button} from "../../components";

const AssignmentsDrawer = ({id, onclose}) => {
	const dispatch = useDispatch()
	const {currentColor} = useStateContext();
	
	const {loading} = useSelector(state => state.discountAssignment)
	const {discounts} = useSelector(state => state.discount)
	const {products} = useSelector(state => state.product)
	
	useEffect(() => {
		dispatch(getAllProducts())
		dispatch(getAllDiscounts())
		setDiscount(id)
	}, [dispatch])
	
	const [discount, setDiscount] = useState(null)
	const [product, setProduct] = useState(null)
	const [product_variant, setProductVariant] = useState(null)
	const [active, setActive] = useState(true)
	
	const handleValidate = () => {
		if (!product) return toast.error("Требуется товар")
		if (!discount) return toast.error("Требуется скидка")
		if (!product_variant) return toast.error("Требуется тип товара")
	}
	
	const handlePost = () => {
		if (handleValidate()) return;
		
		// if (id === ":id") {
			dispatch(
				createAssignment({
					discount,
					product,
					product_variant,
					active
				})
			).then(({payload}) => {
				if (payload?.id) {
					toast.success("Успешно")
					onclose()
					// navigate('/discounts_assignments')
					setDiscount(null)
					setProduct(null)
					setProductVariant(null)
					setActive(false)
				}
			})
		// }
	}
	
	return (
		<>
			<div
				className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
				style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
			>
				<div
					className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16"
				>
					<div className="flex flex-col gap-4">
						<button
							className="px-4 py-2 w-[15%] rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
							onClick={() => onclose()}
						>
							Закрыт
						</button>
					</div>
					
					<div className="my-6 flex items-center justify-between flex-wrap gap-4">
						<div className="w-full flex flex-col">
							<label htmlFor={`product`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
								Продукт
							</label>
							<select
								value={product || ""}
								onChange={(e) => setProduct(e.target.value)}
								className="w-full border rounded py-1.5 px-3 shadow"
								id={`product`}
							>
								<option value={null}>Выбрать...</option>
								{products?.result?.map((product) => (
									<option key={product?.id} value={product?.id}>
										{product?.name} / {product?.category?.name}
									</option>
								))}
							</select>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor={`variant`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
								Варианты продукта
							</label>
							<select
								value={product_variant || ""}
								onChange={(e) => setProductVariant(e.target.value)}
								className="w-full border rounded py-1.5 px-3 shadow"
								id={`variant`}
								disabled={!product}
							>
								<option value={null}>Выбрать...</option>
								{products?.result?.find((el) => el.id === product)?.product_variants?.map((variant) => (
									<option key={variant?.id} value={variant?.id}>
										{variant?.brand?.name} / {variant?.unique_code} / {variant?.price} so‘m
									</option>
								))}
							</select>
						</div>
						<div className="w-full flex flex-col">
							<label htmlFor={`product`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
								Скидка
							</label>
							<select
								value={discount || ""}
								onChange={(e) => setDiscount(e.target.value)}
								className="w-full border rounded py-1.5 px-3 shadow"
								id={`product`}
								disabled={true}
							>
								<option value={null}>Выбрать...</option>
								{discounts?.result?.map((item) => (
									<option key={item?.id} value={item?.id}>
										{item?.name} / {item?.discount}%
									</option>
								))}
							</select>
						</div>
						<div className="w-full flex flex-col">
							<label
								htmlFor="active"
								className="block text-gray-700 text-sm font-bold mb-2 ml-3">Положения Скидка</label>
							<select
								value={active || ""}
								onChange={(e) => setActive(e.target.value === "true")}
								className={`w-full border rounded py-1.5 px-3 shadow focus:border focus:border-[${currentColor}]`}
								id="active"
							>
								<option value={""}>Выбрать...</option>
								<option value={"true"}>Актив</option>
								<option value={"false"}>Не актив</option>
							</select>
						</div>
					</div>
					
					<div className="w-full flex">
						<Button
							text={loading ? 'Loading...' : "Создать назначения"}
							style={{backgroundColor: currentColor}}
							className="text-white rounded flex ml-auto disabled:opacity-25"
							onClick={handlePost}
							disabled={loading}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AssignmentsDrawer;