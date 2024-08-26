import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useNavigate, useParams} from 'react-router-dom'
import {
  calculateColocation, clearStatesColocation, createColocation,
  getDataCenterList,
  getDataCenterTariff
} from "../../../redux/slices/contractCreate/Colocation/ColocationSlices";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Loader} from "../../../components";
import {TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import instance from "../../../API";
import {getContractDetail} from "../../../redux/slices/contracts/contractsSlice";

const ColocationUpload = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {id, slug} = useParams();

  const {currentColor} = useStateContext();
  const {contractDetail} = useSelector(state => state.contracts);

  const {dataCenterList, dataCenterTariff, calculate, colocationConfig, loading} = useSelector((state) => state.createColocation);

  const [loader, setLoader] = useState(false)
  const [data, setData] = useState([
    {data_center: '', mounting_type: '', amount: '', status: 1, tariff: ''}
  ])
  const [file, setFile] = useState(null)
  const [selectedCombinations, setSelectedCombinations] = useState({});

  useEffect(() => {
    dispatch(getDataCenterList())
    dispatch(getDataCenterTariff())
  }, []);

  useEffect(() => {
    if (!handleValidateForCalculate()) {
      dispatch(calculateColocation({data}))
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
        !currentData?.mounting_type) {
        return true
      }
    }
    return false
  }

  const uploadColocation = async () => {
    setLoader(true)
    try {
      await instance.post(`/colocation/booked-contract/updated/${id}`, {
        file,
        colocation: JSON.stringify(data)
      }, {
        headers: { "Content-type": 'multipart/form-data' }
      }).then((res) => {
        if (res?.data?.success) {
          setLoader(false)
          dispatch(getContractDetail({id, slug}));
          toast.success('Muvofaqqiyatli qo\'shildi')
          dispatch(clearStatesColocation())
        } else {
          setLoader(false)
          toast.error('Xatolik')
        }
      })
    } catch (e) {
      setLoader(false)
    }
  }

  if (loader) return <Loader />
  if (loading) return <Loader />

  if (contractDetail?.contract?.contract_status === 'Shartnomani raqami bron qilingan') {
    return (
      <>
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
                  value={el.tariff || ''}
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
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="address"
                >Manzil</label>
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
          <div className="w-full flex items-center justify-between">
            <div className={'flex flex-col w-2/4'}>
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="document">
                Hujjat
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                name="document"
                id="document"
                type="file"
                className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
              />
            </div>
            <div className={'flex flex-col w-[30%]'}>
              <div className="ml-auto">
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="price">
                  Jami (so'm)
                </label>
              </div>
              <input
                value={calculate?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ""}
                disabled={true}
                type="text"
                id="price"
                className="rounded text-xl w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
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
                onClick={() => {
                  navigate(-1)
                  dispatch(clearStatesColocation())
                }}
              >
                Bekor qilish
              </button>
            </div>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                style={{backgroundColor: currentColor}}
                disabled={handleValidateColocation() || !file}
                onClick={uploadColocation}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return <h1 className="text-center dark:text-white">Shartnomani raqami bron qilinmagan</h1>
  }
};

export default ColocationUpload;