import React from 'react';
import {useSelector} from "react-redux";
import moment from "moment/moment";

const FizUserContractDetail = () => {
  const {contractDetail} = useSelector(state => state.contracts)

  return (
    <table className={'w-full'}>
      <tbody>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>F. I. Sh.</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.full_name}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Tug'ilgan sanasi</th>
        <td className={'text-center px-2 py-2'}>{moment(contractDetail?.client?.birth_date).format('DD.MM.YYYY')}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>STIR</th>
        <td className={'text-center px-2 py-2'}>
          {contractDetail?.client?.tin ? contractDetail?.client?.tin : '-'}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.mob_phone_no}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Email</th>
        <td className={'text-center px-2 py-2'}>{contractDetail?.client?.email}</td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Fuqaroligi</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.ctzn}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Tug'ilgan joyi</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.birth_place}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Passport raqami</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.pport_no}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>JSHSHIR</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.pin}
        </td>
      </tr>
      <tr
        className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
        <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Yashash manzili</th>
        <td
          className={'text-center px-2 py-2'}>{contractDetail?.client?.per_adr}
        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default FizUserContractDetail;