import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../../../components";
import {
  clearStatesExpertise,
  getCalculateExpertise,
  getExpertiseContractNumber,
  getTariffsExpertise
} from "../../../redux/slices/contractCreate/Expertise/expertiseSlices";
import {TrashIcon} from "@heroicons/react/16/solid";
import instance from "../../../API";
import {getContractDetail} from "../../../redux/slices/contracts/contractsSlice";
import {toast} from "react-toastify";

const ExpertiseUpload = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id, slug} = useParams();
  const {currentColor} = useStateContext();
  const {contractDetail} = useSelector(state => state.contracts);
  const {sidebar} = useSelector((state) => state.sections);

  const {
    tarifsApplication,
    calculate,
    loading,
  } = useSelector(state => state.createExpertise)
  const [priceSelect, setPriceSelect] = useState('')

  const [loader, setLoader] = useState(false)

  const [val, setVal] = useState([
    {expertise_service_tarif: '', price: 0, name_of_tarif: '', is_discount: false, discount_price: ''},
  ])

  const [file, setFile] = useState(null)

  useEffect(() => {
    dispatch(getTariffsExpertise())
  }, []);

  useEffect(() => {
    if (!handleValidateSecondForCalculate()) {
      getCalculate(val)
    }
  }, [val]);

  const timeoutId = useRef(null)
  const getCalculate = useCallback((data) => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      dispatch(getCalculateExpertise(data))
    }, 500)
  }, [])

  const handleValAdd = () => {
    const abc = [...val, {
      expertise_service_tarif: '',
      price: 0,
      name_of_tarif: '',
      is_discount: false,
      discount_price: ''
    }]
    setVal(abc)
  }

  const handleChangeVal = (onChangeVal, i) => {
    let inputData = [...val]
    if (onChangeVal?.target?.checked) {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
    } else {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.value
      const tariffPriceFilter = tarifsApplication?.find((
        item => item.id === Number(inputData[i].expertise_service_tarif)
      ))
      setVal(prevState => [prevState[i].price = tariffPriceFilter?.price])
      if (inputData[i].is_discount === 'on') {
        inputData[i].is_discount = false
        inputData[i].discount_price = ''
      }
    }
    setVal(inputData)
  }

  const handleValidateSecondForCalculate = () => {
    for (const currentProject of val) {
      if (
        !priceSelect ||
        !currentProject?.expertise_service_tarif ||
        (currentProject?.is_discount && !currentProject?.discount_price) ||
        !currentProject?.price ||
        !currentProject?.name_of_tarif) {
        return true
      }
    }
    return false
  }

  const handleValidateSecond = () => {
    for (const currentProject of val) {
      if (
        !priceSelect ||
        !calculate?.total_cash ||
        (currentProject?.is_discount && !currentProject?.discount_price) ||
        !currentProject?.expertise_service_tarif ||
        !currentProject?.price ||
        !currentProject?.name_of_tarif ||
        !file) {
        return true
      }
    }
    return false
  }

  const handleDeleteVal = (i) => {
    const deleteVal = [...val]
    deleteVal.splice(i, 1)
    setVal(deleteVal)
  }

  const postExpertise = async () => {
    setLoader(true)
    try {
      await instance.post(`/expertise/booked-contract/${id}`, {
        price_select_percentage: Number(priceSelect),
        projects: JSON.stringify(val),
        file: file,
        contract_cash: Number(calculate?.total_cash)
      }, {
        headers: { "Content-type": 'multipart/form-data' }
      }).then((res) => {
        if (res?.data?.success) {
          setLoader(false)
          dispatch(getContractDetail({id,  slug}))
          toast.success("Muvofaqqiyatli yuklandi")
        } else {
          setLoader(false)
          toast.error("Xatolik")
        }
      })
    } catch (e) {
      setLoader(false)
    }
  }

  if (loader) return <Loader/>

  if (contractDetail?.contract?.contract_status === "Shartnomani raqami bron qilingan") {
    return (
      <>
        <div className="w-2/4 my-2">
          <label
            htmlFor="type"
            className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
          >
            To'lov turi
          </label>
          <select
            name="type"
            id="type"
            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
            value={priceSelect}
            onChange={(e) => setPriceSelect(e.target.value)}
          >
            <option disabled={priceSelect}>Tanlang...</option>
            <option value={30}>30%/70%</option>
            <option value={50}>50%/50%</option>
            <option value={100}>100%</option>
          </select>
        </div>
        {priceSelect && (
          <div className="w-full flex items-center justify-between flex-wrap gap-4 mt-4">
            <div className="w-full flex flex-wrap gap-4 my-2">
              {val && val?.map((data, i) => (
                <div key={i} className="border-dashed border p-2 w-full flex flex-col gap-4">
                  <div className="w-full text-end">
                    <button
                      onClick={() => handleDeleteVal(i)}
                      disabled={val.length === 1}
                    >
                      <TrashIcon
                        color={currentColor}
                        className="size-6 cursor-pointer"
                      />
                    </button>
                  </div>
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className={'flex flex-col w-[49%]'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">Tarif</label>
                      <select
                        className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                        value={data.expertise_service_tarif}
                        onChange={(e) => handleChangeVal(e, i)}
                        name="expertise_service_tarif"
                        id="tariff"
                      >
                        <option value="0" disabled={data.expertise_service_tarif}>Tanlang</option>
                        {tarifsApplication?.map((item) => (
                          <option key={item.id} value={item.id}>{item.title_of_tarif}</option>
                        ))}
                      </select>
                    </div>
                    <div className={'flex flex-col w-[49%]'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                        To'lov miqdori
                      </label>
                      <input
                        value={data.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                        disabled={true}
                        onChange={(e) => handleChangeVal(e, i)}
                        name='price'
                        id="amount"
                        type="text"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    {!data.is_discount && <div className="w-2/4 min-h-9"></div>}
                    {data.is_discount && (
                      <div className={'flex flex-col w-[49%]'}>
                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                               htmlFor="discount_price"
                        >
                          Chegirmadagi to'lov miqdori
                        </label>
                        <input
                          value={data.discount_price}
                          onChange={(e) => handleChangeVal(e, i)}
                          name='discount_price'
                          id="discount_price"
                          type="number"
                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                        />
                      </div>
                    )}
                    <div className={'flex items-center gap-4 w-2/4'}>
                      <label className="block text-gray-700 text-sm font-bold ml-3" htmlFor="amount">
                        Chegirma berish
                      </label>
                      <input
                        checked={data.is_discount}
                        onChange={(e) => handleChangeVal(e, i)}
                        name='is_discount'
                        id="amount"
                        type="checkbox"
                        className="rounded py-1.5 px-2"
                      />
                    </div>
                  </div>
                  <div className={'flex flex-col w-full'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name_of_tarif">
                      Loyiha nomini kiriting
                    </label>
                    <input
                      value={data.name_of_tarif}
                      onChange={(e) => handleChangeVal(e, i)}
                      name='name_of_tarif'
                      id='name_of_tarif'
                      type="text"
                      className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={'flex flex-col w-[49%]'}>
              <label
                className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                htmlFor="discount_price"
              >
                Fayl
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                name='discount_price'
                id="discount_price"
                type="file"
                className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
              />
            </div>
            <div className="w-full flex items-center justify-between">
              <button
                className={`px-4 py-2 rounded text-white ${handleValidateSecond() ? 'opacity-50' : ''}`}
                style={{backgroundColor: currentColor}}
                disabled={handleValidateSecond()}
                onClick={() => handleValAdd()}
              >
                Loyiha qo'shish
              </button>
              <div className={'flex flex-col w-[30%]'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="cash">
                  Jami (so'm)
                </label>
                <input
                  value={calculate?.total_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ''}
                  disabled={true}
                  id="cash"
                  type="text"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={() => {
                    dispatch(clearStatesExpertise())
                    navigate(-1)
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  disabled={handleValidateSecond()}
                  onClick={postExpertise}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  } else return <h1 className="text-center">Shartnoma bron qilinmagan</h1>
};

export default ExpertiseUpload;