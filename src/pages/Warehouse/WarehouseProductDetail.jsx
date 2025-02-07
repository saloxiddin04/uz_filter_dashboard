import React, {useEffect, useState} from 'react';
import {DetailNav, Input, TabsRender} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getHistoryProductForWarehouse, getProductForWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {useStateContext} from "../../contexts/ContextProvider";
import {AiOutlineDownload} from "react-icons/ai";

const tabs = [
  {
    title: "Продукт",
    active: true
  },
  {
    title: "История",
    active: false
  }
]

const WarehouseProductDetail = () => {
  const dispatch = useDispatch()
  const {id} = useParams()
  const {currentColor} = useStateContext();
  
  const {loading, productForWarehouse, historyProductForWarehouse} = useSelector(state => state.warehouse)
  
  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
  
  useEffect(() => {
    if (id && openTab === 0) {
      dispatch(getProductForWarehouse(id))
    } else {
      dispatch(getHistoryProductForWarehouse({
        id,
        params: {
          page: 1,
          page_size: 10
        }
      }))
    }
  }, [id, dispatch, openTab])
  
  const renderDetail = () => {
    switch (openTab) {
      case 0:
        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="w-[49%]">
                <Input
                  type="text"
                  placeholder="Название продукта"
                  label={'Название продукта'}
                  value={productForWarehouse?.product?.name || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
              <div className="w-[49%]">
                <Input
                  type="text"
                  placeholder="Категория продукта"
                  label={'Категория продукта'}
                  value={productForWarehouse?.product_variant?.category?.name || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 ml-3">Описание</label>
              <textarea
                className="w-full border rounded shadow focus:outline-none p-2"
                rows={5}
                value={productForWarehouse?.product?.description || ''}
                disabled={true}
                id="description"
              />
            </div>
            
            <div className="mb-6 w-full flex flex-wrap gap-5">
              <h2 className="text-lg font-semibold mb-3 w-full">Изображения продуктов</h2>
              {productForWarehouse?.product?.product_files && productForWarehouse?.product?.product_files?.map((file) => (
                <div key={file?.id} className="w-52 aspect-auto">
                  <img loading="lazy" className="object-cover" src={file?.image?.file} alt={file?.image?.file} />
                </div>
              ))}
            </div>
            
            <div className="mt-4 w-full flex flex-wrap justify-between">
              <div className="w-[24%] flex flex-col">
                <Input
                  type="text"
                  label={"Количество"}
                  placeholder={"Количество"}
                  value={productForWarehouse?.quantity || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
              <div className="w-[24%] flex flex-col">
                <Input
                  type="text"
                  label={"Общая сумма"}
                  placeholder={"Общая сумма"}
                  value={productForWarehouse?.quantity_price?.toLocaleString("ru-Ru") || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
              <div className="w-[24%] flex flex-col">
                <Input
                  type="text"
                  label={"Код продукта"}
                  placeholder={"Код продукта"}
                  value={productForWarehouse?.product_variant?.unique_code || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
              <div className="w-[24%] flex flex-col">
                <Input
                  type="text"
                  label={"Скидка (%)"}
                  placeholder={"Скидка (%)"}
                  value={productForWarehouse?.product_variant?.discount || ""}
                  disabled={true}
                  className={'w-full'}
                />
              </div>
            </div>
            
            <div className="mt-4 w-full flex flex-wrap border rounded p-2">
              <h3 className="font-semibold mb-2 w-full">Атрибуты</h3>
              {productForWarehouse?.product_variant?.product_variant_attributes && productForWarehouse?.product_variant?.product_variant_attributes?.map((item) => (
                <div key={item?.id} className="flex items-center gap-4 mb-2 w-full">
                  <div className="w-[49%]">
                    <Input
                      type="text"
                      value={item?.attribute?.name || ""}
                      disabled={true}
                      className={'w-full'}
                    />
                  </div>
                  <div className="w-[49%]">
                    <Input
                      type="text"
                      value={item?.value || ""}
                      disabled={true}
                      className={'w-full'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      case 1:
        return (
          <>
            {historyProductForWarehouse?.result?.map((item) => (
              <div key={item?.id} className="p-2 border rounded flex justify-between items-end flex-wrap gap-4">
                <div className={'flex flex-col w-[35%]'}>
                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                    Название склада
                  </label>
                  <input
                    value={item?.warehouse_action?.warehouse?.name || ""}
                    // onChange={(e) => setProductName(e.target.value)}
                    disabled={true}
                    name="amount"
                    id="amount"
                    type="text"
                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
                <div className={'flex flex-col w-[35%]'}>
                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                    Тел. склада
                  </label>
                  <input
                    value={item?.warehouse_action?.warehouse?.phone_number || ""}
                    disabled={true}
                    name="amount"
                    id="amount"
                    type="text"
                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
                {item?.warehouse_action?.file && (
                  <div className="w-[10%]">
                    <a
                      href={item.warehouse_action.file}
                      download
                      target="_blank"
                      className="p-2 rounded border flex items-center justify-center"
                      style={{borderColor: currentColor}}
                    >
                      <AiOutlineDownload className="size-6" style={{color: currentColor}} />
                    </a>
                  </div>
                )}
                
                <div className="w-full flex flex-col">
                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
                    Описания склада
                  </label>
                  <textarea
                    cols="10"
                    rows="10"
                    value={item?.warehouse_action?.description || ""}
                    disabled={true}
                    id="description"
                    className="border rounded p-2 w-full focus:outline-none"
                  />
                </div>
                
                <div className="w-full flex flex-wrap justify-between border rounded p-2">
                  <h3 className="font-semibold mb-2 w-full">Действие продукта</h3>
                  <div className={'flex flex-col w-[48%]'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="quantity">
                      Количество
                    </label>
                    <input
                      value={item?.product_action?.quantity || ""}
                      disabled={true}
                      name="quantity"
                      id="quantity"
                      type="text"
                      className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                  <div className={'flex flex-col w-[48%]'}>
                    <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="quantity">
                      Тип действия
                    </label>
                    <input
                      value={
                        item?.product_action?.action_type === 0 ?
                          "Добавлен товар" :
                          item?.product_action?.action_type === 1 ?
                            "Удаленный продукт" :
                            item?.product_action?.action_type === 2 ?
                              "Проданный продукт" : ""
                              || ""
                      }
                      disabled={true}
                      name="quantity"
                      id="quantity"
                      type="text"
                      className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )
      default:
        return <p>Wrong tab</p>
    }
  }
  
  // console.log(id)
  
  return (
    <>
      <div className="card">
        <DetailNav
          id={productForWarehouse?.product?.id}
          name={productForWarehouse?.product?.name}
          status={''}
        />
      </div>
      
      <div className="card">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
      <div className="card">
        {renderDetail()}
      </div>
    </>
  );
};

export default WarehouseProductDetail;