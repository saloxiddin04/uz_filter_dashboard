import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {HooksCommission} from "../../components/eSign/eSignConfig";
import React, {useEffect, useRef, useState} from "react";
import instance from "../../API";
import {toast} from "react-toastify";
import {getContractDetail} from "../../redux/slices/contracts/contractsSlice";

const SignatureContract = ({setOpenTab}) => {
  const dispatch = useDispatch()

  const {currentColor} = useStateContext()

  const {sign, AppLoad, loader} = HooksCommission()
  const btnRef = useRef(null)
  const optionRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState({
    comment: '',
    conclusion: "0",
    document: null,
  })
  const [formFile, setFormFile] = useState(null)

  const {slug} = useParams()

  const {contractDetail, loading} = useSelector(state => state.contracts);
  const {user} = useSelector(state => state.user)

  const pin_or_tin = localStorage.getItem("tin_or_pin") || undefined;
  const option = document.querySelector(`[name="${user?.pin}"]`)
  const selectedOption = optionRef?.current?.querySelector(`[name="${user?.pin}"]`);

  useEffect(() => {
    if (!contractDetail?.is_confirmed && signatureValidate()) {
      AppLoad()
    }
  }, []);

  const validationKey = () => {
    option?.removeAttribute('disabled')
    option?.setAttribute('selected', 'true')
    selectedOption?.setAttribute('selected', 'true')
    selectedOption?.removeAttribute('disabled')
  }

  const signatureValidate = () => {
    return user?.with_ads[slug]
  }

  if (
    signatureValidate()
  ) {
    validationKey()
  }
  
  const confirmContract = async () => {
    const formData = new FormData()
    formData.append('comment', selectedFile.comment)
    formData.append('summary', selectedFile.conclusion)
    formData.append('contract', contractDetail?.contract?.id)
    if (formFile) {
      formData.append('documents', formFile)
    }
    
    await instance.post(`${slug}/confirm-contract`, formData, {
      headers: {'Content-Type': 'multipart/form-data', "PINORTIN": pin_or_tin}
    }).then(() => {
      setOpenTab(2)
    }).catch((e) => toast.error('Xatolik'))
  }

  const confirm = async () => {
    const formData = new FormData()
    formData.append('comment', selectedFile.comment)
    formData.append('summary', selectedFile.conclusion)
    formData.append('contract', contractDetail?.contract?.id)
    formData.append('action_type', 2)
    if (formFile) {
      formData.append('documents', formFile)
    }

    sign(
      contractDetail?.contract?.base64file,
      slug,
      contractDetail?.contract?.id,
      formData,
      confirmContract
    )
  }

  const reject = async () => {
    const formData = new FormData()
    formData.append('comment', selectedFile.comment)
    formData.append('summary', selectedFile.conclusion)
    formData.append('contract', contractDetail?.contract?.id)
    formData.append('action_type', 0)
    if (formFile) {
      formData.append('documents', formFile)
    }

    await instance.post(`${slug}/confirm-save-pkcs`, formData, {
      headers: {'Content-Type': 'multipart/form-data', "PINORTIN": pin_or_tin}
    }).then(() => {
      setOpenTab(2)
      toast.success('Muvoffaqiyatli xulosa berildi')
      dispatch(
        getContractDetail({
          id: contractDetail?.contract?.id,
          slug
        })
      )
    }).catch((e) => toast.error('Xatolik'))
  }

  const handleValidate = () => {
    if (
      selectedFile?.conclusion === "0" &&
      !selectedFile.comment ||
      selectedFile.conclusion === "Tanlang..." ||
      selectedFile.conclusion === "0" ||
      signatureValidate()
    ) return true
    else return false
  }

  const handleValidateReject = () => {
    if (
      selectedFile?.conclusion === "0" &&
      !selectedFile.comment ||
      selectedFile.conclusion === "Tanlang..."
    ) return true
    else return false
  }

  if (!contractDetail?.is_confirmed) {
    return (
      <div className={'w-full'}>
        <div>
          <label
            htmlFor="conclusion"
            className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
          >
            Xulosa
          </label>
          <select
            name="conclusion"
            id="conclusion"
            className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
            onChange={(e) => setSelectedFile({...selectedFile, conclusion: e.target.value})}
          >
            <option value="2">Tanlang...</option>
            <option value="1">Shartnoma imzolash maqsadga muvofiq</option>
            <option value="0">Shartnoma imzolash maqsadga muvofiq emas</option>
          </select>
        </div>
        {selectedFile?.conclusion === '0' && (
          <div className={'my-4'}>
            <label
              htmlFor="comment"
              className={'block text-gray-700 text-sm font-bold mb-2 ml-3'}
            >
              Izoh
            </label>
            <textarea
              name="comment"
              id="comment"
              cols="10"
              rows="3"
              className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border'}
              onChange={(e) => setSelectedFile({...selectedFile, comment: e.target.value})}
            />
          </div>
        )}
        <div className={'flex flex-col mt-4'}>
          <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="document">
            Hujjat
          </label>
          <input
            onChange={(e) => setFormFile(e.target.files[0])}
            name="document"
            id="document"
            type="file"
            className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1 dark:text-white"
          />
        </div>
        {signatureValidate() && (
          <div
            className={`w-full flex flex-col mt-4 ${signatureValidate() && selectedFile.conclusion !== '1' ? 'hidden' : ''}`}
          >
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="S@loxiddin">ERI</label>
            <div className="flex items-center justify-between">
              <select
                name="S@loxiddin"
                id="S@loxiddin"
                className='w-11/12 px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border'
              />
              <div>
                <button
                  className={'px-4 py-2 rounded mx-auto text-white disabled:opacity-20'}
                  style={{
                    backgroundColor: currentColor,
                  }}
                  onClick={confirm}
                  disabled={selectedFile.conclusion === 0 || selectedFile.conclusion !== '1' || loader}
                >
                  {loader ? 'Imzolanmoqda...' : 'Imzolash'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex items-center justify-end mt-4">
          <button
            className={`px-4 py-2 rounded text-white ${(selectedFile.conclusion === '1' ? handleValidate() : handleValidateReject()) ? 'opacity-25' : ''}`}
            style={{
              backgroundColor: currentColor,
              border: `1px solid ${currentColor}`
            }}
            disabled={(selectedFile.conclusion === '1' ? handleValidate() : handleValidateReject())}
            ref={btnRef}
            onClick={reject}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default SignatureContract