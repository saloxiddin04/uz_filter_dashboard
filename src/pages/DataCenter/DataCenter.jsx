import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getDataCenterList, getDataCenterListDetail} from "../../redux/slices/dataCenter/dataCenterSlice";
import {Header, Loader} from "../../components";
import Rack from "../../components/DataCenter/Rack";

const DataCenter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const {loading, dataCenterListDetail} = useSelector(state => state.dataCenter);

  useEffect(() => {
    dispatch(getDataCenterList()).then((res) => {
      if (!id) {
        navigate(`/data-center/${res?.payload[0]?.id}`);
      }
    })
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getDataCenterListDetail(id))
    }
  }, [id]);

  const withSort = dataCenterListDetail?.racks?.map(rack => ({...rack}))
    .sort((rack1, rack2) => rack1.place_number - rack2.place_number);

  const divideArray = (arr, chunkSize) => {
    const dividedArrays = [];
    for (let i = 0; i < arr?.length; i += chunkSize) {
      dividedArrays.push(arr?.slice(i, i + chunkSize));
    }
    return dividedArrays;
  };

  const dividedRackData = divideArray(withSort, 7).map(chunk => {
    return chunk;
  });

  const divideArray2 = (arr, chunkSizes) => {
    const dividedArrays = [];
    let start = 0;
    chunkSizes?.forEach(size => {
      dividedArrays.push(arr?.slice(start, start + size));
      start += size;
    });
    return dividedArrays;
  };

  const dividedRackData2 = divideArray2(withSort, [9, 9, 10, 10]).map(chunk => {
    chunk?.forEach((rack) => {
      rack.type = 'rack'
    });
    return chunk;
  });

  if (loading) return <Loader/>

  if (dataCenterListDetail?.data_center_choice === 'data-center-1') {
    return (
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
        <div className={'flex items-center justify-between'}>
          <Header category="Data markaz" title={dataCenterListDetail?.display_name}/>
        </div>
        <div className="shadow-md sm:rounded py-4">
          <div
            className="relative overflow-x-auto w-full py-10"
            style={{
              backgroundImage: `url(${dataCenterListDetail?.background_image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className={'flex items-center justify-center gap-14 pb-14 ml-24'}>
              <div className="capsula">
                <div className="text-center">CAPSULA № 1</div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    {dividedRackData[0]?.reverse()?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={(rack?.place_number === 1 || rack?.place_number === 16 || rack?.place_number === 15 || rack?.place_number === 2) ? 'ups' : 'rack'}
                          left={true}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col">
                    {dividedRackData[1]?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={(rack?.place_number === 1 || rack?.place_number === 16 || rack?.place_number === 15 || rack?.place_number === 2) ? 'ups' : 'rack'}
                          left={false}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="capsula ml-10">
                <div className="text-center">CAPSULA № 2</div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    {dividedRackData[2]?.reverse()?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={(rack?.place_number === 1 || rack?.place_number === 16 || rack?.place_number === 15 || rack?.place_number === 2) ? 'ups' : 'rack'}
                          left={true}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col">
                    {dividedRackData[3]?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={(rack?.place_number === 1 || rack?.place_number === 16 || rack?.place_number === 15 || rack?.place_number === 2) ? 'ups' : 'rack'}
                          left={false}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dataCenterListDetail?.data_center_choice === 'data-center-2') {
    return (
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
        <div className={'flex items-center justify-between'}>
          <Header category="Data markaz" title={dataCenterListDetail?.display_name}/>
        </div>
        <div className="shadow-md sm:rounded py-4">
          <div
            className="relative overflow-x-auto w-full py-10"
            style={{
              backgroundImage: `url(${dataCenterListDetail?.background_image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className={'flex items-center justify-evenly pb-8'}>
              <div className="capsula">
                <div className="text-center">CAPSULA № 1</div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    {dividedRackData2[0]?.reverse().map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={rack?.type}
                          left={true}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                    <Rack
                      key={99}
                      type={''}
                      left={true}
                      id={99}
                      elKw={0}
                      sold={false}
                      percentage={0}
                      number={''}
                      unitsCount={''}
                      unit={''}
                      isForUnit={''}
                      rack_valid_action={''}
                    />
                  </div>
                  <div className="flex flex-col">
                    {dividedRackData2[1]?.reverse().map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={rack?.type}
                          left={false}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                    <Rack
                      key={99}
                      type={''}
                      left={false}
                      id={99}
                      elKw={0}
                      sold={false}
                      percentage={0}
                      number={''}
                      unitsCount={''}
                      unit={''}
                      isForUnit={''}
                      rack_valid_action={''}
                    />
                  </div>
                </div>
              </div>
              <div className="capsula ml-10">
                <div className="text-center">CAPSULA № 2</div>
                <div className="flex items-center gap-4 mr-36">
                  <div className="flex flex-col">
                    {dividedRackData2[2]?.reverse().map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={rack?.type}
                          left={true}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-col">
                    {dividedRackData2[4]?.reverse()?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={rack?.type}
                          left={false}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                    {dividedRackData2[3]?.reverse()?.map((rack, index) => {
                      return (
                        <Rack
                          key={index}
                          type={rack?.type}
                          left={false}
                          id={rack?.id}
                          elKw={
                            rack?.electricity
                              ? rack?.electricity?.toFixed(1)
                              : 0
                          }
                          sold={rack?.is_busy}
                          percentage={rack?.percentage?.toFixed(1)}
                          number={rack?.place_number}
                          unitsCount={rack?.unit_count}
                          unit={rack?.busy_units_count}
                          isForUnit={rack?.is_for_unit_service}
                          rack_valid_action={rack?.rack_valid_action}
                          client={rack?.rack_buyer}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DataCenter;