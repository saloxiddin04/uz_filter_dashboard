import React from 'react';
import {useSelector} from "react-redux";

const YurUserApplicationDetail = () => {
  const {applicationDetail} = useSelector(state => state.applications)

  return (
    <table className={'w-full'}>
      <tbody>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Yuridik shaxs nomi</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.name}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>STIR</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.tin}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Raxbar</th>
        <td className={'text-center px-2 py-2'}>
          {applicationDetail?.user?.director_lastname + ' ' + applicationDetail?.user?.director_firstname + ' ' + applicationDetail?.user?.director_middlename}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Rahbar stiri</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.director_tin ? applicationDetail?.user?.director_tin : '-'}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.mob_phone_no}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Email</th>
        <td
          className={'text-center px-2 py-2'}>{applicationDetail?.user?.email}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Viloyat</th>
        <td
          className={'text-center px-2 py-2'}>{applicationDetail?.user?.viloyat ? applicationDetail?.user?.viloyat : '-'}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Tuman</th>
        <td
          className={'text-center px-2 py-2'}>{applicationDetail?.user?.tuman ? applicationDetail?.user?.tuman : '-'}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Manzil</th>
        <td
          className={'text-center px-2 py-2'}>{applicationDetail?.user?.per_adr}
        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default YurUserApplicationDetail;