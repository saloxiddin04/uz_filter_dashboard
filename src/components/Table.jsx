import React from 'react';
import moment from "moment";
import {EyeIcon} from "@heroicons/react/16/solid";

const Table = ({ headers, data }) => {

  console.log(headers)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-3 py-3"></th>
          {headers && headers.map((header, index) => (
            <th key={index} scope={'col'} className={'px-6 py-3 cursor-pointer'}>
              {header.label}
            </th>
          ))}
          <th scope="col" className="px-6 py-3">
            Boshqarish
          </th>
        </tr>
        </thead>
        <tbody>
          {data.length !== 0 && data?.map((item, index) => (
            <tr
              key={item?.id}
              className={'hover:bg-gray-100 hover:dark:bg-gray-800'}
            >
              <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                {index + 1}
              </td>
              {headers.map((header, idx) => (
                <td key={idx} className="px-6 py-4">
                  {header.key === 'contract_date' && (
                    <>
                      {moment(item[header.key]).format('DD-MM-YYYY')}
                    </>
                  )}
                  {header.key.startsWith('client') && item.client && item.client[header.key.split('.')[1]]}
                  {!header.key.startsWith('contract_date') && item[header.key]}
                </td>
              ))}
              <td className="px-6 py-4">
                <EyeIcon className={'size-10 text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
