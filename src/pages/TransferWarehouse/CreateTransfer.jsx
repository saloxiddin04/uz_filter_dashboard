import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {toast} from "react-toastify";
import {getAllProducts, setLoading} from "../../redux/slices/products/productSlice";
import {fileUpload} from "../../redux/slices/utils/category/categorySlice";
import {createTransfer, getTransfer} from "../../redux/slices/transferWarehouse/transferWarehouseSlice";
import {TrashIcon} from "@heroicons/react/16/solid";
import {Button, Input} from "../../components";

const CreateTransfer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()
  const {currentColor} = useStateContext()
  
  const {products} = useSelector(state => state.product)
  const {warehouses} = useSelector(state => state.warehouse)
  const {loading, transfer} = useSelector(state => state.transfer)
  
  const [from_warehouse, setFromWarehouse] = useState(null)
  const [to_warehouse, setToWarehouse] = useState(null)
  const [description, setDescription] = useState(null)
  const [file, setFile] = useState(null)
  const [configs, setConfigs] = useState([{
    product: null, product_variant: null, quantity: null
  }])
  
  useEffect(() => {
    dispatch(getAllProducts({page: 1, page_size: 1000000}))
  }, [dispatch])
  
  useEffect(() => {
    if (id !== ":id") {
      dispatch(getTransfer({id})).then(({payload}) => {
        setFromWarehouse(payload?.from_warehouse?.id)
        setToWarehouse(payload?.to_warehouse?.id)
        setDescription(payload?.description)
        setFile(payload?.file)
        
        const config = payload?.configs?.map((item) => ({
          product: item?.product?.id,
          product_variant: item?.product_variant?.id,
          quantity: item?.quantity
        }))
        setConfigs(config)
      })
    }
  }, [id, dispatch])
  
  const handleAddConfigs = () => {
    setConfigs([...configs, {
      product: null, product_variant: null, quantity: null
    }])
  }
  
  const handleRemoveConfig = (index) => {
    const updatedConfigs = configs.filter((_, i) => i !== index)
    setConfigs(updatedConfigs)
  }
  
  const handleChangeConfigs = (index, field, value) => {
    const updatedConfigs = [...configs]
    if (field === 'quantity') {
      updatedConfigs[index][field] = Number(value) || 0
    } else {
      updatedConfigs[index][field] = value
    }
    setConfigs(updatedConfigs)
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return toast.error('No file selected');
    }
    
    const formData = new FormData();
    const type = file.name.split('.').pop()
    formData.append('file', file);
    formData.append('type', type);
    
    dispatch(setLoading(true));
    dispatch(fileUpload(formData))
      .then(({payload}) => {
        if (payload?.id) {
          setFile(payload?.id)
          dispatch(setLoading(false));
        }
      })
      .catch(() => {
        dispatch(setLoading(false));
        return toast.error('Something went wrong');
      });
  };
  
  const handleValidate = () => {
    for (const currentConfig of configs) {
      if (!currentConfig.product || !currentConfig.product_variant || !currentConfig.quantity) return true
    }
    return !from_warehouse || !to_warehouse
  }
  
  const postTransfer = () => {
    if (handleValidate()) return;
    
    dispatch(createTransfer({
      from_warehouse, to_warehouse, description, file, configs
    })).then(({payload}) => {
      if (payload?.id) {
        toast.success("Успешно")
        navigate('/transfer')
        setConfigs([{
          product: null, product_variant: null, quantity: null
        }])
        setDescription(null)
        setFile(null)
        setFromWarehouse(null)
        setToWarehouse(null)
      }
    })
  }
  
  return (
    <div className="card">
      <div className="mb-6 w-full flex flex-wrap">
        
        <div className="grid grid-cols-2 gap-4 items-end w-full mb-3">
          <div className="flex flex-col">
            <label htmlFor={`from_warehouse`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
              Со склада
            </label>
            <select
              value={from_warehouse || ""}
              onChange={(e) => setFromWarehouse(e.target.value)}
              className="w-full border rounded py-1.5 px-3 shadow"
              id={`from_warehouse`}
              disabled={id !== ":id"}
            >
              <option value={null}>Выбирай склад...</option>
              {warehouses && warehouses?.filter((el) => el?.id !== to_warehouse)?.map((item) => (
                <option key={item?.id} value={item?.id}>{item?.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor={`to_warehouse`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
              На склад
            </label>
            <select
              value={to_warehouse || ""}
              onChange={(e) => setToWarehouse(e.target.value)}
              className="w-full border rounded py-1.5 px-3 shadow"
              id={`to_warehouse`}
              disabled={id !== ":id"}
            >
              <option value={null}>Выбирай склад...</option>
              {warehouses && warehouses?.filter((el) => el?.id !== from_warehouse)?.map((item) => (
                <option key={item?.id} value={item?.id}>{item?.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-3 w-full">Варианты продукта</h2>
        {configs?.map((item, index) => (<div key={index} className="border p-4 rounded-lg mb-3 w-full flex flex-wrap">
          <button
            className="text-red-500 hover:underline my-2 border border-red-500 p-2 rounded ml-auto disabled:opacity-25"
            onClick={() => handleRemoveConfig(index)}
            disabled={configs.length === 1 || id !== ":id"}
          >
            <TrashIcon className="w-5 h-5"/>
          </button>
          
          <div className="grid grid-cols-1 gap-4 items-end w-full">
            <div className="flex flex-col">
              <label htmlFor={`product-${index}`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
                Продукт
              </label>
              <select
                value={item?.product || ""}
                onChange={(e) => handleChangeConfigs(index, "product", e.target.value)}
                className="w-full border rounded py-1.5 px-3 shadow"
                id={`product-${index}`}
                disabled={id !== ":id"}
              >
                <option value={null}>Select product...</option>
                {products?.result?.map((product) => (
                  <option key={product?.id} value={product?.id}>
                    {product?.name} / {product?.category?.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={`variant-${index}`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
                Варианты продукта
              </label>
              <select
                value={item?.product_variant || ""}
                onChange={(e) => handleChangeConfigs(index, "product_variant", e.target.value)}
                className="w-full border rounded py-1.5 px-3 shadow"
                id={`variant-${index}`}
                disabled={!item.product || id !== ":id"}
              >
                <option value={null}>Select variant...</option>
                {products?.result?.find((product) => product.id === item.product)?.product_variants?.map((variant) => (
                  <option key={variant?.id} value={variant?.id}>
                    {variant?.brand?.name} / {variant?.unique_code} / {variant?.price} so‘m
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <Input
                type="text"
                placeholder="Количество"
                label={'Количество'}
                value={item.quantity || ""}
                onChange={(e) => handleChangeConfigs(index, "quantity", e.target.value)}
                className={'w-full'}
                disabled={id !== ":id"}
              />
            </div>
          </div>
        </div>))}
        <button
          className="text-white px-4 py-2 rounded-lg mx-auto disabled:opacity-25"
          onClick={handleAddConfigs}
          disabled={id !== ":id"}
          style={{backgroundColor: currentColor}}
        >
          Добавить товар
        </button>
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 ml-3">Комментария</label>
        <textarea
          className="w-full border rounded shadow focus:outline-none p-2"
          rows={5}
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          disabled={id !== ":id"}
        />
      </div>
      
      <div className="mb-6 w-full flex flex-wrap">
        {id !== ":id" && file ? (
          <a href={file} target="_blank" download={"download"}
             className="text-blue-400 cursor-pointer underline underline-offset-1">Номенклатура продуктов</a>
        ) : (
          <>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Номенклатура продуктов</label>
            <input
              type="file"
              className="block w-full border rounded-lg p-2"
              onChange={(e) => handleFileUpload(e)}
            />
          </>
        )}
      </div>
      
      {id === ":id" && (
        <div className="w-full flex">
          <Button
            text={loading ? 'Loading...' : ("Передача продуктов")}
            style={{backgroundColor: currentColor}}
            className="text-white rounded flex ml-auto disabled:opacity-25"
            onClick={postTransfer}
            disabled={loading}
          />
        </div>
      )}
      
      {id !== ":id" && (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
          <tr>
            <th scope="col" className="px-3 py-3"></th>
            <th scope="col" className="px-4 py-3">Пользователь-участник</th>
            <th scope="col" className="px-4 py-3">Пользователь-участник тел</th>
            <th scope="col" className="px-4 py-3">Статус</th>
          </tr>
          </thead>
          <tbody>
          {transfer?.participants?.map((item, index) => (
            <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
              <td className={'px-4 py-1'}>
                {index + 1}
              </td>
              <td className={'px-3 py-1'}>
                {item?.participant_user?.first_name}
              </td>
              <td className={'px-3 py-1'}>
                {item?.participant_user?.phone_number}
              </td>
              <td className={'px-3 py-1'}>
                {item?.agreement_status}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreateTransfer;