import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useStateContext} from "../../contexts/ContextProvider";
import {BiBadgeCheck} from "react-icons/bi";

const Rack = ({
  left = true,
  sold = false,
  id,
  percentage = 0,
  type,
  batteryPercentage = 0,
  number,
  unitsCount,
  unit,
  elKw,
  coolingDrawer,
  isForUnit,
  rack_valid_action,
  client
              }) => {
  const {currentColor} = useStateContext();
  const navigate = useNavigate()
  return (
    <>
      {type === 'cooling' && (
        <div className="cooling">
          <div className="cooling-wrap" onClick={coolingDrawer}>
            {/* <div className="cooling-wrap-block">
              <div className="cooling-wrap-block_line" />
              <div className="cooling-wrap-block_line" />
              <div className="cooling-wrap-block_line" />
            </div> */}
          </div>
          <div className="cooling-title">DX COOLING</div>
        </div>
      )}
      <div
        className={`rack flex items-center mt-6`}
        title={(rack_valid_action !== null && rack_valid_action?.status_code === 1) ? rack_valid_action?.message : ''}
      >
        {type === 'rack' && (
          <>
            {left && <span className="max-w-[55px] text-[#b6b6b6] text-xs">№ {number}</span>}
            <div
              className={`${isForUnit ? 'rack-block-unit relative w-[150px] h-[65px] bg-white rounded border cursor-pointer py-[10px] px-[8px]' : 'rack-block relative border w-[150px] h-[65px] bg-white rounded cursor-pointer py-[10px] px-[8px]'}`}
              style={{
                marginLeft: left ? 15 : 0,
                marginRight: !left ? 15 : 0,
                background: rack_valid_action ? 'red' : '',
              }}
              onClick={() => navigate(`/data-center/rack/${id}`, {state: {rack: id}})}
            >
              <div className="rack-block_info flex items-center justify-between">
                <span className="text-xs">
                  {unitsCount}/{unit}
                </span>
                <div className="rack-block_info-elkw">
                  {/*<ElKwIcon />*/}
                  {/*<span className="rack-block_info-elkw_value">{elKw}</span>*/}
                </div>
                <span className="text-xs">
                  {<BiBadgeCheck size={20} color={sold ? '#ffb800' : currentColor}/> }
                </span>
              </div>
              <div className="rack-block_process mt-1 w-full h-[7px] bg-[#d9d9d9] rounded relative">
                <div
                  className="rack-block_process-active absolute max-w-full top-0 left-0 h-[7px] rounded"
                  style={{width: `${percentage}%`, background: currentColor}}
                />
              </div>
              <div className="text-xs text-center py-1 uppercase font-bold">{`${client ? `${client?.substring(0, 20)}...` : ""}`}</div>
            </div>
            {!left && <span className="max-w-[55px] text-[#b6b6b6] text-xs">№ {number}</span>}
          </>
        )}
        {type === 'ups' && (
          <>
            <span className="max-w-[55px] text-[#b6b6b6] text-xs">№ {number}</span>
            <div className="rack-ups w-[150px] h-[65px] bg-[#343a40] py-[10px] px-[8px] rounded cursor-pointer" style={{marginLeft: 15}}></div>
          </>
        )}
        {type === 'battery' && (
          <>
            <span className="max-w-[55px] text-[#b6b6b6] text-xs">№ {number}</span>
            <div className="rack-battery w-[150px] h-[65px] bg-[#343a40] py-[10px] px-[8px] rounded cursor-pointer" style={{marginLeft: 15}}>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Rack
