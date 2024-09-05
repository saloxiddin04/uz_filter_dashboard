import React, {useEffect, useState} from 'react';
import {Input, Loader, TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {ArrowPathIcon, EyeIcon, PencilIcon, TrashIcon} from "@heroicons/react/16/solid";
import {BiSearch} from "react-icons/bi";
import {
  createAdmission, deleteAdmission, getAdmissionDetail,
  getAdmissionLetters, getAdmissionSearch,
  getDataCenterList
} from "../../redux/slices/dataCenter/dataCenterSlice";
import instance from "../../API";
import {toast} from "react-toastify";
import {getUserByTin} from "../../redux/slices/contractCreate/FirstStepSlices";
import moment from "moment";
import AdmissionDrawer from "../../components/DataCenter/AdmissionDrawer";

const tabs = [
  {
    title: "Xatlar",
    active: true
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
  const {admissionLetter, admissionEmployee, loading, dataCenterList} = useSelector((state) => state.dataCenter)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
  // const [openTab, setOpenTab] = useState(2);

  const [contract_number, setContractNumber] = useState(null)
  const [contract, setContract] = useState([])
  const [letter_number, setLetterNumber] = useState(null)
  const [letter_date, setLetterDate] = useState(null)
  const [file, setFile] = useState(null)
  const [employees_count, setEmployeesCount] = useState(null)
  const [employees, setEmployees] = useState([
    {
      pin: '',
      pport_no: '',
      per_adr: '',
      mid_name: '',
      sur_name: '',
      name: '',
      admission_type: null,
      admission_time: null,
      data_center: [],
      admission_status: 0,
      additional_info: ''
    }
  ])
  
  const [drawer, setDrawer] = useState(false)
  const [id, setId] = useState(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    if (openTab === 0) {
      dispatch(getAdmissionLetters())
    } else {
      dispatch(getDataCenterList())
    }
  }, [openTab]);
  
  useEffect(() => {
    if (id && drawer) {
      dispatch(getAdmissionDetail(id))
    }
  }, [id, drawer]);

  const handleAddEmployee = () => {
    const employee = [...employees, {
      pin: '',
      pport_no: '',
      per_adr: '',
      mid_name: '',
      sur_name: '',
      name: '',
      admission_type: null,
      admission_time: null,
      data_center: [],
      admission_status: 0,
      additional_info: ''
    }]
    if (employees.length !== Number(employees_count)) {
      setEmployees(employee)
    }
  }

  const handleDeleteEmployee = (i) => {
    const value = [...employees]
    value.splice(i, 1)
    setEmployees(value)
  }

  const changeEmployee = (e, i) => {
    const {name, value} = e;
    const updatedEmployee = [...employees];
    if (name === 'data_center') {
      const dataCenter = updatedEmployee[i]?.data_center || [];

      if (dataCenter.includes(value)) {
        updatedEmployee[i].data_center = dataCenter.filter((selected) => selected !== value);
        setEmployees(updatedEmployee)
      } else {
        updatedEmployee[i].data_center = [...dataCenter, value];
        setEmployees(updatedEmployee)
      }
    } else {
      updatedEmployee[i] = {
        ...updatedEmployee[i],
        [name]: value,
      };
      setEmployees(updatedEmployee)
    }
  }

  const searchContract = async () => {
    try {
      const response = await instance.get(`dispatcher/admission-search-letters?contract_number=${contract_number}`)
      setContract(response.data)
    } catch (e) {
      return e
    }
  }

  const searchUserPhysics = (index) => {
    console.log(index)
    dispatch(getUserByTin({
      pin: employees[index].pin,
      client: 'fiz',
      passport_ce: employees[index].pport_no
    })).then((res) => {
      setEmployees((prevState) => {
        const updatedEmployees = [...prevState];
        const updatedEmployee = {...updatedEmployees[index]};

        updatedEmployee.name = res?.payload?.first_name ?? '';
        updatedEmployee.per_adr = res?.payload?.per_adr ?? '';
        updatedEmployee.mid_name = res?.payload?.mid_name ?? '';
        updatedEmployee.sur_name = res?.payload?.sur_name ?? '';

        updatedEmployees[index] = updatedEmployee;
        return updatedEmployees;
      });
    });
  }

  const handleValidate = () => {
    for (const currentEmployee of employees) {
      if (
        !contract || !contract_number || !letter_number || !letter_date || !file || !employees_count ||
        !currentEmployee?.pin || !currentEmployee?.pport_no || !currentEmployee?.per_adr || !currentEmployee?.mid_name || !currentEmployee?.sur_name ||
        !currentEmployee?.name || currentEmployee?.admission_type === null || currentEmployee?.admission_time === null || currentEmployee.data_center.length === 0
      ) {
        return true
      }
    }

    return false
  }

  const clearData = () => {
    setContractNumber(null)
    setContract([])
    setLetterNumber(null)
    setLetterDate(null)
    setFile(null)
    setEmployeesCount(null)
    setEmployees([
      {
        pin: '',
        pport_no: '',
        per_adr: '',
        mid_name: '',
        sur_name: '',
        name: '',
        admission_type: null,
        admission_time: null,
        data_center: [],
        admission_status: 0,
        additional_info: ''
      }
    ])
  }

  const create = async () => {
    const data = {
      contract: contract[0]?.id,
      letter_number,
      letter_date: new Date(letter_date)?.toISOString(),
      admission_status: 0,
      file,
      employee_count: employees_count,
      employees: JSON.stringify(employees)
    }
    await dispatch(createAdmission(data)).then((res) => {
      if (res?.payload?.status === 201) {
        toast.success("Muvofaqqiyatli yaratildi")
        setOpenTab(0)
        clearData()
      } else {
        toast.error("Xatolik")
        return
      }
    })
  }

  const deleteAdmissions = (id) => {
    dispatch(deleteAdmission(id)).then(() => {
      dispatch(getAdmissionLetters())
    })
  }

  const displayStep = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="flex items-end gap-4">
              <div className={'w-2/5'}>
                <Input
                  label={'Shartnoma raqami'}
                  placeholder={'Shartnoma raqami'}
                  type={'text'}
                  value={contract_number || ''}
                  onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
                />
              </div>
              <div className="flex items-end gap-4">
                <button
                  className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                  style={{border: `1px solid ${currentColor}`}}
                  disabled={!contract_number}
                  onClick={() => dispatch(getAdmissionSearch({contract_number}))}
                >
                  <BiSearch className="size-6" color={currentColor}/>
                </button>
                <button
                  className={`px-2 py-1.5 rounded border text-center`}
                  style={{borderColor: currentColor}}
                  onClick={() => {
                    dispatch(getAdmissionLetters())
                    setContractNumber('')
                  }}
                >
                  <ArrowPathIcon className="size-6" fill={currentColor}/>
                </button>
              </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Tashkilot</th>
                <th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
                <th scope="col" className="px-8 py-3">Shartnoma raqami</th>
                <th scope="col" className="px-8 py-3">Xat raqami</th>
                <th scope="col" className="px-6 py-3">Xat sanasi</th>
                <th scope="col" className="px-6 py-3">Xat holati</th>
                <th scope="col" className="px-6 py-3">Xodim soni</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              {admissionLetter && admissionLetter?.map((item, index) => (
                <tr
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
                  key={item?.id}
                >
                  <td scope="row" className="px-6 py-4 font-medium border-b-1">
                    {index + 1}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.client?.name}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.client?.pin_or_tin}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.contract}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.letter_number}
                  </td>
                  <td className={'px-4 py-2'}>
                    {moment(item?.letter_date).format('DD-MM-YYYY')}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.admission_status === 0 ? <span className="text-green-400">Aktiv</span> :
                      <span className="text-red-400">No Aktiv</span>}
                  </td>
                  <td className={'px-4 py-2'}>
                    {item?.employee_count}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
                      <EyeIcon
                        style={{color: currentColor}}
                        className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
                        onClick={() => {
                          setId(item?.id)
                          setDrawer(true)
                          setType('get')
                        }}
                      />
                    </button>
                    <button className="rounded border-yellow-500 border p-1">
                      <PencilIcon
                        className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
                        onClick={() => {
                          setId(item?.id)
                          setDrawer(true)
                          setType('put')
                        }}
                      />
                    </button>
                    <button className="rounded border border-red-500 p-1">
                      <TrashIcon
                        className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}
                        onClick={() => deleteAdmissions(item?.id)}
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
            <div className="flex items-end gap-4">
              <div className={'w-2/5'}>
                <Input
                  label={'Shartnoma raqami'}
                  placeholder={'Shartnoma raqami'}
                  type={'text'}
                  value={contract_number || ''}
                  onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
                />
              </div>
              <button
                className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                style={{border: `1px solid ${currentColor}`}}
                disabled={!contract_number}
                onClick={searchContract}
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
                  value={contract[0]?.client?.name || ''}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'STIR/JShShIR'}
                  placeholder={'STIR/JShShIR'}
                  type={'text'}
                  disabled={true}
                  value={contract[0]?.client?.pin_or_tin || ''}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'Xat raqami'}
                  placeholder={'Xat raqami'}
                  type={'text'}
                  value={letter_number || ''}
                  onChange={(e) => setLetterNumber(e.target.value)}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={'Xat sanasi'}
                  placeholder={'Xat sanasi'}
                  type={'date'}
                  value={letter_date || ''}
                  onChange={(e) => setLetterDate(e.target.value)}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Xat bo'yicha mutahassislar soni"}
                  placeholder={"Xat bo'yicha mutahassislar soni"}
                  type={'text'}
                  value={employees_count || ''}
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setEmployeesCount(e.target.value);
                    }
                  }}
                />
              </div>
              <div className={'w-[49%]'}>
                <Input
                  label={"Xat biriktirish"}
                  placeholder={"Xat biriktirish"}
                  type={'file'}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {employees?.map((item, index) => (
              <div key={index} className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed">
                <div className="w-full flex items-end gap-4 justify-between">
                  <div className={'w-8/12 flex items-end gap-4'}>
                    <div className={'w-9/12'}>
                      <Input
                        label={'Passport malumotlari'}
                        placeholder={'Passport seriyasi va raqami'}
                        type={'text'}
                        value={item.pport_no || ''}
                        onChange={(e) => changeEmployee({
                          value: e.target.value?.toString()?.toUpperCase(),
                          name: "pport_no"
                        }, index)}
                      />
                    </div>
                    <div className={'w-10/12'}>
                      <Input
                        label={''}
                        placeholder={'JShIShIR'}
                        value={item?.pin || ""}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            changeEmployee({value: e.target.value.slice(0, 14), name: "pin"}, index)
                          }
                        }}
                        type={'text'}
                      />
                    </div>
                    <button
                      className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
                      style={{border: `1px solid ${currentColor}`}}
                      disabled={!item?.pin || !item?.pport_no}
                      onClick={() => searchUserPhysics(index)}
                    >
                      <BiSearch className="size-6" color={currentColor}/>
                    </button>
                  </div>
                  <button
                    disabled={employees.length === 1} onClick={() => handleDeleteEmployee(index)}
                    className="rounded px-4 py-1.5 mt-5 border border-red-500 disabled:opacity-25"
                  >
                    <TrashIcon className="size-6" color={'rgb(239 68 68)'}/>
                  </button>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={"Ism"}
                    placeholder={"Ism"}
                    type={'text'}
                    value={item?.name || ''}
                    onChange={(e) => changeEmployee({value: e.target.value, name: "name"}, index)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={"Familiya"}
                    placeholder={"Familiya"}
                    type={'text'}
                    value={item?.sur_name || ''}
                    onChange={(e) => changeEmployee({
                      value: e.target.value?.toString()?.toUpperCase(),
                      name: "sur_name"
                    }, index)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={"Otasining ismi"}
                    placeholder={"Otasining ismi"}
                    type={'text'}
                    value={item?.mid_name || ''}
                    onChange={(e) => changeEmployee({
                      value: e.target.value?.toString()?.toUpperCase(),
                      name: "mid_name"
                    }, index)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={"Yashash joyi"}
                    placeholder={"Yashash joyi"}
                    type={'text'}
                    value={item?.per_adr || ""}
                    onChange={(e) => changeEmployee({
                      value: e.target.value?.toString()?.toUpperCase(),
                      name: "per_adr"
                    }, index)}
                  />
                </div>
                <div className={'w-[49%] flex flex-col'}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Ruxsatnoma turi
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 2 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
                      style={{
                        background: item?.admission_type === 2 ? currentColor : ''
                      }}
                      onClick={() => changeEmployee({value: 2, name: 'admission_type'}, index)}
                    >
                      Qurilmalarni olib kirish/chiqish
                    </div>
                    <div
                      className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
                      style={{
                        background: item?.admission_type === 1 ? currentColor : ''
                      }}
                      onClick={() => changeEmployee({value: 1, name: 'admission_type'}, index)}
                    >
                      Faqat kirish
                    </div>
                    <div
                      className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_type === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
                      style={{
                        background: item?.admission_type === 0 ? currentColor : ''
                      }}
                      onClick={() => changeEmployee({value: 0, name: 'admission_type'}, index)}
                    >
                      Ekskursiya
                    </div>
                  </div>
                </div>
                <div className={'w-[49%] flex flex-col'}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Ruxsatnoma vaqti
                  </label>
                  <div className="flex items-center gap-2 py-1.5 px-2">
                    <div
                      className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_time === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
                      style={{
                        background: item?.admission_time === 0 ? currentColor : ''
                      }}
                      onClick={() => changeEmployee({value: 0, name: 'admission_time'}, index)}
                    >
                      9:00 - 18:00
                    </div>
                    <div
                      className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_time === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
                      style={{
                        background: item?.admission_time === 1 ? currentColor : ''
                      }}
                      onClick={() => changeEmployee({value: 1, name: 'admission_time'}, index)}
                    >
                      Kecha-kunduz
                    </div>
                  </div>
                </div>
                <div className={'w-[49%] flex flex-col'}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Data markaz
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dataCenterList && dataCenterList?.map((option) => (
                      <div
                        key={option?.id}
                        className={`px-4 py-2 border rounded cursor-pointer 
                        ${item?.data_center.includes(option?.id) ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                      `}
                        style={{
                          background: item?.data_center.includes(option?.id) ? currentColor : ''
                        }}
                        onClick={() => changeEmployee({value: option?.id, name: "data_center"}, index)}
                      >
                        {option?.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="device_name"
                  >
                    Izoh
                  </label>
                  <textarea
                    value={item?.additional_info || ''}
                    onChange={(e) => changeEmployee({value: e.target.value, name: "additional_info"}, index)}
                    name="additional_info"
                    id="additional_info"
                    cols="30"
                    rows="10"
                    className="w-full rounded outline-none border p-2"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={handleAddEmployee} className="px-4 py-2 text-white rounded disabled:opacity-25"
                style={{background: currentColor}}
                disabled={!employees_count || employees.length === Number(employees_count)}
              >
                Qo'shish
              </button>
            </div>
            <div className="w-full flex items-center justify-between">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={clearData}
                >
                  Bekor qilish
                </button>
              </div>
              <button
                className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                style={{backgroundColor: currentColor}}
                onClick={create}
                disabled={handleValidate()}
              >
                Saqlash
              </button>
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
      <div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        {displayStep(openTab)}
      </div>
      {drawer && (
        <AdmissionDrawer
          id={id}
          type={type}
          onclose={() => {
            setDrawer(false)
            setId(null)
          }}
        />
      )}
    </>
  );
};

export default AdmissionDataCenter;