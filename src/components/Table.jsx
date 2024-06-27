import React from 'react';
import moment from "moment";

const Table = ({ headers, data }) => {

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
              className={`${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'} border-b dark:border-gray-700`}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {index + 1}
              </th>
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
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
