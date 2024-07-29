import React, {useEffect, useState} from 'react';
import {DetailNav, Loader, TabsRender} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {getRegistries, getRegistryDetail} from "../../redux/slices/registry/registrySlice";
import {stepClasses} from "@mui/material";
import moment from "moment";
import {AiOutlineCloudDownload} from "react-icons/ai";
import instance from "../../API";
import {api_url} from "../../config";
import {EyeIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import {elGR} from "@mui/material/locale";

const tabs = [
  {
    title: 'Reestr',
    active: true
  },
  {
    title: "Ko'rib chiqish jarayoni",
    active: false
  },
  {
    title: "Reestr uchun shartnomalar",
    active: false
  },
  {
    title: "Xulosa berish",
    active: false
  },
];

const RegistryDetail = () => {
  const dispatch = useDispatch();
  const {id, slug} = useParams();
  const {currentColor} = useStateContext();

  const {loading, register_detail} = useSelector((state) => state.registry);
  const {user} = useSelector((state) => state.user)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  const [visible, setVisible] = useState(false)

  const [formFile, setFormFile] = useState(null)

  const [selectedFile, setSelectedFile] = useState({
    comment: '',
    conclusion: 0,
    document: null,
  })

  const reject = async () => {
    try {
      const formData = new FormData()
      formData.append('comment', selectedFile.comment)
      formData.append('summary', selectedFile.conclusion)
      if (formFile) {
        formData.append('document', formFile)
      }

      await instance.post(`/registry-book/confirm-registry/${id}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(() => {
        toast.success('Muvofaqqiyatli tasdiqlandi')
        setOpenTab(0)
        dispatch(getRegistryDetail(id))
      })
    } catch (e) {
      toast.error('Xatolik')
      console.log(e)
    }
  }

  const handleValidate = () => {
    if (
      selectedFile?.conclusion == 0 &&
      !selectedFile.comment ||
      selectedFile.conclusion === "Tanlang..." ||
      selectedFile.conclusion === 0
    ) return true
    else return false
  }

  const handleValidateReject = () => {
    if (
      selectedFile?.conclusion == 0 &&
      !selectedFile.comment ||
      selectedFile.conclusion === "Tanlang..."
    ) return true
    else return false
  }

  const filteredUser = register_detail?.registry_confirm_participants_data?.find(el => el?.participant_user?.type === 'Fizik' ? el?.participant_user?.pin_or_tin === user?.pin :  el?.participant_user?.pin_or_tin === user?.tin)

  useEffect(() => {
    if (id) {
      dispatch(getRegistryDetail(id))
    }
  }, [id]);

  const display = step  => {
    switch (step) {
      case 0:
        return (
          <>
            <table className={'w-full'}>
              <tbody>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Reestr raqami</th>
                <td className={'text-center px-2 py-2'}>{register_detail?.registry_data?.number}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Reestr tuzilgan sanasi</th>
                <td className={'text-center px-2 py-2'}>
                  {moment(register_detail?.registry_data?.created_time).format('DD.MM.YYYY')}
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Reestr oy uchun</th>
                <td className={'text-center px-2 py-2'}>{register_detail?.registry_data?.created_time_month}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Reestr turi</th>
                <td className={'text-center px-2 py-2'}>{register_detail?.registry_data?.type}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Holati</th>
                <td className={'text-center px-2 py-2'}>{register_detail?.registry_data?.status}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Vaqt oralig'i</th>
                <td className={'text-center px-2 py-2'}>
                  {moment(register_detail?.registry_data?.start_time).format('DD.MM.YYYY')}
                  {' - '}
                  {moment(register_detail?.registry_data?.end_time).format('DD.MM.YYYY')}
                </td>
              </tr>
              </tbody>
            </table>
          </>
        )
      case 1:
        return (
          <>
            {register_detail?.registry_confirm_participants_data?.map((el, idx) => (
              <table key={idx} className="w-full mb-8 border">
                <tbody>
                <tr className="text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1">
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">
                    {el.participant_user?.role_name
                      ? el.participant_user?.role_name.charAt(0).toUpperCase() + el.participant_user?.role_name.slice(1)
                      : ''}
                  </th>
                  <td className={`${el?.agreement_status !== 'Kelishildi' ? 'text-dark' : 'bg-green-400 text-white'} text-center`}>
                    {el?.agreement_status || ''}
                  </td>
                </tr>
                <tr className="text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1">
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Izoh</th>
                  <td className="text-center px-2 py-2">
                    {el?.comment || '-'}
                  </td>
                </tr>
                <tr className="text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1">
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Muddat</th>
                  <td className="text-center px-2 py-2">
                    1 ish kuni
                  </td>
                </tr>
                <tr className="text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1">
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Xulosa berdi</th>
                  <td className="text-center px-2 py-2">
                    {el.participant_user?.name}
                  </td>
                </tr>
                </tbody>
              </table>
            ))}
          </>
        )
      case 2:
        return (
          <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Mijoz</th>
                <th scope="col" className="px-4 py-3">STIR/JSHSHIR</th>
                <th scope="col" className="px-4 py-3">Shartnoma raqami</th>
                <th scope="col" className="px-4 py-3">Shartnoma sanasi</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">H/F holati</th>
              </tr>
              </thead>
              <tbody>
              {register_detail?.content_object_data && register_detail?.content_object_data?.map((el, index) => (
                <tr
                  key={el?.id}
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 text-center border-b-1'}
                >
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {index + 1}
                  </td>
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {el?.contract?.client?.client_name}
                  </td>
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {el?.contract?.client?.tin_or_pin}
                  </td>
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {el?.contract?.contract_number}
                  </td>
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {moment(el?.contract?.contract_date).format('DD.MM.YYYY')}
                  </td>
                  <td scope="row" className="px-6 py-4 border-b-1">
                    {el?.contract?.contract_status}
                  </td>
                  <td className="px-6 py-4">
                    {el?.status}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        )
      case 3:
        return (
          <>
            {!filteredUser?.is_confirmed !== true ? (
              <div className="w-full">
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
                    <option value="1">Reestr tasdiqlash maqsadga muvofiq</option>
                    <option value="0">Reestr tasdiqlash maqsadga muvofiq emas</option>
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
                <div className="w-full flex items-center justify-end mt-4">
                  <button
                    className={`px-4 py-2 rounded text-white ${(selectedFile.conclusion === '1' ? handleValidate() : handleValidateReject()) ? 'opacity-25' : ''}`}
                    style={{
                      backgroundColor: currentColor,
                      border: `1px solid ${currentColor}`
                    }}
                    disabled={(selectedFile.conclusion === '1' ? handleValidate() : handleValidateReject())}
                    onClick={reject}
                  >
                    Tasdiqlash
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="text-center">Siz xulosa berib bo'lgansiz!</h1>
            )}
          </>
        )
      default:
        return null
    }
  }

  if (loading) return <Loader/>

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        <DetailNav
          id={register_detail?.registry_data?.id}
          name={register_detail?.registry_data?.number}
          status={register_detail?.registry_data?.status}
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
        {display(openTab)}
      </div>
    </>
  );
};

export default RegistryDetail;