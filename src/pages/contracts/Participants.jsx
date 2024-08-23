import React from 'react';
import moment from "moment";
import {useSelector} from "react-redux";

const Participants = () => {
  const {contractDetail} = useSelector(state => state.contracts);

  return (
    <>
      {contractDetail?.participants?.map((el, idx) => (
        <table key={idx} className={'w-full mb-8 border'}>
          <tbody>
          <tr
            className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
            <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>
              {el?.role}
            </th>
            <td
              className={`${el?.agreement_status !== 'Kelishildi' ? 'text-dark' : 'bg-green-400 text-white'} text-center`}>
              {el?.agreement_status}
            </td>
          </tr>
          <tr
            className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
            <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Izoh</th>
            <td className={`text-center px-2 py-2`}>
              {el.expert_summary?.comment ? el.expert_summary?.comment : '-'}
            </td>
          </tr>
          <tr
            className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
            <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Muddat</th>
            <td className={`text-center px-2 py-2`}>
              {moment(contractDetail?.contract?.contract_date).format(
                'DD.MM.YYYY',
              )}
              {' '}
              -
              {' '}
              {moment(contractDetail.contract.contract_date)
                .add(1, 'days')
                .format('DD.MM.YYYY')}
              <br/>1 ish kuni
            </td>
          </tr>
          <tr
            className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
            <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Xulosa berdi</th>
            <td className={`text-center px-2 py-2`}>
              {el?.expert_summary ? el?.userdata?.full_name : '-'}
              <br/>
              {el?.date ? moment(el?.date).format('DD.MM.YYYY HH:mm:ss') : ''}
            </td>
          </tr>
          <tr
            className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
            <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon</th>
            <td className={`text-center px-2 py-2`}>
              {el.userdata?.mob_phone_no}
            </td>
          </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};

export default Participants;