import React, {useEffect, useState} from 'react';
import {DetailNav} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {getWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {getAllProducts} from "../../redux/slices/products/productSlice";

const AddProductWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  
  const {loading, warehouse} = useSelector(state => state.warehouse)
  const {products} = useSelector(state => state.product)
  
  const [description, setDescription] = useState(null)
  const [file, setFile] = useState(null)
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
    const updatedProductActions = [...product_actions]
    updatedProductActions.slice(0, index)
    setProductActions(updatedProductActions)
  }
  
  const handleChangeProductActions = (index, field, value) => {
    const updatedProductActions = [...product_actions]
    if (field === 'quantity') {
      updatedProductActions[index][field] = Number(value) || 0
    } else {
      updatedProductActions[index][field] = value
    }
    setProductActions(updatedProductActions)
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
    </div>
    </>
  );
};

export default AddProductWarehouse;