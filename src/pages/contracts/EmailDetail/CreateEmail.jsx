import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {toast} from "react-toastify";
import instance from "../../../API";
import {getContractDetail} from "../../../redux/slices/contracts/contractsSlice";
import {Loader} from "../../../components";

const CreateEmail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {id, slug} = useParams();

  const {currentColor} = useStateContext();
  const {contractDetail} = useSelector(state => state.contracts);

  const [user_count, setUserCount] = useState('')
  const [pay_choose, setPayChoose] = useState('')
  const [file, setFile] = useState(null)
  const [loader, setLoader] = useState(false)
  
  const patchEmail = async () => {
    setLoader(true)
    try {
      await instance.patch(`/e-xat/booked-contract/${id}`, { user_count, pay_choose, file }, {
        headers: { "Content-type": 'multipart/form-data' }
      }).then((res) => {
        if (res?.data?.success) {
          setLoader(false)
          dispatch(getContractDetail({id,  slug}))
          toast.success("Muvofaqiyyatli yuklandi")
          setFile(null)
          setUserCount('')
          setPayChoose('')
        } else {
          toast.error("Xatolik")
          setLoader(false)
        }
      })
    } catch (e) {
      setLoader(false)
    }
  }

  if (loader) return <Loader />

  if (contractDetail?.contract?.contract_status === 'Shartnomani raqami bron qilingan') {
    return (
      <>
        <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
          <div className="border rounded p-3 mt-4 w-full flex flex-col gap-4">
            <div className={'flex flex-col'}>
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">To'lov turini
                tanlang</label>
              <select
                className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                value={pay_choose}
                onChange={(e) => setPayChoose(e.target.value)}
                name="tariff"
                id="tariff"
              >
                <option value="" disabled={pay_choose}>Tanlang</option>
                <option value="1">Byudjet mablag’lari hisobidan (30/70)</option>
                <option value="2">O’z mablag’lari hisobidan (100%)</option>
              </select>
            </div>
            <div className={'flex flex-col'}>
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">“E-XAT” kalitidan
                foydalanuvchi xodimlar sonini kiriting</label>
              <input
                value={user_count}
                onChange={(e) => {
                  if (/^-?\d*$/.test(e.target.value)) {
                    setUserCount(e.target.value)
                  }
                }}
                name="amount"
                id="amount"
                type="text"
                className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
              />
            </div>
            <div className={'flex flex-col'}>
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">Fayl</label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                name="amount"
                id="amount"
                type="file"
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
                  setFile(null)
                  setUserCount('')
                  setPayChoose('')
                  navigate(-1)

                }}
              >
                Bekor qilish
              </button>
            </div>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                style={{backgroundColor: currentColor}}
                disabled={!pay_choose || !user_count || !file}
                onClick={patchEmail}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else return <h1 className="text-center">Shartnomani raqami bron qilinmagan</h1>
};

export default CreateEmail;