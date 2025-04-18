import React, {useEffect, useState} from 'react';
import {Button, DetailNav, Input} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {addProductWarehouse, getWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {getAllProducts, setLoading} from "../../redux/slices/products/productSlice";
import {TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import {fileUpload} from "../../redux/slices/utils/category/categorySlice";

const AddProductWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  
  const {loading, warehouse} = useSelector(state => state.warehouse)
  const {products} = useSelector(state => state.product)
  
  const [description, setDescription] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [product_actions, setProductActions] = useState([
    {
      warehouse: warehouse?.id,
      product: null,
      product_variant: null,
      quantity: null,
      action_type: 0
    }
  ])

  useEffect(() => {
    dispatch(getWarehouse(id))
    dispatch(getAllProducts({page: 1, page_size: 1000000}))
  }, [id, dispatch])
  
  useEffect(() => {
    if (warehouse) {
      setProductActions([
        {
          warehouse: warehouse.id,
          product: null,
          product_variant: null,
          quantity: null,
          action_type: 0
        }
      ]);
    }
  }, [warehouse]);
  
  const handleAddProductActions = () => {
    setProductActions([
      ...product_actions,
      {
        warehouse: warehouse?.id,
        product: null,
        product_variant: null,
        quantity: null,
        action_type: 0
      }
    ])
  }
  
  const handleDeleteProductActions = (index) => {
    const updatedProductActions = product_actions.filter((_, i) => i !== index)
    setProductActions(updatedProductActions)
  }
  
  const handleChangeProductActions = (index, field, value) => {
    const updatedProductActions = [...product_actions]
    if (field === 'quantity') {
      updatedProductActions[index][field] = Number(value) || 0
    } else {
      updatedProductActions[index][field] = value

      const selectedProduct = products?.result?.find(p => p?.id === value);
      if (selectedProduct) {
        updatedProductActions[index].unit_type = selectedProduct.unit_type;
      }
    }
    setProductActions(updatedProductActions)
  }


  const handleValidate = () => {
    for (let i = 0; i < product_actions.length; i++) {
      const variant = product_actions[i]
      if (!variant.product) {
        toast.error(`Товар ${i+1}: Укажите продукт`)
        return false
      }
      
      if (!variant.product_variant) {
        toast.error(`Товар ${i+1}: Укажите вариант продукта`)
        return false
      }
      
      if (!variant.quantity) {
        toast.error(`Товар ${i+1}: Укажите количество продукта`)
        return false
      }
    }
    
    return true
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return toast.error('No file selected');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'pdf');
    
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
  
  const postProductWarehouse = () => {
    if (!handleValidate()) return;
    
    dispatch(addProductWarehouse({description, file, product_actions, warehouse: warehouse?.id})).then(({payload}) => {
      if (payload?.id) {
        toast.success('Успешно')
        navigate(`/warehouse/products/${warehouse?.id}`)
        setProductActions([
          {
            warehouse: warehouse.id,
            product: null,
            product_variant: null,
            quantity: null,
            action_type: 0
          }
        ]);
        setDescription(undefined)
        setFile(undefined)
      }
    })
  }

  const renderUnitType = (type) => {
    switch (type) {
      case 0:
        return "шт."
      case 1:
        return "миллиметр"
      case 2:
        return "сантиметр"
      case 3:
        return "метр"
      case 4:
        return "квадратсантиметр"
      case 5:
        return "квадратметр"
      default:
        return ""
    }
  }
  
  return (
    <>
      <div className="card">
        <DetailNav
          id={id !== ':id' ? warehouse?.id : ''}
          name={id !== ':id' ? warehouse?.name : ''}
          status={''}
        />
      </div>
      
      <div className="card">
        <div className="mb-6 w-full flex flex-wrap">
          <h2 className="text-lg font-semibold mb-3 w-full">Варианты продукта</h2>
          {product_actions?.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg mb-3 w-full flex flex-wrap">
              <button
                className="text-red-500 hover:underline my-2 border border-red-500 p-2 rounded ml-auto disabled:opacity-25"
                onClick={() => handleDeleteProductActions(index)}
                disabled={product_actions.length === 1}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 gap-4 items-end w-full">
                <div className="flex flex-col">
                  <label htmlFor={`product-${index}`} className="block text-gray-700 text-sm font-bold mb-2 ml-3">
                    Продукт
                  </label>
                  <select
                    value={item?.product || ""}
                    onChange={(e) => {
                      handleChangeProductActions(index, "product", e.target.value)
                    }}
                    className="w-full border rounded py-1.5 px-3 shadow"
                    id={`product-${index}`}
                  >
                    <option value={null}>Select product...</option>
                    {products?.result?.filter((el) => el?.product_type === warehouse?.warehouse_type)?.map((product) => (
                      <option key={product?.id} value={product?.id}>
                        {product?.name} / {product?.category?.name} / {product?.product_type === 0 ? "продукт" : "сырье и материалы"}
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
                    onChange={(e) => handleChangeProductActions(index, "product_variant", e.target.value)}
                    className="w-full border rounded py-1.5 px-3 shadow"
                    id={`variant-${index}`}
                    disabled={!item.product}
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
                    label={`Количество ${renderUnitType(item?.unit_type)}`}
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleChangeProductActions(index, "quantity", e.target.value)
                    }
                    className={'w-full'}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            className="text-white px-4 py-2 rounded-lg mx-auto disabled:opacity-25"
            onClick={() => {
              if (handleValidate()) {
                handleAddProductActions()
              }
            }}
            style={{
              backgroundColor: currentColor
            }}
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
          />
        </div>
        
        <div className="mb-6 w-full flex flex-wrap">
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">Номенклатура продуктов</label>
          <input
            type="file"
            className="block w-full border rounded-lg p-2"
            onChange={(e) => handleFileUpload(e)}
          />
        </div>
        
        <div className="w-full flex">
          <Button
            text={loading ? 'Loading...' : ("Добавить продукт")}
            style={{backgroundColor: currentColor}}
            className="text-white rounded flex ml-auto disabled:opacity-25"
            onClick={postProductWarehouse}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default AddProductWarehouse;