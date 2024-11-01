import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {TabsRender, DetailNav} from "../../../components";
import {useStateContext} from "../../../contexts/ContextProvider";
import moment from "moment/moment";
import {AiOutlineCloudDownload} from "react-icons/ai";
import instance from "../../../API";
import {api_url} from "../../../config";
import YurUserContractDetail from "../YurUserContractDetail";
import FizUserContractDetail from "../FizUserContractDetail";
import SignatureContract from "../SignatureContract";
import Participants from "../Participants";
import CreateEmail from "./CreateEmail";

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
    title: "Xulosa berish",
    active: false
  },
  {
    title: "Fayl birishtirish",
    active: false
  },
  {
    title: "Eski shartnomalar",
    active: false
  },
  {
    title: "Biriktirilgan xat",
    active: false
  },
  {
    title: "Lot qo'shish",
    active: false
  }
];

const EmailDetail = () => {
  const {id, slug} = useParams();
  const {currentColor} = useStateContext();
  const {contractDetail} = useSelector(state => state.contracts);

  const {user} = useSelector(state => state.user)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <DetailNav
          id={contractDetail?.contract?.id}
          name={contractDetail?.contract?.contract_number}
          status={contractDetail?.contract?.contract_status?.name ? contractDetail?.contract?.contract_status?.name : contractDetail?.contract?.contract_status}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        {
          renderDetail(
            openTab,
            contractDetail,
            currentColor,
            slug,
            setOpenTab,
            user
          )
        }
      </div>
    </>
  );
};

const renderDetail = (
  value,
  data,
  currentColor,
  slug,
  setOpenTab,
  user
) => {
  switch (value) {
    case 0:
      return (
        <>
          <table className={'w-full'}>
            <tbody className="dark:text-white">
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
            >
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma raqami</th>
              <td className={'text-center px-2 py-2'}>{data?.contract?.contract_number}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma sanasi</th>
              <td className={'text-center px-2 py-2'}>{moment(data?.contract?.contract_date).format('DD.MM.YYYY')}</td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma holati</th>
              <td className={'text-center px-2 py-2'}>{data?.contract?.contract_status?.name
                ? data?.contract?.contract_status?.name
                : data?.contract?.contract_status}</td>
            </tr>
            {data?.contract?.pay_choose === 1 && (
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Lot raqami</th>
                <td className={'text-center px-2 py-2'}>{data?.contract?.lot_number
                  ? data?.contract?.lot_number
                  : '-'}</td>
              </tr>
            )}
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
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
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'lov miqdori</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.contract_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'landi</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.payed_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Qarzdorlik</th>
              <td
                className={'text-center px-2 py-2'}>{data?.contract?.arrearage?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
              </td>
            </tr>
            <tr
              className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
              <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Fayl yuklab olish</th>
              <td className={'text-center px-2 py-2'}>
                <AiOutlineCloudDownload
                  className={`size-6 m-auto ${data?.contract?.contract_status === 'Shartnomani raqami bron qilingan' ? 'opacity-25 pointer-events-none' : 'cursor-pointer'}`}
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
          <Participants/>
        </>
      )
    case 3:
      return (
        <SignatureContract setOpenTab={setOpenTab}/>
      )
    case 4:
      return (
        user?.userdata?.role?.name === "IUT XRvaEQB boshlig'ining o'rinbosari" ? <CreateEmail/> : <h1 className="text-center dark:text-white">Shartnoma yuklay olmaysiz</h1>
      )
    case 5:
      return (
        <>
          {data?.related_contracts?.map((el, index) => (
            <table key={el?.id} className={'w-full my-5'}>
              <thead className="my-4">
                <tr>
                  <td className="font-bold">Exat {index + 1}</td>
                </tr>
              </thead>
              <tbody className="border dark:text-white">
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma raqami</th>
                <td className={'text-center px-2 py-2'}>{el?.contract_number}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma sanasi</th>
                <td className={'text-center px-2 py-2'}
                >{moment(el?.contract_date).format('DD.MM.YYYY')}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Shartnoma holati</th>
                <td className={'text-center px-2 py-2'}>{el?.contract_status?.name
                  ? el?.contract_status?.name
                  : el?.contract_status}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Amal qilish muddati</th>
                <td className={'text-center px-2 py-2'}>{el?.expiration_date == null
                  ? moment(data?.contract?.contract_date)
                    .add(1, 'y')
                    .format('DD.MM.YYYY')
                  : moment(el?.expiration_date).format(
                    'DD.MM.YYYY',
                  )}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'lov miqdori</th>
                <td
                  className={'text-center px-2 py-2'}
                >{el?.contract_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>To'landi</th>
                <td
                  className={'text-center px-2 py-2'}
                >{el?.payed_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
                </td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Qarzdorlik</th>
                <td
                  className={'text-center px-2 py-2'}
                >{el?.arrearage?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm
                </td>
              </tr>
              </tbody>
            </table>
          ))}
        </>
      )
    case 6:
      return (
        data?.signed_letter?.id ? (
          <>
            <table className={'w-full'}>
              <tbody className="dark:text-white">
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Xat raqami</th>
                <td className={'text-center px-2 py-2'}>{data?.signed_letter?.letter_number}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Xat sanasi</th>
                <td
                  className={'text-center px-2 py-2'}>{moment(data?.signed_letter?.letter_date).format('DD-MM-YYYY')}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Ijrochi</th>
                <td
                  className={'text-center px-2 py-2'}>{data?.signed_letter?.performer_full_name}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}
              >
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Ijrochi telefon raqami</th>
                <td
                  className={'text-center px-2 py-2'}>{data?.signed_letter?.performer_phone_number}</td>
              </tr>
              <tr
                className={'text-start hover:bg-gray-100 hover:dark:bg-gray-800 hover:dark:text-white font-medium whitespace-nowrap border-b-1'}>
                <th className={'text-start w-2/4 border-r-1 px-2 py-2'}>Fayl yuklab olish</th>
                <td className={'text-center px-2 py-2 cursor-pointer'}>
                  <AiOutlineCloudDownload
                    className={`size-6 m-auto`}
                    onClick={() => {
                      window.open(data?.signed_letter?.file, '_blank')
                    }}
                  />
                </td>
              </tr>
              </tbody>
            </table>
          </>
        ) : <h1 className="text-center dark:text-white">Xat mavjud emas</h1>
      )
    case 7:
      return (
        user?.userdata?.role?.name === "IUT XRvaEQB boshlig'ining o'rinbosari" ? (<></>) :
          <h1 className="text-center dark:text-white">Lot qo'sha olmaysiz</h1>
      )
    default:
      return null
  }
  
}

export default EmailDetail;
