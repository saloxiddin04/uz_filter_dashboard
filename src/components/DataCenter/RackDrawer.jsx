import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
  addRack,
  clearDataCenter,
  deleteDevice, getListProvider, getRackContractDetail,
  getRackContractInfo,
  getRackDetail, patchDeviceConfig
} from "../../redux/slices/dataCenter/dataCenterSlice";
import {useParams} from "react-router-dom";
import moment from "moment/moment";
import {Input} from "../index";
import {useStateContext} from "../../contexts/ContextProvider";

const RackDrawer = ({onClose, type}) => {
  const dispatch = useDispatch();
  const { id, rackId } = useParams();

  const {currentColor} = useStateContext();

  const {loading, rack_detail, listProvider, deviceDetail, unitContractInfo, contractInfo, rack_contract_detail, rackContractInfo, updateRack} = useSelector(state => state.dataCenter);

  const [contractNumber, setContractNumber] = useState('')
  const [contractDate, setContractDate] = useState('')
  const [connectMethod, setConnectMethod] = useState(rack_contract_detail?.device_colocation?.provider)
  const [connectContractNumber, setConnectContractNumber] = useState(rack_contract_detail?.device_colocation?.provider_contract_number)
  const [odf_count, setOdfCount] = useState(rack_contract_detail?.device_colocation?.odf_count)
  const [modal, setModal] = useState(false)
  const [comment, setComment] = useState(rack_contract_detail?.device_colocation?.description)
  const [connectContractDate, setConnectContractDate] = useState(rack_contract_detail?.device_colocation?.provider_contract_date)

  const sendContractNumber = () => {
    dispatch(getRackContractInfo({contract_number: contractNumber, data_center: id, rack_id: rackId}))
  }

  const handleChange = (event) => {
    setConnectMethod(event.target.value)
  }

  const handleLabel = (status) => {
    if (status === "To'lov kutilmoqda" || status === "Aktiv") return 'Shartnoma raqami'
    if (!status) return 'Shartnoma raqami'
    else return 'Shartnoma rahbariyat tomonlama imzolanmagan!'
  }

  const handleLabelColor = (status) => {
    if (status === "To'lov kutilmoqda" || status === 'Aktiv') return '#5B5B5B'
    if (!status) return '#5B5B5B'
    else return 'red'
  }

  const handleDisabled = (status) => {
    if (status !== "To'lov kutilmoqda" || status === 'Aktiv') return false
    // if (status !== "To'lov kutilmoqda") return true
    if (!status) return true
    if (connectMethod?.length < 1) return true
    if (contractInfo?.empty === 0) return true
    else return false
  }

  const handleDisabledOpacity = (status) => {
    if (status !== "To'lov kutilmoqda") return 1
    // if (status !== "To'lov kutilmoqda") return 0.5
    if (!status) return 0.5
    if (connectMethod?.length < 1) return 0.5
    if (contractInfo?.empty === 0) return 0.5
    else return 1
  }

  const clearData = () => {
    onClose()
    dispatch(clearDataCenter())
  }

  const handleDeleteRack = () => {
    onClose()
    dispatch(deleteDevice({id: rackId, slug: 'rack'})).then((res) => {
      if (res?.payload?.success) {
        dispatch(getRackDetail(rackId))
      }
    })
  }

  const handleUpdateRack = () => {
    const data = {
      description: comment,
      odf_count,
      provider: connectMethod,
      provider_contract_number: connectContractNumber,
      provider_contract_date: connectContractDate ? moment(connectContractDate).format('YYYY-MM-DD') : null
    }
    dispatch(patchDeviceConfig({data, id: rack_contract_detail?.device_colocation?.id})).then(() => {
      dispatch(getRackContractDetail(rackId))
    })
  }

  const handleAddRack = () => {
    const data = {
      contract: rackContractInfo?.id,
      provider: connectMethod,
      provider_contract_number: connectContractNumber,
      description: comment,
      odf_count: Number(odf_count),
      provider_contract_date: contractDate !== '' ? moment(contractDate).format('YYYY-MM-DD') : null,
    }
    onClose()
    dispatch(addRack({rack_id: rackId, data, data_center_id: id})).then(() => {
      dispatch(getRackDetail(rackId))
      dispatch(getListProvider())
    })
  }

  return (
    <div
      className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
      style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
    >
      {type === 'sold' && (
        <div className="bg-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16">
          <div className="flex flex-col gap-4">
            <button
              className="px-4 py-2 w-[10%] rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              onClick={() => onClose()}
            >
              Yopish
            </button>
            <div className="font-bold text-2xl">Rack sotib olinganlik belgisi</div>
            <button
              className="px-4 py-2 w-[20%] rounded bg-red-500 text-white"
              onClick={handleDeleteRack}
            >
              Belgini o'chirish
            </button>
          </div>

          <div className="font-bold text-center">Shartnoma maʼlumotlari</div>
          <div className="my-4 flex justify-between">
            <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
              <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                {/*<ContractIcon />*/}
                <span className="font-bold">Shartnoma</span>
              </div>
              <div className={'w-full flex items-end gap-4'}>
                <div className={'w-full'}>
                  <Input
                    value={rack_contract_detail?.contract_number || ''}
                    disabled={true}
                    label={'Shartnoma raqami'}
                  />
                </div>
              </div>
              <div className="w-full">
                <Input
                  label={'STIR/JShShIR'}
                  value={rack_contract_detail?.client?.name ? rack_contract_detail?.client?.tin : rack_contract_detail?.client?.pin || ""}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="w-full">
                <Input
                  label={'Shartnoma sanasi'}
                  value={moment(rack_contract_detail?.contract_date).format('DD-MM-YYYY') || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="w-[49%]">
                  <Input
                    label={'Rack soni'}
                    value={rack_contract_detail?.rack_count || ''}
                    type={'text'}
                    disabled={true}
                  />
                </div>
                <div className="w-[49%]">
                  <Input
                    label={'Rack qoldigi'}
                    value={rack_contract_detail?.rack_quota || ''}
                    type={'text'}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
              <div>
                {/*<SoldIcon />*/}
                <span className="font-bold">Mijoz</span>
              </div>
              <div className="w-full">
                <Input
                  label={'F.I.SH'}
                  value={
                    rack_contract_detail?.client?.name ? rack_contract_detail?.client?.name :
                      rack_contract_detail?.client?.full_name || ""
                  }
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="w-full">
                <Input
                  label={'Telefon'}
                  value={rack_contract_detail?.client?.mob_phone_no || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="w-full">
                <Input
                  label={'Pochta manzili'}
                  value={rack_contract_detail?.client?.email || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="my-4">
            <div className="text-center font-bold">Izoh</div>
            <textarea
              cols="30"
              rows="10"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded w-full border outline-none p-4"
            />
          </div>

          <div className="rounded p-4 border">
            <div className="flex flex-wrap gap-4">
              <div className="pb-4">
                {/*<LanguageIcon color="#0E0E4B" />*/}
                <span className="font-bold">Internetga ulanish manbayi</span>
              </div>
              <div className="w-full">
                <Input
                  label={'ODF soni'}
                  value={odf_count || ''}
                  type={'text'}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    setOdfCount(numericValue);
                  }}
                />
              </div>
              <div className={'w-full'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Provayder nomi
                </label>
                <select
                  name="client"
                  id="client"
                  className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                  value={connectMethod}
                  onChange={(e) => setConnectMethod(e.target.value)}
                >
                  <option value="" disabled={connectMethod}>Tanlang...</option>
                  {listProvider?.internet_provider?.map((item, index) => (
                    <option value={item?.id} key={index}>{item?.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <Input
                  label={'Shartnoma raqami'}
                  value={connectContractNumber || ''}
                  type={'text'}
                  onChange={(e) => setConnectContractNumber(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Input
                  label={'Shartnoma sanasi'}
                  value={contractDate || ''}
                  type={'date'}
                  onChange={(e) => setContractDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded border p-4 my-4">
            <div className="flex flex-wrap gap-4">
              <div>
                {/*<PaymentIcon />*/}
                <span className="font-bold">Toʼlov</span>
              </div>
              <div className="w-full">
                <Input
                  label={"To'lov miqdori"}
                  value={updateRack?.contract?.contract_cash || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="w-full">
                <Input
                  label={"Joriy oy uchun to'landi"}
                  value={updateRack?.contract?.payed_cash || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
              <div className="w-full">
                <Input
                  label={"Qarzdorlik"}
                  value={updateRack?.contract?.arrearage || ''}
                  type={'text'}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {updateRack && (
                <>
                  <div className="w-full">
                    <Input
                      label={"Shartnoma holati"}
                      value={updateRack?.contract?.contract_status?.name || ''}
                      type={'text'}
                      disabled={true}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      label={"Shartnoma amal qilish muddati"}
                      value={
                        rack_contract_detail?.expiration_date
                          ? rack_contract_detail?.expiration_date
                          : `${moment(updateRack?.contract_date).add(1, 'y').format('DD-MM-YYYY')}`
                      }
                      type={'text'}
                      disabled={true}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="ml-auto w-full flex justify-start gap-4">
            <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={onClose}>Bekor qilish</button>
            <button
              className={`px-4 py-2 rounded text-white`}
              style={{
                backgroundColor: currentColor,
              }}
              onClick={handleUpdateRack}
            >
              Saqlash
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default RackDrawer;