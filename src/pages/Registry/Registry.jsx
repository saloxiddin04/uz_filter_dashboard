import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getRegistries, getServices} from "../../redux/slices/registry/registrySlice";
import {Header, Loader} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import instance from "../../API";
import {ArrowPathIcon, EyeIcon} from "@heroicons/react/16/solid";
import moment from "moment/moment";
import {AiOutlineCloudDownload} from "react-icons/ai";

const Registry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {slug} = useParams()

  const {currentColor} = useStateContext();

  const {services, loading, registries} = useSelector((state) => state.registry);

  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')

  const filteredId = services?.find(el => el.slug === slug);

  useEffect(() => {
    dispatch(getServices()).then((res) => {
      const filtered = res?.payload?.filter(el => el.slug === 'colocation' || el.slug === 'vps')?.reverse()
      if (filtered?.length > 0 && !slug) {
        navigate(`/registry/${filtered[0]?.slug}`, {state: {slug: filtered[0]?.slug}});
      }
    })
  }, [dispatch, slug]);

  useEffect(() => {
    if (slug && services) {
      dispatch(getRegistries({id: filteredId?.id}))
    }
  }, [slug, services, dispatch]);

  const searchRegistry = () => {
    dispatch(getRegistries({id: filteredId?.id, year, month}))
  }

  const downloadRegistry = async (id) => {
    try {
      const response = await instance.get(`/registry-book/download/registry-book/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registry-book-${id}.xlsx`);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the registry book:', error);
    }
  };

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
        <div className={'flex items-center justify-between'}>
          <Header category="Reestr" title={slug?.toUpperCase()}/>
          <button
            className={'px-4 py-2 rounded text-white mb-10'}
            style={{backgroundColor: currentColor}}
            onClick={() => navigate(`/registry/${slug}/create`)}
          >
            Reestr yaratish
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded px-2 py-4">
          <div className="flex justify-between items-center">
            <div className={'w-[49%] flex flex-col'}>
              <label
                htmlFor="client"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Oy
              </label>
              <select
                name="client"
                id="client"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="" disabled={month}>Tanlang...</option>
                <option value="01">Yanvar</option>
                <option value="02">Favral</option>
                <option value="03">Mart</option>
                <option value="04">Aprel</option>
                <option value="05">May</option>
                <option value="06">Iyun</option>
                <option value="07">Iyul</option>
                <option value="08">Avgust</option>
                <option value="09">Sentabr</option>
                <option value="10">Oktabr</option>
                <option value="11">Noyabr</option>
                <option value="12">Dekabr</option>
              </select>
            </div>
            <div className={'w-[49%] flex items-end justify-between'}>
              <div className={'w-[75%] flex flex-col'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Yil
                </label>
                <select
                  name="client"
                  id="client"
                  className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="" disabled={year}>Tanlang...</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
              <button
                className={`w-[10%] px-4 py-2 rounded text-white ${!month || !year ? 'opacity-50' : 'opacity-1'}`}
                style={{backgroundColor: currentColor}}
                onClick={searchRegistry}
                disabled={!month || !year}
              >
                Izlash
              </button>
              <button
                className={`px-4 py-2 rounded border text-center`}
                style={{borderColor: currentColor}}
                onClick={() => {
                  setYear('')
                  setMonth('')
                  dispatch(getRegistries({id: filteredId?.id}))
                }}
              >
                <ArrowPathIcon className="size-6" fill={currentColor}/>
              </button>
            </div>
          </div>
          {
            loading
              ?
              <Loader/>
              :
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
                <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center"
                >
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-4 py-3">Reestr raqami</th>
                  <th scope="col" className="px-4 py-3">Reestr sanasi</th>
                  <th scope="col" className="px-4 py-3">Reestr turi</th>
                  <th scope="col" className="px-4 py-3">Reestr holati</th>
                  <th scope="col" className="px-4 py-3">Reestr (oy uchun)</th>
                  <th scope="col" className="px-4 py-3">Boshqarish</th>
                </tr>
                </thead>
                <tbody>
                {registries?.registry_data && registries?.registry_data?.map((item, index) => (
                  <tr
                    key={item?.id}
                    className={'hover:bg-gray-100 hover:dark:bg-gray-800 text-center border-b-1'}
                  >
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {index + 1}
                    </td>
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {item?.number}
                    </td>
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {moment(item?.created_time).format('DD.MM.YYYY')}
                    </td>
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {item?.type}
                    </td>
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {item?.status}
                    </td>
                    <td scope="row" className="px-6 py-4 border-b-1">
                      {item?.created_time_month}
                    </td>
                    <td className="px-6 py-2 flex items-center justify-center">
                      <button
                        className={`px-2 py-1 rounded border text-center mr-4 mb-1`}
                        style={{borderColor: currentColor}}
                        onClick={() => downloadRegistry(item?.id)}
                      >
                        <AiOutlineCloudDownload className="size-6" fill={currentColor}/>
                      </button>
                      <button
                        className={`px-2 py-1 rounded border text-center mb-1`}
                        style={{background: currentColor}}
                        onClick={() => dispatch(getRegistries({id: filteredId?.id}))}
                      >
                        <EyeIcon
                          style={{background: currentColor}}
                          className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
                          fill="#fff"
                          onClick={() => navigate(`${item.id}`)}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </>
  );
};

export default Registry;