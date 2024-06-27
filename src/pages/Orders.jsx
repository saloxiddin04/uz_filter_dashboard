import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header} from '../components';
import {getSections} from "../redux/slices/sections/sectionSlice";
import Table from "../components/Table";
import {getContracts} from "../redux/slices/contracts/contractsSlice";
import Loader from "../components/Loader";
import {useStateContext} from "../contexts/ContextProvider";

const Orders = () => {
  const dispatch = useDispatch()
  const { currentColor } = useStateContext();

  const {contracts, loading} = useSelector(state => state.contracts)

  const headers = [
    { key: 'client?.full_name', label: 'Mijoz' },
    { key: 'client?.pin', label: 'STIR/JSHSHIR' },
    { key: 'contract_number', label: 'Shartnoma raqami' },
    { key: 'contract_date', label: 'Shartnoma sanasi' },
    { key: 'expiration_date', label: 'Amal qilish sanasi' },
    { key: 'contract_cash', label: 'Shartnoma qiymati' },
    { key: 'payed_cash', label: "To'langan qiymat" },
    { key: 'arrearage', label: 'Qarzdorlik' },
    { key: 'contract_status', label: 'Status' },
  ];

  useEffect(() => {
    dispatch(getContracts())
    dispatch(getSections())
  }, [dispatch]);

  if (loading) return <Loader/>

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Sahifa" title="Shartnomalar"/>
      <Table headers={headers} data={contracts ? contracts?.result?.all : []}/>
    </div>
  );
};
export default Orders;
