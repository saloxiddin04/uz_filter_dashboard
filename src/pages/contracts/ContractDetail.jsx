import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getContractDetail, getContractDetailBalance} from "../../redux/slices/contracts/contractsSlice";
import {Button, Input, Loader, TabsRender, DetailNav} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import moment from "moment/moment";
import {AiOutlineCloudDownload} from "react-icons/ai";
import instance from "../../API";
import {api_url} from "../../config";
import YurUserContractDetail from "./YurUserContractDetail";
import FizUserContractDetail from "./FizUserContractDetail";
import {BiSearch} from "react-icons/bi";
import {HooksCommission} from "../../components/eSign/eSignConfig";
import {toast} from "react-toastify";

const tabs = [
  {
    title: 'Shartnoma',
    active: true
  },
  {
    title: "Shaxs ma'lumotlari",
    active: false
  },
  {
    title: "Ko'rib chiqish jarayoni",
    active: false
  },
  {
    title: "Billing",
    active: false
  },
  {
    title: "Xulosa berish",
    active: false
  },
];

const ContractDetail = () => {
  const dispatch = useDispatch();
  const {id, slug} = useParams();
  const {currentColor} = useStateContext();
  const {contractDetail, loading, contractDetailBalance} = useSelector(state => state.contracts);
  
  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  const safeDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date.toISOString().split('T')[0];
  };

  const [beginDateVps, setBeginDateVps] = useState(
    contractDetail ? safeDate(contractDetail?.contract?.contract_date) : ''
  );

  const [endDateVps, setEndDateVps] = useState(
    new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
  );

  useEffect(() => {
    dispatch(getContractDetail({id, slug}));
  }, [id, slug]);

  const getBalance = () => {
    const dateEndVps = new Date(endDateVps);
    const year = dateEndVps.getFullYear().toString().slice(2);
    const month = (dateEndVps.getMonth() + 1).toString().padStart(2, '0');
    const formattedDateEnd = `${year}${month}`;

    const dateBeginVps = new Date(beginDateVps);
    const yearBegin = dateBeginVps.getFullYear().toString().slice(2);
    const monthBegin = (dateBeginVps.getMonth() + 1).toString().padStart(2, '0');
    const formattedDateBegin = `${yearBegin}${monthBegin}`;

    const data = {
      service: contractDetail?.contract?.service,
      contract: contractDetail?.contract?.id,
      begin_date: formattedDateBegin,
      end_date: formattedDateEnd
    }
    dispatch(getContractDetailBalance(data))
  }

  const formatDate = (dateStr) => {
    if (dateStr?.length % 2 !== 0) {
      return dateStr;
    }
    return dateStr.match(/.{1,2}/g).join('.');
  };

  if (loading) return <Loader/>;

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        <DetailNav
          id={contractDetail?.contract?.id}
          name={contractDetail?.contract?.contract_number}
          status={contractDetail?.contract?.contract_status?.name ? contractDetail?.contract?.contract_status?.name : contractDetail?.contract?.contract_status}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        {
          renderDetail(
            openTab,
            contractDetail,
            setBeginDateVps,
            setEndDateVps,
            getBalance,
            beginDateVps,
            endDateVps,
            currentColor,
            contractDetailBalance,
            formatDate,
            slug,
            setOpenTab
          )
        }
      </div>
    </>
  );
};

