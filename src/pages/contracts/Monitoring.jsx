import React, {useEffect, useState} from 'react';
import {Button, Input} from "../../components";
import {BiSearch} from "react-icons/bi";
import {getContractDetailBalance} from "../../redux/slices/contracts/contractsSlice";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";

const Monitoring = () => {
  const dispatch = useDispatch()
  const {currentColor} = useStateContext()
  const {contractDetail, contractDetailBalance} = useSelector(state => state.contracts);

  const safeDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date.toISOString().split('T')[0];
  };

  const [beginDateVps, setBeginDateVps] = useState(
    contractDetail ? safeDate(contractDetail?.contract?.contract_date) : ''
  );

  const [endDateVps, setEndDateVps] = useState(
    new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
  );

  const getBalance = () => {
    const dateEndVps = new Date(endDateVps);
    const year = dateEndVps.getFullYear().toString().slice(2);
    const month = (dateEndVps.getMonth() + 1).toString().padStart(2, '0');
    const formattedDateEnd = `${year}${month}`;

    const dateBeginVps = new Date(beginDateVps);
    const yearBegin = dateBeginVps.getFullYear().toString().slice(2);
    const monthBegin = (dateBeginVps.getMonth() + 1).toString().padStart(2, '0');
    const formattedDateBegin = `${yearBegin}${monthBegin}`;

    const data = {
      service: contractDetail?.contract?.service,
      contract: contractDetail?.contract?.id,
      begin_date: formattedDateBegin,
      end_date: formattedDateEnd
    }
    dispatch(getContractDetailBalance(data))
  }

  useEffect(() => {
    getBalance()
  }, [])

  const formatDate = (dateStr) => {
    if (dateStr?.length % 2 !== 0) {
      return dateStr;
    }
    return dateStr.match(/.{1,2}/g).join('.');
  };

  return (
    <>
      <div
        className="m-1 md:mx-8 md:my-4 mt-24 p-2 md:px-2 md:py-2 bg-white dark:bg-secondary-dark-bg rounded flex items-center justify-between">
        <div className={'w-2/4'}>
          <Input
            label={'Sanadan'}
            value={beginDateVps}
            onChange={(e) => setBeginDateVps(e.target.value)}
            type={'date'}
          />
        </div>
        <div className={'w-2/5 flex items-end gap-5'}>
          <div className={'w-full'}>
            <Input
              label={'Sanagacha'}
              value={endDateVps}
              onChange={(e) => setEndDateVps(e.target.value)}
              type={'date'}
            />
          </div>
          <Button
            className={'cursor-pointer'}
            icon={<BiSearch className={`size-7`}
                            style={{color: currentColor, opacity: !beginDateVps || !endDateVps ? 0.5 : 1}}/>}
            onClick={getBalance}
            disabled={!beginDateVps || !endDateVps}
          />
        </div>
      </div>
      <table className={'mt-8 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'}>
        <thead className={'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded'}>
        <tr>
          <th className="px-3 py-3">Oy</th>
          <th className="px-3 py-3">To’langan qiymat</th>
          <th className="px-3 py-3">To’lov</th>
          <th className="px-3 py-3">To’lov (%)</th>
          <th className="px-3 py-3">Sana (yil.oy.sana)</th>
          <th className="px-3 py-3">Invoys</th>
          <th className="px-3 py-3">Balans</th>
        </tr>
        </thead>
        <tbody>
        {contractDetailBalance?.detail && contractDetailBalance?.detail.map((item, index) => (
          <tr className={'hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white'} key={index}>
            <td className={'px-3 py-4 border-b-1'}>{item?.month}</td>
            <td className={'px-3 py-4 border-b-1'}>{item?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so’m</td>
            <td className={'px-3 py-4 border-b-1'}>{item?.pay_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so’m</td>
            <td className={'px-3 py-4 border-b-1'}>{item?.amount_precent}%</td>
            <td className={'px-3 py-4 border-b-1'}>{formatDate(item?.amount_date)}</td>
            <td className={'px-3 py-4 border-b-1'}>{item?.send_invoice === '0' ? 'Yuborilmagan' : 'Yuborilgan'}</td>
            <td className={'px-3 py-4 border-b-1'}>{contractDetailBalance?.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so’m</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
};

export default Monitoring;