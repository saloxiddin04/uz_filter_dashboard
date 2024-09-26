import React, {useState} from 'react';
import {TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {toast} from "react-toastify";
import {BiSearch} from "react-icons/bi";
import {ArrowPathIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import moment from "moment/moment";
import DataCenterDocumentsDrawer from "../../components/DataCenter/DataCenterDocumentsDrawer";

const tabs = [
  {
    title: "Fazalar",
    active: true
  },
  {
    title: "Aktlar",
    active: false
  }
]

const data = [
  {
    id: 1,
    name: 'text',
    code: 'text',
    date: '18-09-2024',
    device_count: 10,
    cloud_count: 10,
    status: 'aktiv'
  }
]

const akt = [
  {
    id: 1,
    name: 'text',
    code: 'text',
    date: '18-09-2024',
    device_count: 10,
    cloud_count: 10,
    status: 'aktiv'
  }
]

const DataCenterDocuments = () => {
  const {currentColor} = useStateContext();
  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  const [addDocumentDrawer, setAddDocumentDrawer] = useState(false)
  
  const stepDisplay = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Nomlanishi</th>
                <th scope="col" className="px-6 py-3">Xujjat raqami</th>
                <th scope="col" className="px-8 py-3">Xujjat sanasi</th>
                <th scope="col" className="px-8 py-3">Infratuzilma qurilmalar soni</th>
                <th scope="col" className="px-6 py-3">Cloud qurilmalar soni</th>
                <th scope="col" className="px-6 py-3">Xolati</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              {data && data?.map((item, index) => (
                <tr
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
                  key={item?.id}
                >
                  <td scope="row" className="px-6 py-4 font-medium border-b-1">
                    {index + 1}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.name}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.code}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.date}
                  </td>
                  <td className={'px-4 py-2 text-center'}>
                    {item?.device_count}
                  </td>
                  <td className={'px-4 py-2 text-center'}>
                    {/*{moment(item?.letter_date).format('DD-MM-YYYY')}*/}
                    {item?.cloud_count}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.status}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
                      <EyeIcon
                        style={{color: currentColor}}
                        className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
                      />
                    </button>
                    <button className="rounded border-yellow-500 border p-1">
                      <PencilIcon
                        className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
                        onClick={() => {
                          // setId(item?.id)
                          // setDrawer(true)
                          // setType('put')
                        }}
                      />
                    </button>
                    <button className="rounded border border-red-500 p-1">
                      <TrashIcon
                        className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        )
      case 1:
        return (
          <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Nomlanishi</th>
                <th scope="col" className="px-6 py-3">Xujjat raqami</th>
                <th scope="col" className="px-8 py-3">Xujjat sanasi</th>
                <th scope="col" className="px-8 py-3">Infratuzilma qurilmalar soni</th>
                <th scope="col" className="px-6 py-3">Cloud qurilmalar soni</th>
                <th scope="col" className="px-6 py-3">Xolati</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              {akt && akt?.map((item, index) => (
                <tr
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
                  key={item?.id}
                >
                  <td scope="row" className="px-6 py-4 font-medium border-b-1">
                    {index + 1}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.name}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.code}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.date}
                  </td>
                  <td className={'px-4 py-2 text-center'}>
                    {item?.device_count}
                  </td>
                  <td className={'px-4 py-2 text-center'}>
                    {/*{moment(item?.letter_date).format('DD-MM-YYYY')}*/}
                    {item?.cloud_count}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.status}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
                      <EyeIcon
                        style={{color: currentColor}}
                        className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
                      />
                    </button>
                    <button className="rounded border-yellow-500 border p-1">
                      <PencilIcon
                        className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
                        onClick={() => {
                          // setId(item?.id)
                          // setDrawer(true)
                          // setType('put')
                        }}
                      />
                    </button>
                    <button className="rounded border border-red-500 p-1">
                      <TrashIcon
                        className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        )
      default:
        return null
    }
  }
  
  return (
    <>
      <div
        className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
      >
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
        <div className="flex items-center justify-end gap-4 w-2/4">
          <div className={'flex flex-col w-[35%]'}>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
              Hujjat kodi
            </label>
            <input
              // value={filterContractNumber || ""}
              // onChange={(e) => setFilterContractNumber(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  // if (!filterContractNumber) {
                  //   toast.error('Shartnoma raqamini kitiring')
                  // } else {
                  //   searchLetters()
                  // }
                }
              }}
              name="amount"
              id="amount"
              type="text"
              className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
            />
          </div>
          <button
            className="rounded px-4 py-1 mt-5 disabled:opacity-25"
            style={{border: `1px solid ${currentColor}`}}
          >
            <BiSearch className="size-6" color={currentColor}/>
          </button>
          <button
            className={`rounded px-4 py-1 mt-5 border text-center`}
            style={{borderColor: currentColor}}
          >
            <ArrowPathIcon className="size-6" fill={currentColor}/>
          </button>
          <button
            className={`rounded px-4 py-1 mt-5 border text-center`}
            style={{backgroundColor: currentColor}}
            onClick={() => setAddDocumentDrawer(!addDocumentDrawer)}
          >
            <PlusIcon className="size-6" fill={'#fff'}/>
          </button>
        </div>
      </div>
      
      <div
        className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
      >
        {stepDisplay(openTab)}
      </div>
      
      {addDocumentDrawer && <DataCenterDocumentsDrawer step={openTab} onclose={() => setAddDocumentDrawer(!addDocumentDrawer)}/>}
    </>
  );
};

export default DataCenterDocuments;