const SignatureContract = ({setOpenTab}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {currentColor} = useStateContext()

  const {sign, AppLoad} = HooksCommission()
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
    formData.append('documents', formFile)
    formData.append('contract', contractDetail?.contract?.id)

    await instance.post(`${slug}/confirm-contract`, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(() => {
      setOpenTab(2)
    }).catch((e) => toast.error('Xatolik'))
  }

  const confirm = async () => {
    const formData = new FormData()
    formData.append('comment', selectedFile.comment)
    formData.append('summary', selectedFile.conclusion)
    formData.append('documents', formFile)
    formData.append('contract', contractDetail?.contract?.id)

    const body = {
      comment: selectedFile.comment,
      summary: selectedFile.conclusion,
      documents: formFile,
      contract: contractDetail?.contract?.id,
    }

    sign(
      contractDetail?.contract?.base64file,
      slug,
      contractDetail?.contract?.id,
      confirmContract
    )
  }

  const reject = async () => {
    const formData = new FormData()
    formData.append('comment', selectedFile.comment)
    formData.append('summary', selectedFile.conclusion)
    formData.append('documents', formFile)
    formData.append('contract', contractDetail?.contract?.id)

    await instance.post(`${slug}/confirm-contract`, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
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
            className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
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
                  className={'px-4 py-2 rounded mx-auto text-white'}
                  style={{
                    backgroundColor: currentColor,
                  }}
                  onClick={confirm}
                  disabled={selectedFile.conclusion === 0 || selectedFile.conclusion !== '1'}
                >
                  Imzolash
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

const renderDetail = (
  value,
  data,
  setBeginDateVps,
  setEndDateVps,
  getBalance,
  beginDateVps,
  endDateVps,
  currentColor,
  contractDetailBalance,
  formatDate,
  slug,
  setOpenTab
) => {
  switch (value) {
    case 0:
      return (
        <>
          <table className={'w-full'}>
            <tbody>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
            >
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma raqami</th>
              <td className={'text-center px-2 py-2'}>{data?.contract?.contract_number}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma sanasi</th>
              <td className={'text-center px-2 py-2'}>{moment(data?.contract?.contract_date).format('DD.MM.YYYY')}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma holati</th>
              <td className={'text-center px-2 py-2'}>{data?.contract?.contract_status?.name
                ? data?.contract?.contract_status?.name
                : data?.contract?.contract_status}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Amal qilish muddati</th>
              <td className={'text-center px-2 py-2'}>{data?.contract?.expiration_date == null
                ? moment(data?.contract?.contract_date)
                  .add(1, 'y')
                  .format('DD.MM.YYYY')
                : moment(data?.contract?.expiration_date).format(
                  'DD.MM.YYYY',
                )}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'lov miqdori</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.contract_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'landi</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.payed_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Qarzdorlik</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.arrearage?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Fayl yuklab olish</th>
              <td className={'text-center px-2 py-2'}>
                <AiOutlineCloudDownload
                  className={'size-6 m-auto cursor-pointer'}
                  onClick={async () => {
                    await instance.get(`${api_url}/${slug}/contract/${data?.contract?.hashcode}`, {
                      headers: {
                        "Content-type": 'blob'
                      },
                      responseType: 'arraybuffer'
                    }).then((res) => {
                      if (res.status === 200) {
                        const fileURL = URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement("a");
                        link.href = fileURL;
                        link.setAttribute("download", `${data?.contract?.contract_number}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                      }
                    })
                  }}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </>
      )
    case 1:
      return (
        <>
          {!data?.client?.bank_mfo ? (
            <FizUserContractDetail/>
          ) : (
            <YurUserContractDetail/>
          )}
        </>
      )
    case 2:
      return (
        <>
          {data?.participants?.map((el, idx) => (
            <table key={idx} className={'w-full mb-8 border'}>
              <tbody>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>
                  {el.userdata?.userdata?.role?.name?.charAt(0).toUpperCase() + el.userdata?.userdata?.role?.name.slice(1)}
                </th>
                <td
                  className={`${el?.agreement_status !== 'Kelishildi' ? 'text-dark' : 'bg-green-400 text-white'} text-center`}>
                  {el?.agreement_status}
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Izoh</th>
                <td className={`text-center px-2 py-2`}>
                  {el.expert_summary?.comment ? el.expert_summary?.comment : '-'}
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Muddat</th>
                <td className={`text-center px-2 py-2`}>
                  {moment(data?.contract?.contract_date).format(
                    'DD.MM.YYYY',
                  )}
                  {' '}
                  -
                  {' '}
                  {moment(data.contract.contract_date)
                    .add(1, 'days')
                    .format('DD.MM.YYYY')}
                  <br/>1 ish kuni
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Xulosa berdi</th>
                <td className={`text-center px-2 py-2`}>
                  {el?.expert_summary ? el?.userdata?.full_name : '-'}
                  <br/>
                  {el?.date ? moment(el?.date).format('DD.MM.YYYY HH:mm:ss') : ''}
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Telefon</th>
                <td className={`text-center px-2 py-2`}>
                  {el.userdata?.mob_phone_no}
                </td>
              </tr>
              </tbody>
            </table>
          ))}
        </>
      )
    case 3:
      return (
        <>
          <div
            className="m-1 md:mx-8 md:my-4 mt-24 p-2 md:px-2 md:py-2 bg-white rounded flex items-center justify-between">
            <div className={'w-2/4'}>
              <Input
                label={'Sanadan'}
                value={beginDateVps}
                onChange={(e) => setBeginDateVps(e.target.value)}
                type={'date'}
              />
            </div>
            <div className={'w-2/5 flex items-end gap-5'}>
              <div className={'w-full'}>
                <Input
                  label={'Sanagacha'}
                  value={endDateVps}
                  onChange={(e) => setEndDateVps(e.target.value)}
                  type={'date'}
                />
              </div>
              <Button
                className={'cursor-pointer'}
                icon={<BiSearch className={`size-7`}
                                style={{color: currentColor, opacity: !beginDateVps || !endDateVps ? 0.5 : 1}}/>}
                onClick={getBalance}
                disabled={!beginDateVps || !endDateVps}
              />
            </div>
          </div>
          <table className={'mt-8 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'}>
            <thead className={'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded'}>
            <tr>
              <th className="px-3 py-3">Oy</th>
              <th className="px-3 py-3">To’langan qiymat</th>
              <th className="px-3 py-3">To’lov</th>
              <th className="px-3 py-3">To’lov (%)</th>
              <th className="px-3 py-3">Sana (yil.oy.sana)</th>
              <th className="px-3 py-3">Invoys</th>
              <th className="px-3 py-3">Balans</th>
            </tr>
            </thead>
            <tbody>
            {contractDetailBalance?.detail && contractDetailBalance?.detail.map((item) => (
              <tr className={'hover:bg-gray-100 hover:dark:bg-gray-800'} key={item.id}>
                <td className={'px-3 py-4 border-b-1'}>{item?.month}</td>
                <td className={'px-3 py-4 border-b-1'}>{item?.amount} so’m</td>
                <td className={'px-3 py-4 border-b-1'}>{item?.pay_amount} so’m</td>
                <td className={'px-3 py-4 border-b-1'}>{item?.amount_precent}%</td>
                <td className={'px-3 py-4 border-b-1'}>{formatDate(item?.amount_date)}</td>
                <td className={'px-3 py-4 border-b-1'}>{item?.send_invoice === '0' ? 'Yuborilmagan' : 'Yuborilgan'}</td>
                <td className={'px-3 py-4 border-b-1'}>{contractDetailBalance?.balance} so’m</td>
              </tr>
            ))}
            </tbody>
          </table>
        </>
      )
    case 4:
      return (
        <SignatureContract setOpenTab={setOpenTab} />
      )
    default:
      return null
  }

}

export default ContractDetail;
