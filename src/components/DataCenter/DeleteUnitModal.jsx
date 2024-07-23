import React from 'react'
import DeleteUnitIcon from '../../assets/images/DeleteUnitIcon'

const DeleteUnitModal = ({ onClose, confirm }) => {
  return (
    <div className="fixed top-1/2 left-1/2 w-[595px] h-[640px] transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white/60 to-transparent backdrop-blur-md rounded-3xl">
      <div className="flex flex-col items-center">
        <DeleteUnitIcon />
        <div className="mt-15 max-w-[400px] font-bold text-3xl leading-tight text-center text-white">
          Serverni olib tashlash
        </div>
        <div className="mt-5 max-w-[315px] font-normal text-lg leading-6 text-center text-white">
          Agar mijoz serverni ko’chirgan bo’lsa, olib tashlash uchun “tasdiqlash” ni bosing
        </div>
        <div className="mt-11 flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-[185px] h-[55px] bg-white/50 backdrop-blur-md rounded-full font-bold text-lg leading-6 text-[#00A3FF] border-0"
          >
            Bekor qilish
          </button>
          <button
            onClick={confirm}
            className="w-[185px] h-[55px] bg-red-500/65 backdrop-blur-md rounded-full font-bold text-lg leading-6 text-white border-0 ml-5"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUnitModal;