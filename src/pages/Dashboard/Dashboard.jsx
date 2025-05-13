import React, {useEffect, useRef} from 'react';
import {Header, Loader} from "../../components";
import {LineChart, PieChart} from "@mui/x-charts";
import {useDispatch, useSelector} from "react-redux";
import {
  getAddedProductActions,
  getProductActionStatistics, getRemovedProductActions, getSolProductActions,
  getWarehouseStatistics
} from "../../redux/slices/dashboard/dashboardSlice";
import moment from "moment/moment";

const Dashboard = () => {
  const dispatch = useDispatch()
  
  const {
    loading,
    warehouse,
    productActions,
    addedProductActions,
    removedProductActions,
    soldProductActions
  } = useSelector(state => state.dashboard)
  
  const lineChart = useRef(null)
  
  useEffect(() => {
    dispatch(getWarehouseStatistics())
    dispatch(getProductActionStatistics())
    dispatch(getAddedProductActions())
    dispatch(getRemovedProductActions())
    dispatch(getSolProductActions())
  }, [dispatch])
  
  const colors = ['#1A97F5', '#03C9D7', '#7352FF', '#1E4DB7', '#FB9678']
  
  const dataWarehouseCount = [
    {label: 'Склады сырья кол-во', value: warehouse?.warehouse_material?.warehouse_count, color: colors[0]},
    {label: 'Склады готовой продукции кол-во', value: warehouse?.warehouse_product?.warehouse_count, color: colors[3]}
  ];
  
  const dataProducts = [
    {label: 'Тип готовый продукта кол-во', value: warehouse?.warehouse_product?.warehouse_count, color: colors[2]},
    {label: 'Тип сырья продукта кол-во', value: warehouse?.warehouse_material?.warehouse_count, color: colors[1]}
  ];
  
  const xAxisData = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const seriesData = [
    [
      20, 30, 10, 50, 100, 120, 100, 70, 90, 200, 250, 200
    ]
  ]
  
  if (loading) return <Loader />
  
  return (
    <div className="card">
      <div>
        <Header category="Page" title="Dashboard"/>
        
        <div className="w-full flex justify-between flex-wrap mt-4 dark:text-white">
          <div className="card_dashboard w-full flex gap-4 justify-between">
            <div className="w-[25%] p-3 border rounded border-green-400 bg-green-500 text-white">
              <p className="text-2xl">Количество товаров, добавленных на склад (сум)</p>
              <h1 className="text-2xl font-bold">+{productActions?.added?.total_price}</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-red-400 bg-red-500 text-white">
              <p className="text-2xl">Количество продукции, покинувшей склад (сум)</p>
              <h1 className="text-2xl font-bold">-{productActions?.removed?.total_price}</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-blue-400 bg-blue-500 text-white">
              <p className="text-2xl">Всего</p>
              <h1 className="text-2xl font-bold">700</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-yellow-400 bg-yellow-500 text-white">
              <p className="text-2xl">Количество проданной продукции (сум)</p>
              <h1 className="text-2xl font-bold">{productActions?.sold?.total_price}</h1>
            </div>
          </div>
          
          <div className="w-[49%] h-2/4">
            <h1 className="text-2xl p-4 font-bold">Количество склады</h1>
            <div className="w-full h-full relative overflow-hidden shadow-md sm:rounded flex">
              <div>
                <PieChart
                  series={[
                    {
                      innerRadius: 0,
                      outerRadius: 80,
                      id: "series-3",
                      data: dataWarehouseCount
                    },
                  ]}
                  width={300}
                  height={300}
                  slotProps={{
                    legend: {hidden: true},
                  }}
                />
              </div>
              <div className={'flex flex-col items-start justify-center'}>
                {dataWarehouseCount.map((item, index) => (
                  <div key={index} className={'flex items-center'}>
                    <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                    <span>{item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-[49%] h-2/4">
            <h1 className="text-2xl p-4 font-bold">Продукты</h1>
            <div className="w-full h-full relative overflow-hidden shadow-md sm:rounded flex">
              <div>
                <PieChart
                  series={[
                    {
                      innerRadius: 0,
                      outerRadius: 80,
                      id: "series-3",
                      data: dataProducts
                    },
                  ]}
                  width={300}
                  height={300}
                  slotProps={{
                    legend: {hidden: true},
                  }}
                />
              </div>
              <div className={'flex flex-col items-start justify-center'}>
                {dataProducts.map((item, index) => (
                  <div key={index} className={'flex items-center'}>
                    <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                    <span>{item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <h1 className={'text-2xl p-4 font-bold'}>Топ добавленных товаров</h1>
            <div className="w-full relative overflow-hidden shadow-md sm:rounded">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-4 py-3">Название продукта</th>
                  <th scope="col" className="px-4 py-3">Название склад</th>
                  <th scope="col" className="px-4 py-3">Уникальный код</th>
                  <th scope="col" className="px-4 py-3">Время создания</th>
                  <th scope="col" className="px-4 py-3">Общая сумма (сум)</th>
                  <th scope="col" className="px-4 py-3">Количество</th>
                </tr>
                </thead>
                <tbody>
                {addedProductActions?.map((item, index) => (
                  <tr key={index} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                    <td className={'px-4 py-1'}>
                      {index + 1}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.warehouse?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product_variant?.unique_code}
                    </td>
                    <td className={'px-3 py-1'}>
                      {moment(item?.created_time).format('DD-MM-YYYY')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_quantity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="w-full">
            <h1 className={'text-2xl p-4 font-bold'}>Топ продаваемые продукты</h1>
            <div className="w-full relative overflow-hidden shadow-md sm:rounded">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-4 py-3">Название продукта</th>
                  <th scope="col" className="px-4 py-3">Название склад</th>
                  <th scope="col" className="px-4 py-3">Уникальный код</th>
                  <th scope="col" className="px-4 py-3">Время создания</th>
                  <th scope="col" className="px-4 py-3">Общая сумма (сум)</th>
                  <th scope="col" className="px-4 py-3">Количество</th>
                </tr>
                </thead>
                <tbody>
                {soldProductActions?.map((item, index) => (
                  <tr key={index} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                    <td className={'px-4 py-1'}>
                      {index + 1}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.warehouse?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product_variant?.unique_code}
                    </td>
                    <td className={'px-3 py-1'}>
                      {moment(item?.created_time).format('DD-MM-YYYY')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_quantity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="w-full">
            <h1 className={'text-2xl p-4 font-bold'}>Топ удаленних продукты</h1>
            <div className="w-full relative overflow-hidden shadow-md sm:rounded">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-4 py-3">Название продукта</th>
                  <th scope="col" className="px-4 py-3">Название склад</th>
                  <th scope="col" className="px-4 py-3">Уникальный код</th>
                  <th scope="col" className="px-4 py-3">Время создания</th>
                  <th scope="col" className="px-4 py-3">Общая сумма (сум)</th>
                  <th scope="col" className="px-4 py-3">Количество</th>
                </tr>
                </thead>
                <tbody>
                {removedProductActions?.map((item, index) => (
                  <tr key={index} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                    <td className={'px-4 py-1'}>
                      {index + 1}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.warehouse?.name}
                    </td>
                    <td className={'px-3 py-1'}>
                      {item?.product_variant?.unique_code}
                    </td>
                    <td className={'px-3 py-1'}>
                      {moment(item?.created_time).format('DD-MM-YYYY')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                    <td className="px-3 py-1 text-center">
                      {item?.total_quantity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/*<div className={'w-full h-2/4'}>*/}
          {/*<h1 className={'text-2xl p-4 font-bold'}>Продано по месяцам</h1>*/}
          {/*  <div className={'w-full h-full relative overflow-hidden shadow-md sm:rounded flex'}>*/}
          {/*    <div ref={lineChart} className="w-full overflow-hidden">*/}
          {/*      <LineChart*/}
          {/*        xAxis={[*/}
          {/*          {*/}
          {/*            data: xAxisData,*/}
          {/*            tickInterval: xAxisData,*/}
          {/*            scaleType: "band",*/}
          {/*            valueFormatter: (date) => date*/}
          {/*          },*/}
          {/*        ]}*/}
          {/*        series={[*/}
          {/*          {label: "Продано", data: seriesData[0]},*/}
          {/*        ]}*/}
          {/*        width={lineChart?.current?.offsetWidth}*/}
          {/*        height={400}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;