import React, {useEffect, useState} from 'react';
import {Header, Input, Loader, TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {EyeIcon, PencilIcon, TrashIcon} from "@heroicons/react/16/solid";
import {BiSearch} from "react-icons/bi";
import {getAdmissionEmployee, getAdmissionLetters} from "../../redux/slices/dataCenter/dataCenterSlice";

const tabs = [
  {
    title: "Xatlar",
    active: true
  },
  {
    title: "Xodimlar",
    active: false
  },
  {
    title: "Ruxsatnoma yaratish",
    active: false
  }
]

const AdmissionDataCenter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {currentColor} = useStateContext();
  const {admissionLetter, admissionEmployee, loading} = useSelector((state) => state.dataCenter)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  useEffect(() => {
    if (openTab === 0) {
      dispatch(getAdmissionLetters())
    } else if (openTab === 1) {
      dispatch(getAdmissionEmployee())
    }
  }, [openTab]);

  const displayStep = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="flex items-end gap-4">
              <div className={'w-2/5'}>
                <Input
                  label={'Tashkilot nomi'}
                  placeholder={'Tashkilot nomi'}
                  type={'text'}
                />
              </div>
              <button
                className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                style={{border: `1px solid ${currentColor}`}}
              >
                <BiSearch className="size-6" color={currentColor}/>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Tashkilot</th>
                <th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
                <th scope="col" className="px-8 py-3">Xat raqami</th>
                <th scope="col" className="px-6 py-3">Xat sanasi</th>
                <th scope="col" className="px-6 py-3">Xat holati</th>
                <th scope="col" className="px-6 py-3">Xodim soni</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              <tr
                className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
              >
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                  {1}
                </td>
                <td className={'px-4 py-2'}>
                  Unicon
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                  <button className="rounded border-yellow-500 border p-1">
                    <PencilIcon
                      className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                  <button className="rounded border border-red-500 p-1">
                    <TrashIcon
                      className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </>
        )
      case 1:
        return (
          <>
            <div className="flex items-end gap-4">
              <div className={'w-2/5'}>
                <Input
                  label={'PINFL'}
                  placeholder={'PINFL'}
                  type={'text'}
                />
              </div>
              <button
                className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                style={{border: `1px solid ${currentColor}`}}
              >
                <BiSearch className="size-6" color={currentColor}/>
              </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">F.I.SH</th>
                <th scope="col" className="px-6 py-3">Pasport</th>
                <th scope="col" className="px-8 py-3">Tashkilot</th>
                <th scope="col" className="px-6 py-3">Ruxsatnoma turi</th>
                <th scope="col" className="px-6 py-3">Kirish vaqti</th>
                <th scope="col" className="px-6 py-3">Holati</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              <tr
                className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
              >
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                  {1}
                </td>
                <td className={'px-4 py-2'}>
                  Unicon
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className={'px-4 py-2'}>
                  123
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                  <button className="rounded border-yellow-500 border p-1">
                    <PencilIcon
                      className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                  <button className="rounded border border-red-500 p-1">
                    <TrashIcon
                      className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}
                      // onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                    />
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </>
        )
      case 2:
        return (
          <>
            <div className="flex items-end gap-4">
              <div className={'w-2/5'}>
                <Input
                  label={'Shartnoma raqami'}
                  placeholder={'Shartnoma raqami'}
                  type={'text'}
                />
              </div>
              <button
                className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                style={{border: `1px solid ${currentColor}`}}
              >
                <BiSearch className="size-6" color={currentColor}/>
              </button>
            </div>
            <div className="flex justify-between flex-wrap gap-4 my-4">
              <div className={'w-[49%]'}>
                <Input
                  label={'Tashkilot nomi'}
                  placeholder={'Tashkilot nomi'}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'STIR/JShShIR'}
                  placeholder={'STIR/JShShIR'}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'Xat raqami'}
                  placeholder={'Xat raqami'}
                  type={'text'}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'Xat sanasi'}
                  placeholder={'Xat sanasi'}
                  type={'date'}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Xat bo'yicha mutahassislar soni"}
                  placeholder={"Xat bo'yicha mutahassislar soni"}
                  type={'text'}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Xat biriktirish"}
                  placeholder={"Xat biriktirish"}
                  type={'file'}
                />
              </div>
            </div>

            <div className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed">
              <div className="w-8/12 flex items-end gap-4">
                <div className={'w-full flex items-end gap-4'}>
                  <div className={'w-2/5'}>
                    <Input
                      label={'Passport malumotlari'}
                      placeholder={'Passport seriyasi va raqami'}
                      type={'text'}
                    />
                  </div>
                  <div className={'w-3/5'}>
                    <Input
                      label={''}
                      placeholder={'JShIShIR'}
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          // setPinfl(e.target.value.slice(0, 14));
                        }
                      }}
                      type={'text'}
                    />
                  </div>
                </div>
                <button
                  className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                  style={{border: `1px solid ${currentColor}`}}
                >
                  <BiSearch className="size-6" color={currentColor}/>
                </button>
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Ism"}
                  placeholder={"Ism"}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Familiya"}
                  placeholder={"Familiya"}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Otasining ismi"}
                  placeholder={"Otasining ismi"}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Yashash joyi"}
                  placeholder={"Yashash joyi"}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                  htmlFor="device_name"
                >
                  Ruxsatnoma turi
                </label>
                <div className="flex items-center border rounded py-1.5 px-2">
                  <input
                    name='device_name'
                    id='device_name'
                    type="checkbox"
                    className="rounded text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Qurilmalarni olib kirish/chiqish
                  </label>
                </div>
                <div className="flex items-center border rounded py-1.5 px-2 my-1">
                  <input
                    name='device_name'
                    id='device_name'
                    type="checkbox"
                    className="rounded text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Faqat kirish
                  </label>
                </div>
                <div className="flex items-center border rounded py-1.5 px-2">
                  <input
                    name='device_name'
                    id='device_name'
                    type="checkbox"
                    className="rounded text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Ekskursiya
                  </label>
                </div>
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                  htmlFor="device_name"
                >
                  Ruxsatnoma vaqti
                </label>
                <div className="flex items-center border rounded py-1.5 px-2">
                  <input
                    name='device_name'
                    id='device_name'
                    type="checkbox"
                    className="rounded text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Kecha-Kunduz
                  </label>
                </div>
                <div className="flex items-center border rounded py-1.5 px-2 my-1">
                  <input
                    name='device_name'
                    id='device_name'
                    type="checkbox"
                    className="rounded text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    9:00 - 18:00
                  </label>
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  if (loading) return <Loader/>

  return (
    <>
      <div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        {displayStep(openTab)}
      </div>
    </>
  );
};

export default AdmissionDataCenter;