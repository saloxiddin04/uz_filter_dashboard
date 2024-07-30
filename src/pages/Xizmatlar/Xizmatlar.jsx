import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Input, TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {getServices} from "../../redux/slices/registry/registrySlice";
import JoditEditor from "jodit-react";
import {toast} from "react-toastify";
import instance from "../../API";
import Loader from "../../components/Loader";
import {AiOutlineCloudDownload} from "react-icons/ai";
import {EyeIcon, PencilIcon, TrashIcon} from "@heroicons/react/16/solid";
import {Link} from "react-router-dom";

const tabs = [
  {
    title: "Ma'lumotlar",
    active: true
  },
  {
    title: "Video qo'llanma",
    active: false
  }
];

const mainTabs = [
  {
    title: "Ma'lumotlar",
    active: true
  },
  {
    title: "Qo'shimcha ma'lumotlar",
    active: false
  },
  {
    title: "Video ma'lumotlar",
    active: false
  }
];

const Xizmatlar = () => {
  const dispatch = useDispatch()
  const {currentColor} = useStateContext();

  const {services} = useSelector(({registry}) => registry)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
  const [mainOpenTab, setMainOpenTab] = useState(mainTabs.findIndex(tab => tab.active));
  const [modal, setModal] = useState(false)

  const [loading, setLoading] = useState(false)

  const [id, setId] = useState(null)
  const [video_id, setVideoId] = useState(null)

  const [list, setList] = useState(null)
  const [listDetail, setListDetail] = useState(null)

  const [videoList, setVideoList] = useState(null)
  const [videoListDetail, setVideoListDetail] = useState(null)

  const [service, setService] = useState(localStorage.getItem('service') || '')

  const [service_detail, setServiceDetail] = useState(null)

  const [name_uz, setNameUz] = useState('')
  const [name_ru, setNameRu] = useState('')
  const [name_en, setNameEn] = useState('')
  const [description_uz, setDescriptionUz] = useState('')
  const [description_ru, setDescriptionRu] = useState('')
  const [description_en, setDescriptionEn] = useState('')
  const [icon, setIcon] = useState(null)
  const [file, setFile] = useState(null)

  const [fileName, setFileName] = useState('')
  const [iconName, setIconName] = useState('')

  const [video_name_uz, setVideoNameUz] = useState('')
  const [video_name_ru, setVideoNameRu] = useState('')
  const [video_name_en, setVideoNameEn] = useState('')
  const [video_choice, setVideoChoice] = useState('')
  const [video_doc, setVideoDoc] = useState('')
  const [video_file, setVideoFile] = useState(null)

  const [video_file_name, setVideoFileName] = useState('')

  useEffect(() => {
    dispatch(getServices())
  }, []);

  useEffect(() => {
    if (service) {
      const filter = services?.find(el => el?.id === Number(service))
      setServiceDetail(filter)
    }
  }, [dispatch, service, services])

  useEffect(() => {
    if (mainOpenTab === 1) {
      fetchList().then((res) => setList(res))
    } else if (mainOpenTab === 2) {
      fetchVideo().then((res) => setVideoList(res))
    }
  }, [mainOpenTab, service]);

  useEffect(() => {
    if (id) {
      const filter = list?.find(el => el?.id === id)
      setListDetail(filter)
      setNameUz(filter?.name_uz)
      setNameRu(filter?.name_ru)
      setNameEn(filter?.name_en)
      setDescriptionUz(filter?.description_uz)
      setDescriptionRu(filter?.description_ru)
      setDescriptionEn(filter?.description_en)
      setIconName(filter?.icon)
      setFileName(filter?.file)
      setModal(true)
    }
  }, [id]);

  useEffect(() => {
    if (video_id) {
      const filter = videoList?.find(el => el?.id === video_id)
      setVideoListDetail(filter)
      setVideoNameUz(filter?.name_uz)
      setVideoNameRu(filter?.name_ru)
      setVideoNameEn(filter?.name_en)
      setVideoDoc(filter?.video_doc)
      setVideoFileName(filter?.video_file)
      setVideoFile(filter?.video_file)
      setVideoChoice(filter?.video_choice)
      setModal(true)
      setOpenTab(1)
    }
  }, [video_id]);

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await instance.get(`/service/${service}/add-list`)
      setList(response.data)
      setLoading(false)
      return response.data
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const fetchVideo = async () => {
    setLoading(true)
    try {
      const response = await instance.get(`/service/${service}/video-list`)
      setVideoList(response.data)
      setLoading(false)
      return response.data
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const deleteItem = async (id) => {
    setLoading(true)
    try {
      await instance.delete(`/service/delete/${id}/add-info`).then((res) => {
        if (res.status === 204) {
          setLoading(false)
          toast.success('Muvofaqqiyatli o\'chirildi')
          fetchList()
        }
      })
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const deleteVideo = async (id) => {
    setLoading(true)
    try {
      await instance.delete(`/service/delete/${id}/video-info`).then((res) => {
        if (res.status === 204) {
          setLoading(false)
          toast.success('Muvofaqqiyatli o\'chirildi')
          fetchVideo()
        }
      })
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const closeModal = () => {
    setModal(!modal)
    setNameUz('')
    setNameRu('')
    setNameEn('')
    setDescriptionUz('')
    setDescriptionRu('')
    setDescriptionEn('')
    setIcon(null)
    setFile(null)
    setId(null)
    setListDetail(null)
    setVideoNameUz('')
    setVideoNameRu('')
    setVideoNameEn('')
    setVideoChoice('')
    setVideoDoc('')
    setVideoFile(null)
    setVideoId(null)
    setVideoFileName('')
    setOpenTab(0)
  }

  const handleValidate = () => {
    return !name_uz || !name_ru || !name_en || !description_uz || !description_ru || !description_en;
  }

  const validateChoiceVideo = () => {
    if (video_file && video_doc) return true
    return !video_file && !video_doc;
  }

  const handleValidateVideo = () => {
    return !video_name_uz || !video_name_ru || !video_name_en || !video_choice || validateChoiceVideo()
  }

  const createContent = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('name_uz', name_uz)
    formData.append('name_ru', name_ru)
    formData.append('name_en', name_en)
    formData.append('description_uz', description_uz)
    formData.append('description_ru', description_ru)
    formData.append('description_en', description_en)
    if (file) {
      formData.append('file', file)
    }
    if (icon) {
      formData.append('icon', icon)
    }

    try {
      await instance.post(`/service/${service}/add-list-create`, formData, {
        headers: {'Content-type': 'multipart/form-data'}
      }).then((res) => {
        if (res.status === 201) {
          setLoading(false)
          toast.success('Muvofaqqiyatli yaratildi')
          closeModal()
          fetchList()
        }
      })
    } catch (e) {
      setLoading(false)
      toast.error(e.message)
    }
  }

  const updateContent = async () => {
    setLoading(true)
    const formData = new FormData()
    if (listDetail?.name_uz !== name_uz) {
      formData.append('name_uz', name_uz)
    }
    if (listDetail?.name_ru !== name_ru) {
      formData.append('name_ru', name_ru)
    }
    if (listDetail?.name_en !== name_en) {
      formData.append('name_en', name_en)
    }
    if (listDetail?.description_uz !== description_uz) {
      formData.append('description_uz', description_uz)
    }
    if (listDetail?.description_ru !== description_ru) {
      formData.append('description_ru', description_ru)
    }
    if (listDetail?.description_en !== description_en) {
      formData.append('description_en', description_en)
    }
    if (file) {
      formData.append('file', file)
    }
    if (icon) {
      formData.append('icon', icon)
    }

    try {
      await instance.patch(`/service/update/${listDetail?.id}/add-info`, formData, {
        headers: {'Content-type': 'multipart/form-data'}
      }).then((res) => {
        if (res.status === 200) {
          setLoading(false)
          toast.success('Muvofaqqiyatli yangilandi')
          closeModal()
          fetchList()
        }
      })
    } catch (e) {
      setLoading(false)
      toast.error(e.message)
    }
  }

  const createContentVideo = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('video_choice', video_choice)
    formData.append('name_uz', video_name_uz)
    formData.append('name_ru', video_name_ru)
    formData.append('name_en', video_name_en)
    if (video_file) {
      formData.append('video_file', video_file)
    }
    if (video_doc) {
      formData.append('video_doc', video_doc)
    }

    try {
      await instance.post(`/service/${service}/video-list-create`, formData, {
        headers: {"Content-type": 'multipart/form-data'}
      }).then((res) => {
        if (res.status === 201) {
          setLoading(false)
          toast.success('Muvofaqqiyatli yaratildi')
          closeModal()
          fetchList()
        }
      })
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const updateContentVideo = async () => {
    setLoading(true)
    const formData = new FormData()
    if (videoListDetail?.name_uz !== video_name_uz) {
      formData.append('name_uz', video_name_uz)
    }
    if (videoListDetail?.name_ru !== video_name_ru) {
      formData.append('name_ru', video_name_ru)
    }
    if (videoListDetail?.name_en !== video_name_en) {
      formData.append('name_en', video_name_en)
    }
    if (videoListDetail?.video_choice !== video_choice) {
      formData.append('video_choice', video_choice)
    }
    if (videoListDetail?.video_doc !== video_doc) {
      formData.append('video_doc', video_doc)
    }
    if (typeof video_file === 'object' && video_file !== null) {
      formData.append('video_file', video_file)
    }

    try {
      await instance.patch(`/service/update/${video_id}/video-info`, formData, {
        headers: {"Content-type": 'multipart/form-data'}
      }).then((res) => {
        if (res.status === 200) {
          toast.success('Muvofaqqiyatli yangilandi')
          closeModal()
          fetchVideo()
        }
      })
    } catch (e) {
      setLoading(false)
      return e.message
    }
  }

  const displayStep = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="w-full flex flex-col gap-4">
              <div>
                <Input
                  label={'Sarlavha (uz) *'}
                  value={name_uz}
                  onChange={(e) => setNameUz(e.target.value)}
                  className={'focus:border-blue-400'}
                  required={true}
                />
              </div>
              <div>
                <Input
                  label={'Sarlavha (ru) *'}
                  value={name_ru}
                  onChange={(e) => setNameRu(e.target.value)}
                  className={'focus:border-blue-400'}
                />
              </div>
              <div>
                <Input
                  label={'Sarlavha (en) *'}
                  value={name_en}
                  onChange={(e) => setNameEn(e.target.value)}
                  className={'focus:border-blue-400'}
                />
              </div>
              <div className={'flex flex-col'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="document">
                  Icon
                </label>
                <input
                  onChange={(e) => setIcon(e.target.files[0])}
                  name="document"
                  id="document"
                  type="file"
                  accept="image/png"
                  className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
                <Link to={iconName} target="_blank"
                      className="block underline text-blue-400 text-sm font-bold mb-1 ml-3"
                >{id && iconName}</Link>
              </div>
              <div className={'flex flex-col'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">
                  Fayl
                </label>
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  name="file"
                  id="file"
                  type="file"
                  className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
                <Link to={fileName} target="_blank"
                      className="block underline text-blue-400 text-sm font-bold mb-1 ml-3"
                >{id && fileName}</Link>
              </div>
              <div className={'flex flex-col'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
                  Izoh (uz) *
                </label>
                <JoditEditor value={description_uz} onChange={(e) => setDescriptionUz(e)}/>
              </div>
              <div className={'flex flex-col'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
                  Izoh (ru) *
                </label>
                <JoditEditor value={description_ru} onChange={(e) => setDescriptionRu(e)}/>
              </div>
              <div className={'flex flex-col'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
                  Izoh (en) *
                </label>
                <JoditEditor value={description_en} onChange={(e) => setDescriptionEn(e)}/>
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    border: `1px solid ${currentColor}`,
                    color: currentColor
                  }}
                  onClick={closeModal}
                >
                  Bekor qilish
                </button>
                <button
                  className="px-4 py-2 rounded text-white disabled:opacity-25"
                  style={{
                    backgroundColor: `${currentColor}`,
                    border: `1px solid ${currentColor}`
                  }}
                  disabled={handleValidate()}
                  onClick={id ? updateContent : createContent}
                >
                  {loading ? 'Yuklanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          </>
        )
      case 1:
        return (
          <div className="flex flex-col gap-4">
            <div className={'w-full'}>
              <label
                htmlFor="service"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Video turi *
              </label>
              <select
                name="client"
                id="service"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={video_choice}
                onChange={(e) => setVideoChoice(e.target.value)}
              >
                <option value="" disabled={video_choice}>Tanlang...</option>
                <option value="1">Video qo'llanma</option>
                <option value="2">Video marketing</option>
              </select>
            </div>
            <div>
              <Input
                label={'Sarlavha (uz) *'}
                value={video_name_uz}
                onChange={(e) => setVideoNameUz(e.target.value)}
                className={'focus:border-blue-400'}
              />
            </div>
            <div>
              <Input
                label={'Sarlavha (ru) *'}
                value={video_name_ru}
                onChange={(e) => setVideoNameRu(e.target.value)}
                className={'focus:border-blue-400'}
              />
            </div>
            <div>
              <Input
                label={'Sarlavha (en) *'}
                value={video_name_en}
                onChange={(e) => setVideoNameEn(e.target.value)}
                className={'focus:border-blue-400'}
              />
            </div>
            <div>
              <Input
                label={'Video URL'}
                value={video_doc || ''}
                onChange={(e) => setVideoDoc(e.target.value)}
                className={'focus:border-blue-400'}
              />
            </div>
            <div className={'flex flex-col'}>
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">
                Video fayl
              </label>
              <input
                onChange={(e) => setVideoFile(e.target.files[0])}
                name="file"
                id="file"
                type="file"
                className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
              />
              <Link
                to={video_file_name} target="_blank"
                className="block underline text-blue-400 text-sm font-bold mb-1 ml-3"
              >
                {video_id && video_file_name}
              </Link>
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 rounded"
                style={{
                  border: `1px solid ${currentColor}`,
                  color: currentColor
                }}
                onClick={closeModal}
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-2 rounded text-white disabled:opacity-25"
                style={{
                  backgroundColor: `${currentColor}`,
                  border: `1px solid ${currentColor}`
                }}
                disabled={handleValidateVideo()}
                onClick={video_id ? updateContentVideo : createContentVideo}
              >
                {loading ? 'Yuklanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const mainDisplay = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <table className="w-full mb-8 border">
              <tbody>
                <tr
                  className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-wrap border-b-1'}
                >
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Belgi</th>
                  <td className="flex justify-center px-2 py-2">
                    <img className="size-12" src={service_detail?.image} alt="image"/>
                  </td>
                </tr>
                <tr
                  className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-wrap border-b-1'}
                >
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Izoh</th>
                  <td className="text-center px-2 py-2">
                    {service_detail?.description}
                  </td>
                </tr>
                <tr
                  className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-wrap border-b-1'}
                >
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Xizmat ko'rsatish muddati (kun)</th>
                  <td className="text-center px-2 py-2">
                    {service_detail?.period}
                  </td>
                </tr>
                <tr
                  className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-wrap border-b-1'}
                >
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Foydalanuvchilar</th>
                  <td className="text-center px-2 py-2">
                    {service_detail?.user_type}
                  </td>
                </tr>
                <tr
                  className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-wrap border-b-1'}
                >
                  <th className="text-start w-2/4 border-r-1 px-2 py-2">Bo'lim nomi</th>
                  <td className="text-center px-2 py-2">
                    {service_detail?.group?.full_name} <span className="text-sm">({service_detail?.group?.comment})</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )
      case 1:
        return (
          <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Sarlavha (uz)</th>
                <th scope="col" className="px-4 py-3">Sarlavha (ru)</th>
                <th scope="col" className="px-4 py-3">Sarlavha (en)</th>
                <th scope="col" className="px-4 py-3 text-center">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              {list && list?.map((item, index) => (
                <tr
                  key={item?.id}
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
                >
                  <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_uz?.length >= 30 ? `${item?.name_uz?.slice(0, 30)}...` : item?.name_uz}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_ru?.length >= 30 ? `${item?.name_ru?.slice(0, 30)}...` : item?.name_ru}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_en?.length >= 30 ? `${item?.name_en?.slice(0, 30)}...` : item?.name_en}
                  </td>
                  <td scope="row" className="px-6 py-2 flex items-center justify-center">
                    <button
                      className={`px-2 py-1 rounded border border-yellow-400 text-center mr-4 mb-1`}
                      onClick={() => setId(item?.id)}
                    >
                      <PencilIcon className="size-5" fill={'rgb(250 204 21)'}/>
                    </button>
                    <Link
                      to={item?.file}
                      download={true}
                      target="_blank"
                      className={`px-2 py-1 rounded border text-center mr-4 mb-1`}
                      style={{background: currentColor, borderColor: currentColor}}
                    >
                      <AiOutlineCloudDownload className="size-5" fill={'#fff'}/>
                    </Link>
                    <button
                      className={`px-2 py-1 rounded border text-center mb-1 bg-red-400`}
                      onClick={() => deleteItem(item?.id)}
                    >
                      <TrashIcon
                        className={`size-5 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
                        fill="#fff"
                      />
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        )
      case 2:
        return (
          <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Sarlavha (uz)</th>
                <th scope="col" className="px-4 py-3">Sarlavha (ru)</th>
                <th scope="col" className="px-4 py-3">Sarlavha (en)</th>
                <th scope="col" className="px-4 py-3 text-center">Boshqarish</th>
              </tr>
              </thead>
              <tbody>
              {videoList && videoList?.map((item, index) => (
                <tr
                  key={item?.id}
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
                >
                  <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_uz?.length >= 30 ? `${item?.name_uz?.slice(0, 30)}...` : item?.name_uz}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_ru?.length >= 30 ? `${item?.name_ru?.slice(0, 30)}...` : item?.name_ru}
                  </td>
                  <td scope="row" className="px-6 py-4">
                    {item?.name_en?.length >= 30 ? `${item?.name_en?.slice(0, 30)}...` : item?.name_en}
                  </td>
                  <td scope="row" className="px-6 py-2 flex items-center justify-center">
                    <button
                      className={`px-2 py-1 rounded border border-yellow-400 text-center mr-4 mb-1`}
                      onClick={() => setVideoId(item?.id)}
                    >
                      <PencilIcon className="size-5" fill={'rgb(250 204 21)'}/>
                    </button>
                    <Link
                      to={item?.video_file ? item?.video_file : item?.video_doc}
                      download={true}
                      target="_blank"
                      className={`px-2 py-1 rounded border text-center mr-4 mb-1`}
                      style={{background: currentColor, borderColor: currentColor}}
                    >
                      <EyeIcon className="size-5" fill={'#fff'}/>
                    </Link>
                    <button
                      className={`px-2 py-1 rounded border text-center mb-1 bg-red-400`}
                      onClick={() => deleteVideo(item?.id)}
                    >
                      <TrashIcon
                        className={`size-5 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
                        fill="#fff"
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
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <div className={'flex items-center justify-between'}>
        <Header category="Sahifa" title="Xizmatlar"/>
        <button
          className={'px-4 py-2 rounded text-white mb-10 disabled:opacity-25'}
          style={{backgroundColor: currentColor}}
          onClick={() => setModal(!modal)}
          disabled={!service}
        >
          Qo'shish
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded px-2 py-4">
        <div className={'w-9/12'}>
          <label
            htmlFor="service"
            className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
          >
            Xizmat turi
          </label>
          <select
            name="client"
            id="service"
            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
            value={service}
            onChange={(e) => {
              localStorage.setItem('service', e.target.value)
              setService(e.target.value)
            }}
          >
            <option value="" disabled={service}>Tanlang...</option>
            {services && services?.map((item, index) => (
              <option value={item?.id} key={index}>{item?.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          {service && (
            <TabsRender
              tabs={mainTabs}
              color={currentColor}
              openTab={mainOpenTab}
              setOpenTab={setMainOpenTab}
            />
          )}
          {
            service && (
              loading
                ?
                <Loader/>
                :
                mainDisplay(mainOpenTab)
            )
          }
        </div>
        {modal && (
          <div
            className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.25)] z-50 flex items-center justify-center"
          >
            <div className="bg-white w-9/12 max-h-[90%] overflow-x-scroll rounded p-4">
              <div className="w-full flex justify-between items-center mb-4">
                <TabsRender
                  tabs={tabs}
                  color={currentColor}
                  openTab={openTab}
                  setOpenTab={setOpenTab}
                />
                <button
                  className="bg-red-500 rounded px-3 py-1 text-white text-xl"
                  onClick={closeModal}
                >
                  X
                </button>
              </div>
              {displayStep(openTab)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Xizmatlar;