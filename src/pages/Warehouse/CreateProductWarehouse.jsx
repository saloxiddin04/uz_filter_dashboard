import React, {useEffect} from 'react';
import {Header} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {useStateContext} from "../../contexts/ContextProvider";

const CreateProductWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  
  const {loading, warehouse} = useSelector(state => state.warehouse)
  
  useEffect(() => {
    dispatch(getWarehouse(id))
  }, [id, dispatch])
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title={warehouse?.name} />
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('addProduct')}
        >
          Добавить товар
        </button>
      </div>
    
    </div>
  );
};

export default CreateProductWarehouse;