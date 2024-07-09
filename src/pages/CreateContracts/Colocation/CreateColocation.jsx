import React, {useEffect, useRef, useState} from 'react';
import FirstStep from "../FirstStep/FirstStep";
import {Button, Header, Input, Loader} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {
  calculateColocation,
  getDataCenterList,
  getDataCenterTariff
} from "../../../redux/slices/contractCreate/Colocation/ColocationSlices";
import instance from "../../../API";
import {toast} from "react-toastify";
import {TrashIcon} from "@heroicons/react/16/solid";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useNavigate} from "react-router-dom";

const CreateColocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {currentColor} = useStateContext();

  const {dataCenterList, dataCenterTariff, calculate, loading} = useSelector((state) => state.createColocation);
  const {userByTin} = useSelector((state) => state.userByTin);

  const [currentStep, setCurrentStep] = useState(2)

  const [typeContract, setTypeContract] = useState('')

  const [data, setData] = useState([
    {data_center: '', mounting_type: '', amount: '', status: 1, tariff: ''}
  ])
  const [selectedCombinations, setSelectedCombinations] = useState({});
  const [bookedContractDate, setBookedContractDate] = useState(new Date())
  const [contractNumberColocation, setContractNumberColocation] = useState(null)

  useEffect(() => {
    if (currentStep === 2) {
      dispatch(getDataCenterList())
      dispatch(getDataCenterTariff())
    }
  }, [currentStep]);

  useEffect(() => {
    if (!handleValidateForCalculate()) {
      dispatch(calculateColocation({data, check: handleValidateForCalculate()}))
    }
  }, [data]);

  const handleChangeDataColocation = (e, index) => {
    const {name, value} = e.target;
    let newData = [...data];
    newData[index] = {...newData[index], [name]: value};

    if (name === 'amount') {
      newData[index].amount = Number(value)
    }

    let combination = `${newData[index].data_center}-${newData[index].mounting_type}`;
    let newSelectedCombinations = {...selectedCombinations};
    if (name === "mounting_type") {
      let oldCombination = `${newData[index].data_center}-${data[index].mounting_type}`;
      delete newSelectedCombinations[oldCombination];
    }
    newSelectedCombinations[combination] = index;

    setData(newData);
    setSelectedCombinations(newSelectedCombinations);
    // getCalculateColocation(newData)
  };

  const handleDeleteDataColocation = (i) => {
    const deletedData = [...data]
      deletedData.splice(i, 1)
      setData(deletedData)
      getCalculateColocation(deletedData)
  }

  const handleDataAddColocation = () => {
    const abc = [...data, {data_center: '', mounting_type: '', amount: '', status: 1, tariff: ''}]
    setData(abc)
  }

  const checkForDuplicateSelections = () => {
    let hasDuplicates = false;
    let combinations = {};

    for (let i = 0; i < data.length; i++) {
      let combination = `${data[i].data_center}-${data[i].mounting_type}`;
      if (combinations[combination]) {
        hasDuplicates = true;
        break;
      }
      combinations[combination] = true;
    }

    return hasDuplicates;
  };

  const handleValidateForCalculate = () => {
    if (checkForDuplicateSelections()) {
      return true;
    }
    for (const currentData of data) {
      if (
        !currentData?.amount ||
        !currentData?.data_center ||
        !currentData?.mounting_type
      ) {
        return true
      }
    }
    return false
  }

  const handleValidateColocation = () => {
    if (checkForDuplicateSelections()) {
      return true;
    }
    for (const currentData of data) {
      if (
        !calculate?.success ||
        !currentData?.amount ||
        !currentData?.data_center ||
        !currentData?.mounting_type
      ) {
        return true
      }
    }
    return false
  }

  const timeoutIdColocation = useRef(null)
  const getCalculateColocation = (data) => {
    clearTimeout(timeoutIdColocation.current)
    timeoutIdColocation.current = setTimeout(() => {
      dispatch(calculateColocation({data, check: handleValidateForCalculate()}))
    }, 200)
  }

  // const fetchContractNum = async () => {
  //   await instance.get(`colocation/booked-contract?pin_or_tin=${userByTin === 'yur' ? stir : pinfl}`, {headers: {Authorization: `Bearer ${access}`}}).then((res) => {
  //     if (res?.data?.success) {
  //       setContractNumberColocation(res?.data?.valid_new_contract_number)
  //     } else {
  //       toast.error(res?.response?.data?.err_msg)
  //     }
  //   })
  // }
  //
  // const postContractNum = async () => {
  //   await instance.post('colocation/booked-contract', {
  //     pin_or_tin: client === 'yur' ? stir : pinfl,
  //     contract_date: bookedContractDate?.toISOString()
  //   }).then((res) => {
  //     if (res.status === 201) {
  //       toast.error(`${contractNumberColocation} raqam muvuffaqiyatli band qilindi!`)
  //       // navigate('/shartnomalar')
  //       // dispatch(clearChange())
  //       // dispatch(handleType(vpsActionTypes.CLEAR_VPS_BILLING, null))
  //       // setContractNumberColocation(null)
  //     }
  //   })
  // }

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <FirstStep setCurrentStep={setCurrentStep}/>
        )
      case 2:
        return (
          <>
            <div className="w-2/4">
              <label
                htmlFor="type"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Shartnoma turi
              </label>
              <select
                name="type"
                id="type"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={typeContract}
                onChange={(e) => setTypeContract(e.target.value)}
              >
                <option value="" disabled={typeContract}>Tanlang...</option>
                <option value="1">Yangi shartnoma tuzish</option>
                <option value="2">Shartnoma raqam bron qilish</option>
              </select>
            </div>
            <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
              {data.map((el, i) => (
                <div key={i} className="border rounded p-3 mt-4 w-full flex flex-col gap-4">
                  <div className="w-full text-end">
                    <button
                      onClick={() => handleDeleteDataColocation(i)}
                      disabled={data.length === 1}
                    >
                      <TrashIcon
                        color={currentColor}
                        className="size-6 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className={'flex flex-col'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">Tarif</label>
                    <select
                      className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                      value={el.tariff}
                      onChange={(e) => handleChangeDataColocation(e, i)}
                      name="tariff"
                      id="tariff"
                    >
                      <option value={''} disabled={el.tariff}>Tanlang</option>
                      {dataCenterTariff && dataCenterTariff.map((item, index) => (
                        <option value={item.id} key={index}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={'flex flex-col'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="address">Manzil</label>
                    <select
                      className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                      value={el.data_center}
                      onChange={(e) => handleChangeDataColocation(e, i)}
                      name="data_center"
                      id="address"
                    >
                      <option value={''} disabled={el.data_center}>Tanlang</option>
                      {dataCenterList && dataCenterList.map((item, index) => (
                        <option value={item.id} key={index}>{item.display_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={'flex flex-col'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="mounting_type">Shartnoma
                      obyekti</label>
                    <select
                      className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                      value={el.mounting_type}
                      onChange={(e) => handleChangeDataColocation(e, i)}
                      name="mounting_type"
                      id="mounting_type"
                    >
                      <option value="">Tanlang</option>
                      <option value="RACK">Rack</option>
                      <option value="UNIT">Unit</option>
                    </select>
                  </div>
                  <div className={'flex flex-col'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                      Shartnoma obyekti soni
                    </label>
                    <input
                      value={el.amount || ""}
                      onChange={(e) => handleChangeDataColocation(e, i)}
                      name="amount"
                      id="amount"
                      type="text"
                      className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                </div>
              ))}
              <div className="w-full">
                <div className={'flex flex-col items-end'}>
                  <div className="ml-auto w-1/5">
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="price">
                      Jami (so'm)
                    </label>
                  </div>
                  <input
                    value={calculate?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ""}
                    disabled={true}
                    type="text"
                    id="price"
                    className="rounded w-1/5 py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
              </div>
              <div className="w-full">
                {checkForDuplicateSelections() && (
                  <div style={{marginTop: 10, color: 'red'}}>
                    1ta &quot;Data Markaz&quot; dan bir xil RACK yoki UNIT tanlay olmaysiz!
                  </div>
                )}
              </div>
              <button
                className={`px-3 py-2 rounded text-white mx-auto ${handleValidateColocation() ? 'opacity-25' : ''}`}
                style={{backgroundColor: currentColor}}
                onClick={handleDataAddColocation}
              >
                Qo'shish
              </button>

              <div className="w-full flex items-center justify-between">
                <div>
                  <button
                    className={'px-4 py-2 rounded'}
                    style={{
                      color: currentColor,
                      border: `1px solid ${currentColor}`
                    }}
                    onClick={() => navigate(-1)}
                  >
                    Bekor qilish
                  </button>
                </div>
                <div className="flex gap-4">
                  <button
                    className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                    style={{color: currentColor}}
                    onClick={() => setCurrentStep(2)}
                  >
                    Orqaga
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${handleValidateColocation() ? 'opacity-50' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => setCurrentStep(2)}
                    disabled={handleValidateColocation()}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  if (loading) return <Loader/>;

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category="Colocation" title="Shartnomalar yaratish"/>
      {displayStep(currentStep)}
    </div>
  );
};

export default CreateColocation;