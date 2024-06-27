import React, {useEffect} from 'react';


import {useDispatch, useSelector} from "react-redux";

import {ordersData, contextMenuItems, ordersGrid} from '../data/dummy';
import {Header} from '../components';
import {getSections} from "../redux/slices/sections/sectionSlice";
import Table from "../components/Table";
import {getContracts} from "../redux/slices/contracts/contractsSlice";
import Loader from "../components/Loader";

const tableHead = [
  'Mijoz',
  'Stir/JSHSHIR',
  'Shartnoma raqami',
  'Shartnoma sanasi',
  'Amal qilish sanasi',
  'Shartnoma qiymati',
  "To'langan qiymat",
  'Qarzdorlik',
  'Status',
  'Boshqarish'
]

const Orders = () => {
  const dispatch = useDispatch()

  const {contracts, loading} = useSelector(state => state.contracts)

  console.log(contracts?.result?.all)

  useEffect(() => {
    dispatch(getContracts())
    dispatch(getSections())
  }, [dispatch]);

  if (loading) return <Loader/>

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders"/>
      <Table head={tableHead} data={contracts?.result?.all}/>
    </div>
  );
};
export default Orders;
