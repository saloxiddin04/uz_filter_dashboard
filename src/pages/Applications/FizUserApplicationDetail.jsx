import React from 'react';
import {useSelector} from "react-redux";

const FizUserApplicationDetail = () => {
  const {applicationDetail} = useSelector(state => state.applications)

  return (
    <table className={'w-full'}>
      <tbody>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>F. I. Sh.</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.full_name}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon raqami</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.mob_phone_no}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>JShIShIR</th>
        <td className={'text-center px-2 py-2'}>
          {applicationDetail?.user?.pin}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Passport raqami</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.pport_no}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Yashash manzili</th>
        <td
          className={'text-center px-2 py-2'}>{applicationDetail?.user?.per_adr}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Email</th>
        <td className={'text-center px-2 py-2'}>{applicationDetail?.user?.email}</td>
      </tr>
      </tbody>
    </table>
  );
};

export default FizUserApplicationDetail;