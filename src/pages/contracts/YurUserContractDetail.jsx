import React from 'react';
import {useSelector} from "react-redux";

const YurUserContractDetail = () => {
  const {contractDetail} = useSelector(state => state.contracts)

  return (
    <table className={'w-full'}>
      <tbody className="dark:text-white">
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Yuridik shaxs nomi</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.name}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>STIR</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.tin}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Raxbar</th>
        <td className={'text-center px-2 py-2'}>
          {contractDetail?.client?.director_lastname + ' ' + contractDetail?.client?.director_firstname + ' ' + contractDetail?.client?.director_middlename}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Rahbar stiri</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.director_tin ? contractDetail?.client?.director_tin : '-'}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.mob_phone_no}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Email</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.email}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Viloyat</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.viloyat ? contractDetail?.client?.viloyat : '-'}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Tuman</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.tuman ? contractDetail?.client?.tuman : '-'}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Manzil</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.per_adr}
        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default YurUserContractDetail;