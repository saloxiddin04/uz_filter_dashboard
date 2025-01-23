import React, {useEffect, useState} from 'react';
import {Button, DetailNav, Input} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {toast} from "react-toastify";
import {fileUpload} from "../../../redux/slices/utils/category/categorySlice";
import {createBrand, getBrand, updateBrand} from "../../../redux/slices/utils/brands/brandSlice";

const CreateBrand = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor} = useStateContext();
	const {id} = useParams()

	const {loading, brand} = useSelector((state) => state.brand)

	const [name, setName] = useState(null);
	const [image, setImage] = useState(null)
	
	useEffect(() => {
		if (id !== ":id") {
			dispatch(getBrand({id})).then(({payload}) => {
				setName(payload?.name)
				setImage(payload?.image?.startsWith('http') ? undefined : payload?.image)
			})
		}
	}, [id]);
	
	const postBrand = () => {
		if (id !== ":id") {
			if (!name) return toast.error('Name is required')
			
			dispatch(updateBrand({id, data: {name, image}})).then(({payload}) => {
				if (payload?.id) {
					toast.success('Brand updated successfully!')
					setName(null)
					setImage(null)
					navigate('/brands')
				}
			})
		} else {
			if (!name) return toast.error('Name is required')
			
			dispatch(createBrand({name, image})).then(({payload}) => {
				if (payload?.id) {
					toast.success('Brand created successfully!')
					setName(null)
					setImage(null)
					navigate('/brands')
				}
			})
		}
	}

	const handleFileUpload = (e) => {
		const file = e.target.files[0]

		if (!file) {
			return toast.error('No file selected')
		}

		const formData = new FormData()
		formData.append('file', file)
		dispatch(fileUpload(formData)).then(({payload}) => {
			if (payload?.id) {
				setImage(payload?.id)
			}
		})
	}

	return (
		<>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <DetailNav
	        id={id !== ':id' ? brand?.id : ''}
	        name={id !== ':id' ? brand?.name : ''}
	        status={''}
        />
       </div>

      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <Input
	        value={name || ""}
	        onChange={(e) => setName(e.target.value)}
	        label="Brand Name"
	        type="text"
	        className="w-full mb-4"
        />
        <Input
          onChange={(e) => handleFileUpload(e)}
          label="Brand Icon"
          type="file"
          className="w-full mb-4"
          accept=".jpg,.jpeg"
        />
	      {id !== ':id' && brand?.image && (
		      <img loading="lazy" className="w-20 aspect-auto" src={brand?.image} alt="img"/>
	      )}
        <Button
	        text={loading ? 'Loading...' : (id !== ':id' ? "Update Brand" : "Create Brand")}
          style={{backgroundColor: currentColor}}
          className="text-white rounded flex ml-auto"
          onClick={postBrand}
        />
      </div>
    </>
	);
};

export default CreateBrand;