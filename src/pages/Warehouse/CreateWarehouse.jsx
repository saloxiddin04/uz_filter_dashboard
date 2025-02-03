import React, {useEffect, useState} from 'react';
import {Button, DetailNav, Input} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {useNavigate, useParams} from "react-router-dom";
import {getAllUsers} from "../../redux/slices/users/usersSlice";
import {toast} from "react-toastify";
import {createWarehouse, getWarehouse, updateWarehouse} from "../../redux/slices/warehouse/warehouseSlice";

const CreateWarehouse = () => {
  const dispatch = useDispatch()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  const navigate = useNavigate()
  
  const {warehouse, loading} = useSelector(state => state.warehouse)
  const {users} = useSelector(state => state.users)
  
  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])
  
  const [warehouse_manager, setWarehouseManager] = useState(null)
  const [name, setName] = useState(null)
  const [address, setAddress] = useState(null)
  const [phone_number, setPhoneNumber] = useState(null)
  
  useEffect(() => {
    if (id !== ':id') {
      dispatch(getWarehouse(id)).then(({payload}) => {
        setWarehouseManager(payload?.warehouse_manager?.id)
        setName(payload?.name)
        setAddress(payload?.address)
        setPhoneNumber(payload?.phone_number)
      })
    }
  }, [id, dispatch])
  
  const validate = () => {
    if (!warehouse_manager || !name || !address || !phone_number) {
      toast.error('Все поля обязательны')
      return false
    }
    
    return true
  }
  
  const postWarehouse = () => {
    if (!validate()) return;
    
    if (id === ':id') {
      dispatch(createWarehouse({warehouse_manager, name, address, phone_number})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Создано успешно')
          navigate('/warehouse')
          setWarehouseManager(null)
          setName(null)
          setAddress(null)
          setPhoneNumber(null)
        }
      })
      .catch(() => {
        return toast.error("Ошибка")
      })
    } else {
      const data = {
        warehouse_manager, name, address, phone_number
      }
      dispatch(updateWarehouse({id, data})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Изменено успешно')
          navigate('/warehouse')
          setWarehouseManager(null)
          setName(null)
          setAddress(null)
          setPhoneNumber(null)
        }
      })
      .catch(() => {
        return toast.error("Ошибка")
      })
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
        <div className="flex flex-col">
          <label
            htmlFor="employee"
            className="block text-gray-700 text-sm font-bold mb-2 ml-3">Сотрудник</label>
          <select
            value={warehouse_manager || ""}
            onChange={(e) => setWarehouseManager(e.target.value)}
            className={`w-full border rounded py-1.5 px-3 shadow`}
            id="employee"
          >
            <option value={null}>Выбирать...</option>
            {users && users?.map((item) => (
              <option
                value={item?.id}
                key={item?.id}>{item?.first_name} / {item?.last_name} / {item?.phone_number}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col my-4">
          <Input
            type="text"
            placeholder="Название склада"
            label={'Название склада'}
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className={'w-full'}
          />
        </div>
        
        <div className="flex flex-col">
          <Input
            type="text"
            placeholder="Адрес склада"
            label={'Адрес склада'}
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
            className={'w-full'}
          />
        </div>
        
        <div className="flex flex-col my-4">
          <Input
            type="text"
            placeholder="Телефон склада"
            label={'Телефон склада'}
            value={phone_number || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={'w-full'}
          />
        </div>
        
        <div className="w-full flex">
          <Button
            text={loading ? 'Загрузка...' : (id !== ':id' ? "Обновить склад" : "Создать склад")}
            style={{backgroundColor: currentColor}}
            className="text-white rounded flex ml-auto disabled:opacity-25"
            onClick={postWarehouse}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default CreateWarehouse;