import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {getApplicationDetail} from "../../redux/slices/applications/applicationsSlice";
import {AiOutlineCloudDownload} from "react-icons/ai";
import {DetailNav, Loader, TabsRender} from "../../components";
import FizUserApplicationDetail from "./FizUserApplicationDetail";
import YurUserApplicationDetail from "./YurUserApplicationDetail";

const tabs = [
  {
    title: 'Ariza',
    active: true
  },
  {
    title: "Shaxs ma'lumotlari",
    active: false
  }
];
const ApplicationDetail = () => {
  const {id} = useParams();
  const dispatch = useDispatch()
  const {applicationDetail, loading} = useSelector(state => state.applications)
  const {currentColor} = useStateContext();

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  useEffect(() => {
    dispatch(getApplicationDetail(id))
  }, [id]);

  if (loading) return <Loader/>

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded">
        <DetailNav
          id={id}
          status={applicationDetail?.is_contracted ? 'Shartnoma yuborildi' : 'Yangi'}
          name={applicationDetail?.pk}
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
            applicationDetail
          )
        }
      </div>
    </>
  );
};

const renderDetail = (value, data) => {
  switch (value) {
    case 0:
      return (
        <>
          <table className={'w-full'}>
            <tbody>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Ariza raqami</th>
              <td className={'text-center px-2 py-2'}>{data?.pk}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Ariza holati</th>
              <td className={'text-center px-2 py-2'}>{data?.is_contracted ? 'Shartnoma yuborildi' : 'Yangi'}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Yuborilgan xabar</th>
              <td className={'text-center px-2 py-2'}>{data?.message}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Fayl yuklab olish</th>
              <td className={'text-center px-2 py-2'}>
                <AiOutlineCloudDownload
                  className={'size-6 m-auto cursor-pointer'}
                  onClick={() => {
                    const fileURL = data?.file;
                    const link = document.createElement("a", "target: __blank");
                    link.href = fileURL;
                    link.target = '__blank'
                    link.download = '';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
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
          {!data?.user?.bank_mfo ? (
            <FizUserApplicationDetail/>
          ) : (
            <YurUserApplicationDetail/>
          )}
        </>
      )
    default:
      return null
  }
}

export default ApplicationDetail;