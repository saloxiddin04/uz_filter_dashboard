import React, {useEffect, useRef, useState} from 'react';
import {Header, Input, Loader} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {clearStatesFirstStep, getMfo, getUserByTin} from "../../../redux/slices/contractCreate/FirstStepSlices";
import {
  clearStatesVps, createAgreementVps, createVps,
  getOperationSystems,
  getOperationSystemsDetail,
  getVpsTariff, postSignedVpsContract,
  postVpsCalculate, postVpsFinish
} from "../../../redux/slices/contractCreate/Vps/VpsSlices";
import {TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import moment from "moment/moment";
import instance from "../../../API";
import {MdOutlineUTurnLeft} from "react-icons/md";
import {refreshUserByTin} from "../../../redux/slices/contracts/contractsSlice";

const CreateVps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {state} = useLocation()

  const {currentColor} = useStateContext();

  const {userByTin} = useSelector((state) => state.userByTin);
  const {sidebar} = useSelector((state) => state.sections);

  const {
    loading,
    operationSystems,
    operationSystemsDetail,
    vpsTariffs,
    vpsCalculate,
    vpsDocument,
    vpsConfig,
    vpsFinish
  } = useSelector((state) => state.createVps);

  const [currentStep, setCurrentStep] = useState(1)

  const [client, setClient] = useState('');

  // -------------------- juridic ---------------------
  const [loader, setLoader] = useState(false)
  const [stir, setStir] = useState('');
  const [name, setName] = useState('')
  const [lang, setLang] = useState('')
  const [per_adr, setPerAdr] = useState('')
  const [director_firstname, setDirectorFirstName] = useState('')
  const [director_lastname, setDirectorLastName] = useState('')
  const [director_middlename, setDirectorMiddleName] = useState('')
  const [bank_mfo, setBankMfo] = useState('')
  const [bank_name, setBankName] = useState('')
  const [paymentAccount, setPaymentAccount] = useState('')
  const [xxtut, setXxtut] = useState('')
  const [ktut, setKtut] = useState('')
  const [oked, setOked] = useState('')
  const [position, setPosition] = useState('')


  // <------------ fiz_user states ------------>
  const [first_name, setFirstName] = useState('')
  const [mid_name, setMiddName] = useState('')
  const [sur_name, setSurName] = useState('')
  const [mob_phone_no, setMobileNum] = useState('')
  const [email, setEmail] = useState('')
  const [pport_no, setPportNo] = useState('')
  const [pinfl, setPinfl] = useState('')

  const validationJuridic = () => {
    return stir === '' || name === '' || bank_mfo === '' || bank_name === '' || per_adr === '' || paymentAccount === '';
  }

  const validationPhysics = () => {
    return first_name === '' || mid_name === '' || sur_name === '' || mob_phone_no === '' || email === '' || pport_no === '' || pinfl === ''
  }

  const searchUserJuridic = () => {
    dispatch(getUserByTin({stir, client})).then((res) => {
      setName(res?.payload?.name === null ? '' : res?.payload?.name)
      setPosition(res?.payload?.position === null ? '' : res?.payload?.position)
      setPerAdr(res?.payload?.per_adr === null ? '' : res?.payload?.per_adr)
      setPaymentAccount(res?.payload?.paymentAccount === null ? '' : res?.payload?.paymentAccount)
      setBankMfo(res?.payload?.bank_mfo?.mfo === null ? '' : res?.payload?.bank_mfo?.mfo)
      setBankName(res?.payload?.bank_mfo?.bank_name === null ? '' : res?.payload?.bank_mfo?.bank_name)
      setXxtut(res?.payload?.xxtut === null ? '' : res?.payload?.xxtut)
      setOked(res?.payload?.oked === null ? '' : res?.payload?.oked)
      setKtut(res?.payload?.ktut === null ? '' : res?.payload?.ktut)
      setDirectorLastName(res?.payload?.director_lastname === null ? '' : res?.payload?.director_lastname)
      setDirectorFirstName(res?.payload?.director_firstname === null ? '' : res?.payload?.director_firstname)
      setDirectorMiddleName(res?.payload?.director_middlename === null ? '' : res?.payload?.director_middlename)
      setLang(res?.payload?.lang === null ? '' : res?.payload?.lang)
      setEmail(res?.payload?.email === null ? '' : res?.payload?.email)
      setMobileNum(res?.payload?.mob_phone_no === null ? '' : res?.payload?.mob_phone_no)
    })
  }

  const setMfoFunc = () => {
    dispatch(getMfo({mfo: bank_mfo})).then(res => setBankName(res?.payload?.bank_name))
  }

  const searchUserPhysics = () => {
    dispatch(getUserByTin({pin: pinfl, client, passport_ce: pport_no})).then((res) => {
      setPportNo(res?.payload?.pport_no === null ? '' : res?.payload?.pport_no)
      setMiddName(res?.payload?.mid_name === null ? '' : res?.payload?.mid_name)
      setFirstName(res?.payload?.first_name === null ? '' : res?.payload?.first_name)
      setSurName(res?.payload?.sur_name === null ? '' : res?.payload?.sur_name)
      setMobileNum(res?.payload?.mob_phone_no === null ? '' : res?.payload?.mob_phone_no)
      setEmail(res?.payload?.email === null ? '' : res?.payload?.email)
      setPerAdr(res?.payload?.per_adr === null ? '' : res?.payload?.per_adr)
    })
  }

  const updateYurUser = async () => {
    const data = {
      tin: stir,
      name,
      paymentAccount: paymentAccount?.replace(/[_\s]/g, ''),
      oked,
      xxtut,
      ktut,
      position,
      director_middlename,
      director_lastname,
      director_firstname,
      per_adr,
      mfo: bank_mfo,
      email,
      lang,
      mob_phone_no
    }
    await instance.patch('/accounts/update-yuruser-cabinet', data).then((res) => {
      if (res.status === 200) {
        toast.success('Muvoffaqiyatli saqlandi!')
      } else {
        toast.error('Xatolik')
      }
    })
  }

  // <------------ DATA ------------>

  const [typeContract, setTypeContract] = useState('')
  const [vpsContractNum, setVpsContractNumber] = useState('')
  const [expiration_date, setExpirationDate] = useState('')

  const [tp_id, setTpId] = useState('')
  const [code, setCode] = useState(null)

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')

  const [contract_date, setContractDate] = useState('')

  const [server, setServer] = useState([
    {
      tariff: null,
      cpu: null,
      ram: null,
      system_storage: null,
      system_storage_disk: null,
      internet: null,
      is_imut: false,
      billing_status: 4,
      tasix: null,
      imut: null,
      count_vm: 1,
      image_id: null,
      os_type_id: null,
      account_id: null,
      data_disks: [],
      vm_systems: [{
        ipv_address: false,
        vm_name: '',
        account_id: null,
        vm_id: null,
        id: null,
      }],
    }
  ])

  useEffect(() => {
    dispatch(getVpsTariff())
    dispatch(getOperationSystems())
  }, []);

  useEffect(() => {
    if (currentStep === 2) {
      dispatch(createAgreementVps({user: userByTin?.bank_mfo ? stir : pinfl})).then((res) => {
        if (res?.payload?.error_code === 3) {
          toast.error('Bu mijozga shartnoma tuzish mumkin emas!')
          navigate('/shartnomalar/vps')
          dispatch(clearStatesVps())
          dispatch(clearStatesFirstStep())
        } else if (res?.payload?.error_code === 1) return setCode(1)
      })
      dispatch(postVpsFinish({
        is_back_office: true,
        innpinfl: client === 'fiz' ? pinfl : stir
      }))
    }
  }, [currentStep]);

  useEffect(() => {
    if (code === 1) {
      const serverObjects = vpsConfig?.configurations?.map((configuration) => ({
        tariff: null,
        cpu: configuration.cpu,
        account_id: configuration.account_id,
        ram: configuration.ram,
        internet: configuration.internet,
        is_imut: configuration.imut ? true : false,
        tasix: configuration.tasix,
        imut: configuration.imut,
        system_storage: configuration.system_storage,
        system_storage_disk: configuration.system_storage_disk,
        data_disks: configuration.data_disks,
        billing_status: configuration.billing_status,
        count_vm: 1,
        image_id: configuration.image_id,
        os_type_id: configuration.os_type_id,
        id: configuration.id,
        vm_systems: [
          {
            ipv_address: configuration.ipv_address,
            vm_name: configuration.name,
            account_id: configuration.account_id,
            vm_id: configuration.vm_id,
            // id: configuration.id,
          },
        ],
      }))
      setServer(serverObjects)
      setTpId(vpsConfig?.tp_id)

      postBilling(serverObjects)
      for (let i = 0; i < serverObjects.length; i++) {
        if (serverObjects[i].os_type_id) {
          dispatch(getOperationSystemsDetail({id: serverObjects[i].os_type_id}))
        }
      }
    }
  }, [code]);

  useEffect(() => {
    if (!handleSecondValidateForCalculate()) {
      postBilling(server)
    }
  }, [server, tp_id, typeContract, vpsContractNum, fileName]);

  useEffect(() => {
    if (typeContract === '2') {
      getVpsContractNumber().then()
    }
  }, [typeContract]);

  const handleServerAdd = () => {
    const abc = [...server, {
      tariff: null,
      cpu: null,
      ram: null,
      system_storage: null,
      system_storage_disk: null,
      internet: null,
      is_imut: false,
      tasix: null,
      imut: null,
      count_vm: 1,
      image_id: null,
      os_type_id: null,
      account_id: null,
      billing_status: 4,
      data_disks: [],
      vm_systems: [{
        ipv_address: false,
        vm_name: '',
        account_id: null,
        vm_id: null,
        id: null,
      }]
    }]
    setServer(abc)
  }

  const timeoutId = useRef(null)
  const postBilling = (value) => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      dispatch(postVpsCalculate({vms: value, tp_id: Number(tp_id)}))
    }, 500)
  }

  const handleServerDelete = (i) => {
    const value = [...server]
    if (value[i].account_id === null) {
      value.splice(i, 1)
    } else {
      value[i].billing_status = 3
    }
    setServer(value)
  }

  const recoveryConfig = (i) => {
    const updatedServer = [...server]
    updatedServer[i].billing_status = 2
    setServer(updatedServer)
  }

  const changeServer = (e, i) => {
    const {name, value} = e.target;
    const check = e.target

    if (name === 'is_imut') {
      const updatedServer = [...server];
      updatedServer[i] = {
        ...updatedServer[i],
        [name]: !updatedServer[i].is_imut,
      };
      if (!check.checked) {
        updatedServer[i].is_imut = false
        updatedServer[i].imut = null
      }
      updatedServer[i].billing_status = 4
      setServer(updatedServer);
    } else {
      if (
        name === 'cpu' ||
        name === 'ram' ||
        name === 'system_storage_disk' ||
        name === 'tasix' ||
        name === 'imutInput' ||
        name === 'internet' ||
        name === 'tariff' ||
        name === 'imut'
      ) {
        if (/^-?\d*$/.test(value)) {
          const updatedServer = [...server];
          updatedServer[i] = {
            ...updatedServer[i],
            [name]: Number(value)
          };
          setServer(updatedServer);
          if (code === 1) {
            postBilling(updatedServer)
          }
          updatedServer[i].billing_status = 4
          if (Number(updatedServer[i].tariff) > 0) {
            const tariffId = vpsTariffs.find((item) => (
              Number(item.id) === Number(updatedServer[i].tariff)
            ))
            updatedServer[i].billing_status = 4
            updatedServer[i].cpu = tariffId?.vps_device?.cpu
            updatedServer[i].ram = tariffId?.vps_device?.ram
            if (tariffId?.vps_device?.data_disks === undefined) {
              updatedServer[i].data_disks = []
            } else {
              updatedServer[i].data_disks = tariffId?.vps_device?.data_disks
            }
            updatedServer[i].internet = tariffId?.vps_device?.internet
            updatedServer[i].tasix = tariffId?.vps_device?.tasix
            updatedServer[i].system_storage = tariffId?.vps_device?.system_storage
            updatedServer[i].system_storage_disk = tariffId?.vps_device?.system_storage_disk
            updatedServer[i].imut = tariffId?.vps_device?.imut
            updatedServer[i].vm_systems?.some((s) => s.ipv_address = tariffId?.vps_device?.ipv_address)
            updatedServer[i].vm_systems?.some((s) => s.account_id = tariffId?.vps_device?.account_id)
            updatedServer[i].vm_systems?.some((s) => s.vm_id = tariffId?.vps_device?.vm_id)
          } else {
            updatedServer[i].tariff = null
            updatedServer[i].billing_status = 4
          }
        }
        // if (name === 'tasix' || name === 'internet') {
        //   const updatedServer = [...server];
        //   updatedServer[i] = {
        //     ...updatedServer[i],
        //     [name]: Number(value)
        //   };
        //   if ((updatedServer[i].internet !== 0 || updatedServer[i].tasix !== 0)) {
        //     updatedServer[i].vm_systems.forEach((value) => value.ipv_address = true);
        //   } else {
        //     updatedServer[i].vm_systems.forEach((value) => value.ipv_address = false);
        //   }
        // }
      } else {
        if (name === 'storage') {
          const updatedServer = [...server]
          updatedServer[i].billing_status = 4
          updatedServer[i] = {
            ...updatedServer[i]
          }
          setServer(updatedServer)
        } else if (name === 'os_type') {
          const updatedServer = [...server]
          updatedServer[i].os_type_id = value
          updatedServer[i].billing_status = 4
          dispatch(getOperationSystemsDetail({id: value}))
          setServer(updatedServer)
        } else {
          const updatedServer = [...server];
          updatedServer[i] = {
            ...updatedServer[i],
            [name]: value
          };
          updatedServer[i].billing_status = 4
          setServer(updatedServer);
        }
      }
    }
  }

  const changeServerNum = (e, i, dataIndex) => {
    const check = e.target
    const updatedServer = [...server];
    if (e.target.name === 'ipv_address') {
      updatedServer[dataIndex].vm_systems[i].ipv_address = check.checked
      updatedServer[dataIndex].billing_status = 4;
      if (check.checked === false) {
        updatedServer[dataIndex].internet = null
        updatedServer[dataIndex].tasix = null
      }
    } else if (e.target.name === 'vm_name') {
      if (e.target.value === '' || /^[A-Za-z0-9]+$/.test(e.target.value)) {
        updatedServer[dataIndex].vm_systems[i].vm_name = e.target.value.slice(0, 7);
        updatedServer[dataIndex].billing_status = 4;
      }
    }
    setServer(updatedServer);
    // postBilling(updatedServer)
  };

  const changeDisks = (e, i, dataIndex) => {
    const updatedServer = [...server]
    if (e.target.name === 'storage') {
      updatedServer[i].data_disks[dataIndex].storage = e.target.value
      updatedServer[i].billing_status = 4;
    } else {
      updatedServer[i].data_disks[dataIndex].storage_disk = Number(e.target.value)
      updatedServer[i].data_disks[dataIndex].status = 4
      updatedServer[i].billing_status = 4;
    }
    setServer(updatedServer)
    // postBilling(updatedServer)
  }

  const addDisks = (i) => {
    const updatedServerState = server.map((item, index) => {
      if (index === i) {
        const updatedDataDisks = [...item.data_disks];

        updatedDataDisks.push({
          storage: '',
          storage_disk: '',
          id: null,
          vm_id: null,
          name: null,
          status: 1,
        });

        return {
          ...item,
          data_disks: updatedDataDisks,
          billing_status: 4,
        };
      }
      return item;
    });

    setServer(updatedServerState);
  };

  const disksDelete = (i, diskIndex) => {
    const value = [...server]
    if (
      value[i].data_disks[diskIndex].vm_id === null
    ) {
      value[i].data_disks.splice(diskIndex, 1)
      value[i].billing_status = 4
      setServer(value)
    } else {
      value[i].data_disks[diskIndex].status = 3
      value[i].billing_status = 4
      setServer(value)
    }
    postBilling(value)
  }

  const handleSecondValidate = () => {
    const uniqueVmNamesPerServer = new Set();
    for (const currentServer of server) {
      const uniqueVmNames = new Set();
      if (
        typeContract === '2' && (!fileName || !contract_date || !tp_id) ||
        currentServer.billing_status !== 3 &&
        (!vpsCalculate?.success ||
          !currentServer?.cpu ||
          !currentServer?.ram ||
          currentServer?.vm_systems?.some((value) => value.ipv_address && (!currentServer?.internet || !currentServer?.tasix)) ||
          // !currentServer?.internet ||
          // !currentServer?.tasix ||
          currentServer?.data_disks?.some((s) => Number(s.storage_disk) > 4096) ||
          (currentServer?.is_imut && !currentServer?.imut) ||
          !currentServer?.system_storage ||
          currentServer?.system_storage_disk > 4096 ||
          !currentServer?.system_storage_disk ||
          currentServer?.vm_systems?.some((s) => !s.vm_name) ||
          currentServer?.vm_systems?.some((s) => {
            const vmName = s.vm_name.trim().toLowerCase();
            if (uniqueVmNames?.has(vmName) || uniqueVmNamesPerServer?.has(vmName)) {
              return true;
            }
            uniqueVmNames?.add(vmName);
            uniqueVmNamesPerServer?.add(...uniqueVmNames)
            return false;
          }) ||
          (currentServer?.data_disks?.length !== 0 && currentServer?.data_disks?.some((s) => !s.storage || !s.storage_disk)) ||
          !currentServer?.image_id ||
          Number(currentServer?.cpu) < Number(operationSystemsDetail.find(os => os.image_id === currentServer.image_id)?.min_cpu) ||
          Number(currentServer?.ram) < Number(operationSystemsDetail.find(os => os.image_id === currentServer.image_id)?.min_ram) ||
          Number(currentServer?.system_storage_disk) < Number(operationSystemsDetail.find(os => os.image_id === currentServer.image_id)?.min_disk))
      ) {
        return true;
      }

    }

    return false;
  }

  const handleSecondValidateForCalculate = () => {
    const uniqueVmNamesPerServer = new Set();
    for (const currentServer of server) {
      const uniqueVmNames = new Set();
      if (
        typeContract === '2' && (!fileName || !contract_date || !tp_id) ||
        currentServer.billing_status !== 3 &&
        (!currentServer?.cpu ||
          !currentServer?.ram ||
          currentServer?.vm_systems?.some((value) => value.ipv_address && (!currentServer?.internet || !currentServer?.tasix)) ||
          currentServer?.data_disks?.some((s) => Number(s.storage_disk) > 4096) ||
          (currentServer?.is_imut && !currentServer?.imut) ||
          !currentServer?.system_storage ||
          currentServer?.system_storage_disk > 4096 ||
          !currentServer?.system_storage_disk ||
          currentServer?.vm_systems?.some((s) => !s.vm_name) ||
          currentServer?.vm_systems?.some((s) => {
            const vmName = s.vm_name.trim().toLowerCase();
            if (uniqueVmNames?.has(vmName) || uniqueVmNamesPerServer?.has(vmName)) {
              return true;
            }
            uniqueVmNames?.add(vmName);
            uniqueVmNamesPerServer?.add(...uniqueVmNames)
            return false;
          }) ||
          (currentServer?.data_disks?.length !== 0 && currentServer?.data_disks?.some((s) => !s.storage || !s.storage_disk)) ||
          !currentServer?.image_id ||
          Number(currentServer?.cpu) < Number(operationSystemsDetail?.find(os => os.image_id === currentServer.image_id)?.min_cpu) ||
          Number(currentServer?.ram) < Number(operationSystemsDetail?.find(os => os.image_id === currentServer.image_id)?.min_ram) ||
          Number(currentServer?.system_storage_disk) < Number(operationSystemsDetail?.find(os => os.image_id === currentServer.image_id)?.min_disk))
      ) {
        return true;
      }

    }

    return false;
  }

  const handleValidateStorages = () => {
    for (const currentServer of server) {
      if (
        currentServer?.data_disks.some((s) => s.storage && (!s.storage || !s.storage_disk)) ||
        currentServer?.data_disks.some((s) => s.storage && (!s.storage || !s.storage_disk))
      ) {
        return true;
      }
    }

    return false;
  }

  const postSignedContract = () => {
    const formDataFiz = new FormData()
    const client_user_fiz = {
      user_type: 1,
      pin_or_tin: pinfl,
      tp_id: Number(tp_id),
      first_name,
      mid_name,
      sur_name,
      per_adr,
      mob_phone_no,
      email,
      pport_no,
      pin: pinfl,
    }
    const client_user_yur = {
      user_type: 2,
      pin_or_tin: stir,
      tp_id: Number(tp_id),
      name,
      per_adr,
      director_middlename,
      director_firstname,
      director_lastname,
      bank_mfo,
      paymentAccount,
      xxtut,
      ktut,
      oked,
      position,
      tin: stir,
    }

    formDataFiz.append(
      'client_user',
      userByTin?.bank_mfo ? JSON.stringify(client_user_yur) : JSON.stringify(client_user_fiz),
    )
    formDataFiz.append('service', 18)
    formDataFiz.append('tp_id', Number(tp_id))
    formDataFiz.append('configuration', JSON.stringify(server))
    formDataFiz.append(
      'contract_date',
      moment(contract_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ'),
    )
    formDataFiz.append('file_pdf', null)
    formDataFiz.append('with_word', false)
    formDataFiz.append('file', file)
    formDataFiz.append('contract_number', vpsContractNum)
    formDataFiz.append('hash_code', null)

    dispatch(postSignedVpsContract(formDataFiz)).then(() => dispatch(clearStatesVps()))
  }

  const getVpsContractNumber = async () => {
    const response = await instance.get(`/vps/get-valid-contract-num/${18}?pin_or_tin=${userByTin?.bank_mfo ? stir : pinfl}`)
    setVpsContractNumber(response?.data?.contract_number)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileClick = () => {
    document.getElementById('hiddenFileInput').click();
  };

  const postFinishContract = async () => {
    await dispatch(postVpsFinish({
      is_back_office: true,
      innpinfl: client === 'fiz' ? pinfl : stir,
      expiration_date: new Date(expiration_date)?.toISOString(),
      save: currentStep === 2 ? 0 : 1,
    })).then(() => {
      if (currentStep === 3) {
        navigate('/shartnomalar/vps')
        dispatch(clearStatesFirstStep())
        dispatch(clearStatesVps())
      }
      setCurrentStep(3)
    }).catch((e) => {
      toast.error(e.message)
      setCurrentStep(2)
    })
  }

  const createVpsFunc = async () => {
    try {
      await dispatch(createVps({
        tp_id,
        contract_date: moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ'),
        configuration: server,
        service: service?.id,
        is_back_office: true,
        pin_or_tin: userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin,
        save: 1,
        user_type: userByTin?.bank_mfo ? 2 : 1,
      })).then(() => {
        navigate('/shartnomalar/vps')
        dispatch(clearStatesVps())
        dispatch(clearStatesFirstStep())
      })
    } catch (e) {
      setCurrentStep(2)
      toast.error(e.message)
    }
  }

  const reducedObject = vpsCalculate?.configurations_prices?.reduce((accumulator, item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === 'number') {
        accumulator[key] = (accumulator[key] || 0) + value;
      } else if (typeof value === 'string' && key === 'additional_disks') {
        const numericValues = value.match(/\d+/g) || [];
        const sum = numericValues.reduce((total, num) => total + parseInt(num, 10), 0);
        accumulator[key] = (accumulator[key] || 0) + sum;
      } else if (typeof value === 'object' && value !== null) {
        accumulator[key] = (accumulator[key] || 0) + (value?.hdd_price || 0)
        accumulator[key] = (accumulator[key] || 0) + (value?.ssd_price || 0)
      }
    });
    return accumulator;
  }, {});

  const service = sidebar?.permissions.find(item => item?.slug === state?.path)?.children?.find(el => el?.slug === state?.slug)

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className={'w-[49%]'}>
              <label
                htmlFor="client"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Mijoz turi
              </label>
              <select
                name="client"
                id="client"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="" disabled={client}>Tanlang...</option>
                <option value="fiz">Jismoniy</option>
                <option value="yur">Yuridik</option>
              </select>
            </div>
            {client === 'yur' && (
              <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
                <div className={'w-8/12 flex items-end gap-4'}>
                  <div className={'w-full'}>
                    <Input
                      value={stir}
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          setStir(e.target.value.slice(0, 9));
                        }
                      }}
                      label={'Tashkilotning STIR raqami'}
                      className={`${stir?.length === 9 ? 'border border-green-500' : ''}`}
                    />
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-50'}`}
                    style={{backgroundColor: currentColor}}
                    onClick={searchUserJuridic}
                    disabled={stir.length !== 9}
                  >
                    Izlash
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-50'}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => {
                      setLoader(true)
                      try {
                        dispatch(refreshUserByTin({tin: stir})).then((res) => {
                          setLoader(false)
                          setName(res?.payload?.name || '')
                          setPosition(res?.payload?.position || '')
                          setPerAdr(res?.payload?.per_adr || '')
                          setPaymentAccount(res?.payload?.paymentAccount || '')
                          setBankMfo(res?.payload?.bank_mfo?.mfo || '')
                          setBankName(res?.payload?.bank_mfo?.bank_name || '')
                          setXxtut(res?.payload?.xxtut || '')
                          setOked(res?.payload?.oked || '')
                          setKtut(res?.payload?.ktut || '')
                          setDirectorLastName(res?.payload?.director_lastname || '')
                          setDirectorFirstName(res?.payload?.director_firstname || '')
                          setDirectorMiddleName(res?.payload?.director_middlename || '')
                          setLang(res?.payload?.lang || '')
                          setEmail(res?.payload?.email || '')
                          setMobileNum(res?.payload?.mob_phone_no || '')
                        })
                      } catch (e) {
                        setLoader(false)
                      }
                    }}
                    disabled={stir.length !== 9}
                  >
                    {loader ? 'Yangilanmoqda...' : 'Yangilash'}
                  </button>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Tashkilot nomi'}
                    className={`${name?.length > 0 ? 'border border-green-500' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <div className={'w-full flex items-end justify-between'}>
                    <div className={'w-[88%]'}>
                      <Input
                        label={'MFO'}
                        className={`${bank_mfo?.length > 0 ? 'border border-green-500' : ''}`}
                        value={bank_mfo}
                        onChange={(e) => setBankMfo(e.target.value)}
                      />
                    </div>
                    <button
                      className={`px-4 py-2 rounded text-white`}
                      style={{backgroundColor: currentColor}}
                      onClick={setMfoFunc}
                    >
                      Izlash
                    </button>
                  </div>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Yuridik manzil'}
                    className={`${per_adr?.length > 0 ? 'border border-green-500' : ''}`}
                    value={per_adr}
                    onChange={(e) => setPerAdr(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Bank filliali'}
                    className={`${bank_name?.length > 0 ? 'border border-green-500' : ''}`}
                    value={bank_name}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Lavozim'}
                    className={`${position?.length > 0 ? 'border border-green-500' : ''}`}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Hisob raqami'}
                    className={`${paymentAccount?.length > 0 ? 'border border-green-500' : ''}`}
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Familiya'}
                    className={`${director_lastname?.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_lastname}
                    onChange={(e) => setDirectorLastName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'XXTUT'}
                    className={`${xxtut?.length > 0 ? 'border border-green-500' : ''}`}
                    value={xxtut}
                    onChange={(e) => setXxtut(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Ismi'}
                    className={`${director_firstname?.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_firstname}
                    onChange={(e) => setDirectorFirstName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'KTUT'}
                    className={`${ktut?.length > 0 ? 'border border-green-500' : ''}`}
                    value={ktut}
                    onChange={(e) => setKtut(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Sharifi'}
                    className={`${director_middlename?.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_middlename}
                    onChange={(e) => setDirectorMiddleName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'IFUT'}
                    className={`${oked?.length > 0 ? 'border border-green-500' : ''}`}
                    value={oked}
                    onChange={(e) => setOked(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Telefon raqami'}
                    className={`${mob_phone_no?.length > 0 ? 'border border-green-500' : ''}`}
                    value={mob_phone_no}
                    onChange={(e) => setMobileNum(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Email'}
                    className={`${email?.length > 0 ? 'border border-green-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="w-full flex items-center justify-between">
                  <button
                    className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                    style={{backgroundColor: currentColor}}
                    disabled={!stir}
                    onClick={updateYurUser}
                  >
                    Saqlash
                  </button>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div>
                    <button
                      className={'px-4 py-2 rounded'}
                      style={{
                        color: currentColor,
                        border: `1px solid ${currentColor}`
                      }}
                      onClick={() => navigate(-1)}
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${validationJuridic() ? 'opacity-50' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => setCurrentStep(2)}
                    disabled={validationJuridic()}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
            {client === 'fiz' && (
              <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
                <div className={'w-8/12 flex items-end gap-4'}>
                  <div className={'w-full flex items-end gap-4'}>
                    <div className={'w-2/5'}>
                      <Input
                        label={'Passport malumotlari'}
                        placeholder={'Passport seriyasi va raqami'}
                        value={pport_no}
                        onChange={(e) => setPportNo(e.target.value.toUpperCase().slice(0, 9))}
                        type={'text'}
                        className={`${pport_no?.length === 9 ? 'border border-green-500' : ''}`}
                      />
                    </div>
                    <div className={'w-3/5'}>
                      <Input
                        label={''}
                        placeholder={'JShIShIR'}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setPinfl(e.target.value.slice(0, 14));
                          }
                        }}
                        value={pinfl}
                        type={'text'}
                        className={`${pinfl?.length === 14 ? 'border border-green-500' : ''}`}
                      />
                    </div>
                  </div>
                  <button
                    className={'px-4 py-2 rounded text-white disabled:opacity-25'}
                    style={{backgroundColor: currentColor}}
                    onClick={searchUserPhysics}
                    disabled={!pport_no || pinfl?.length === 14}
                  >
                    Izlash
                  </button>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Familiyasi'}
                    className={`${sur_name?.length > 0 ? 'border border-green-500' : ''}`}
                    value={sur_name}
                    onChange={(e) => setSurName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Yashash manzili'}
                    className={`${per_adr?.length > 0 ? 'border border-green-500' : ''}`}
                    value={per_adr}
                    onChange={(e) => setPerAdr(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Ismi'}
                    className={`${first_name?.length > 0 ? 'border border-green-500' : ''}`}
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Telefon raqami'}
                    className={`${mob_phone_no?.length > 0 ? 'border border-green-500' : ''}`}
                    value={mob_phone_no}
                    onChange={(e) => setMobileNum(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Otasining ismi'}
                    className={`${mid_name?.length > 0 ? 'border border-green-500' : ''}`}
                    value={mid_name}
                    onChange={(e) => setMiddName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Email'}
                    className={`${email?.length > 0 ? 'border border-green-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type={'email'}
                  />
                </div>
                <div className="w-full flex items-center justify-between">
                  <div>
                    <button
                      className={'px-4 py-2 rounded'}
                      style={{
                        color: currentColor,
                        border: `1px solid ${currentColor}`
                      }}
                      onClick={() => navigate(-1)}
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${validationPhysics() ? 'opacity-50' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => setCurrentStep(2)}
                    disabled={validationPhysics()}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
          </>
        )
      case 2:
        return (
          <>
            <div className="w-2/4">
              <label
                htmlFor="type"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Shartnoma turi
              </label>
              <select
                name="type"
                id="type"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={typeContract}
                onChange={(e) => setTypeContract(e.target.value)}
              >
                <option value="" disabled={typeContract}>Tanlang...</option>
                <option value="1">Yangi shartnoma tuzish</option>
                <option value="2">Imzolangan shartnomani yuklash</option>
                <option value="3" disabled={vpsFinish?.err_code !== 2}>Shartnomalarni to'liq yakunlash</option>
              </select>
            </div>

            {typeContract === '1' && (
              <>
                <div className="w-2/4 my-2">
                  <label
                    htmlFor="type"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    Shartnoma turi
                  </label>
                  <select
                    name="type"
                    id="type"
                    className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                    value={tp_id}
                    onChange={(e) => {
                      setTpId(e.target.value)
                    }}
                  >
                    <option value="" disabled={tp_id}>Tanlang</option>
                    <option value="0">FREE</option>
                    <option value="1">START</option>
                    <option value="2">STANDARD</option>
                    <option value="3">PRO</option>
                    <option value="4">MAX</option>
                    <option value="999">AUTO</option>
                  </select>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className={'w-[79%] flex items-center justify-between flex-wrap gap-4 mt-4 dark:text-white'}>
                    <div className="ml-2 font-bold w-full">Shartnoma malumotlari</div>
                    {server && server?.map((data, index) => (
                      <div key={index} className="border rounded p-3 w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-2xl">Konfiguratsiya {index + 1}</h3>
                          {data.billing_status !== 3 && (
                            <div>
                              <button
                                onClick={() => handleServerDelete(index)}
                                disabled={data.length === 1}
                              >
                                <TrashIcon
                                  color={currentColor}
                                  className="size-6 cursor-pointer"
                                />
                              </button>
                            </div>
                          )}
                          {data.billing_status === 3 && (
                            <div>
                              <button
                                onClick={() => recoveryConfig(index)}
                                disabled={data.length === 1}
                                className="rotate-90"
                              >
                                <MdOutlineUTurnLeft
                                  color={currentColor}
                                  className="size-6 cursor-pointer"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                        <div>
                          {data.account_id === null && (
                            <div className={'w-full mb-2'}>
                              <label
                                htmlFor="tariff"
                                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                              >
                                Tarif
                              </label>
                              <select
                                id="tariff"
                                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                name='tariff'
                                value={data.tariff || ''}
                                onChange={(e) => changeServer(e, index)}
                              >
                                <option value={''}>Tanlash</option>
                                {vpsTariffs && vpsTariffs.map((item) => (
                                  <option key={item.id} value={item.id}>{item.tariff_name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          {
                            data.billing_status !== 3 && (
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                {data && (
                                  server[index].vm_systems?.map((element, i) => (
                                    <div key={i} className="flex justify-between items-start gap-4 w-full">
                                      <div className="w-[49%] flex flex-col">
                                        <label
                                          className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                          htmlFor="vm_name"
                                        >
                                          VM: Nomini kiriting {i + 1}
                                        </label>
                                        <input
                                          disabled={data.account_id !== null}
                                          type="text"
                                          id={'vm_name'}
                                          name={'vm_name'}
                                          value={element.vm_name}
                                          onChange={(e) => changeServerNum(e, i, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                        />
                                        <div>
                                          <input
                                            type="checkbox"
                                            onChange={(e) => changeServerNum(e, i, index)}
                                            checked={element.ipv_address}
                                            disabled={(data?.tariff !== null || data?.tariff === '')}
                                            name="ipv_address"
                                            className="w-[5%] mr-2"
                                          />
                                          <label className="w-2/4">Static ip address</label>
                                        </div>
                                      </div>
                                      <div className="w-[49%] flex items-center justify-between">
                                        <div className="flex flex-col w-[49%]">
                                          <label htmlFor="version">VM: Operatsion tizim</label>
                                          <select
                                            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                            id="version"
                                            name='os_type'
                                            disabled={data?.account_id}
                                            value={data?.os_type_id || ""}
                                            onChange={(e) => changeServer(e, index)}
                                          >
                                            <option value="" disabled={data?.os_type_id !== ''}>Tanlash...</option>
                                            {operationSystems && operationSystems.map((el) => (
                                              <option key={el?.os_type_id} value={el.os_type_id}>{el.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="flex flex-col w-[49%]">
                                          <label htmlFor="version">Operatsion tizim versiyasi</label>
                                          <select
                                            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                            id="version"
                                            name='image_id'
                                            disabled={operationSystemsDetail?.length === 0 || data?.account_id}
                                            value={data?.image_id || ''}
                                            onChange={(e) => {
                                              changeServer(e, index)
                                              // dispatch(getOperationSystemsDetail(access, data.image_id))
                                            }}
                                          >
                                            <option value="" disabled={data?.image_id !== ''}>Tanlash...</option>
                                            {operationSystemsDetail && operationSystemsDetail.map((el) => (
                                              el.os_type_id === data?.os_type_id &&
                                              <option key={el?.image_id} value={el.image_id}>{el.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                                <div className="flex flex-col mt-2 w-[49%]">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="cpu">CPU
                                    (CORE)</label>
                                  <input
                                    disabled={data.tariff !== null}
                                    name="cpu"
                                    id="cpu"
                                    type={'text'}
                                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                    placeholder={'CPU'}
                                    value={data.cpu || ''}
                                    onChange={(e) => changeServer(e, index)}
                                  />
                                  {operationSystemsDetail && Number(data.cpu) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu) && Number(data.cpu) < Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu) && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      *
                                      Minimum {Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu)} (CORE)
                                    </label>
                                  )}
                                </div>
                                <div className="flex flex-col mt-2 w-[49%]">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="ram">RAM
                                    (GB)</label>
                                  <input
                                    disabled={data.tariff !== null}
                                    name="ram"
                                    id="ram"
                                    type={'text'}
                                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                    placeholder={'RAM'}
                                    value={data.ram || ''}
                                    onChange={(e) => changeServer(e, index)}
                                  />
                                  {operationSystemsDetail && Number(data.ram) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram) && Number(data.ram) < (Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram)) && (
                                    <label className="text-red-500" htmlFor="ram">
                                      *
                                      Minimum {(Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram))} (GB)
                                    </label>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2" id={'dataSaved'}>
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="dataSaved">Operatsion
                                    sistema (GB)</label>
                                  <div>
                                    <select
                                      disabled={data.tariff !== null}
                                      name="system_storage"
                                      value={data.system_storage || ''}
                                      onChange={(e) => changeServer(e, index)}
                                      className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                    >
                                      <option value="">Tanlang...</option>
                                      <option value="hdd">HDD</option>
                                      <option value="ssd">SSD</option>
                                      <option value="smart_disk">SMART DISK</option>
                                    </select>
                                    <div className="flex justify-between w-full">
                                      {data.system_storage && (
                                        <input
                                          placeholder={data.system_storage.toUpperCase()}
                                          name="system_storage_disk"
                                          value={data.system_storage_disk || ''}
                                          disabled={data.tariff !== null}
                                          onChange={(e) => changeServer(e, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                          id="type"
                                          type={'text'}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {operationSystemsDetail && Number(data.system_storage_disk) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk) && (Number(data.system_storage_disk)) < (Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk)) && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      *
                                      Minimum {(Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk))} (GB)
                                    </label>
                                  )}
                                  {Number(data?.system_storage_disk) > 4096 && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      * Maksimal qiymat 4096 GB. Ko&apos;proq qo&apos;shish uchun yangi disk yarating
                                    </label>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2">
                                  {data.vm_systems[0].ipv_address && (
                                    <>
                                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                             htmlFor="internet"
                                      >Internet(МИР)
                                        (mbit/s)</label>
                                      <input
                                        disabled={data.tariff !== null}
                                        name="internet"
                                        value={data.internet || ''}
                                        onChange={(e) => changeServer(e, index)}
                                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                        type={'text'}
                                        id="internet"
                                      />
                                      {Number(data.internet) > 10 && (
                                        <label htmlFor="tasIx" className="text-green-500">
                                          *10 (mbit/s) gacha bepul
                                        </label>
                                      )}

                                      <div className="w-full flex flex-col mt-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                               htmlFor="tasIx"
                                        >TAS-IX/UZ-IX
                                          (mbit/s)</label>
                                        <input
                                          disabled={data.tariff !== null}
                                          name="tasix"
                                          value={data.tasix || ''}
                                          onChange={(e) => changeServer(e, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                          id="tasIx"
                                          type={'text'}
                                        />
                                        {Number(data.tasix) > 100 && (
                                          <label htmlFor="tasIx" className="text-green-500">
                                            *100 (mbit/s) gacha bepul
                                          </label>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2">
                                <span className="flex items-center gap-4 mb-2">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                         htmlFor="dataSaved"
                                  >Malumotlarni saqlash (GB)</label>
                                  <button
                                    className={`rounded-full py-1.5 px-3 bg-inherit border dark:border-white ${(data.tariff !== null ? true : handleSecondValidate()) ? 'opacity-25' : ''}`}
                                    disabled={data.tariff !== null ? true : handleSecondValidate()}
                                    onClick={() => addDisks(index)}
                                  >
                                    +
                                  </button>
                                </span>
                                  {server[index]?.data_disks?.map((disk, diskIndex) => (
                                    disk.status !== 3 && (
                                      <div key={diskIndex}>
                                        <div className="flex items-center gap-4">
                                          <select
                                            disabled={data.tariff !== null}
                                            className="w-4/5 px-3 py-2 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                            name="storage"
                                            value={disk.storage || ''}
                                            onChange={(e) => changeDisks(e, index, diskIndex)}
                                          >
                                            <option value="">Tanlang...</option>
                                            <option value="ssd">SSD</option>
                                            <option value="hdd">HDD</option>
                                            <option value="smart_disk">SMART DISK</option>
                                          </select>
                                          <div>
                                          <button
                                              className={`rounded-full py-1.5 px-3 bg-inherit border dark:border-white ${(data.tariff !== null ? true : handleValidateStorages()) ? "opacity-25" : ''}`}
                                              onClick={() => disksDelete(index, diskIndex)}
                                              disabled={data.tariff !== null ? true : handleValidateStorages()}
                                            >
                                              -
                                            </button>
                                          </div>
                                        </div>
                                        {disk.storage && (
                                          <input
                                            disabled={data.tariff !== null}
                                            placeholder={disk.storage.toUpperCase() || ''}
                                            name='storage_disk'
                                            value={disk.storage_disk || ""}
                                            onChange={(e) => changeDisks(e, index, diskIndex)}
                                            className="rounded w-4/5 py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                            id='type'
                                            type={"text"}
                                          />
                                        )}
                                        {Number(disk?.storage_disk) > 4096 && (
                                          <label style={{color: 'red'}} htmlFor="cpu">
                                            * Maksimal qiymat 4096 GB. Ko&apos;proq qo&apos;shish uchun yangi disk
                                            yarating
                                          </label>
                                        )}
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-[20%] border rounded p-3 dark:text-white">
                    <h3 className="font-bold">Serverlar</h3>
                    <div className="text-red-500 mb-2">
                      {vpsCalculate?.success === false && vpsCalculate?.err_msg}
                    </div>
                    <div className="mb-8">
                      {vpsCalculate?.device_price_type === 'Standard' &&
                        <h4 className={'text-red-500'}>
                          Jami 10dan kop yadro uchun, 15% chegirma bilan:
                        </h4>
                      }
                      {vpsCalculate?.device_price_type === 'Pro' &&
                        <h4 className={'text-red-500'}>
                          Jami 100dan kop yadro uchun, 25% chegirma bilan:
                        </h4>
                      }
                    </div>

                    {
                      server.map((data, index) => (
                        data.billing_status !== 3 && (
                          <div className="server_conf" key={index}>

                            {Number(data?.cpu) !== 1 && Number(data?.cpu) % 2 !== 0 &&
                              <h4
                                className={'text-red-500 mb-4'}
                              >
                                Xar bir virtual serverda yadrolar soni juft bo‘lishi lozim
                              </h4>
                            }
                          </div>
                        )
                      ))
                    }

                    <div className="server_conf">
                      <>
                        <div className="flex justify-between">
                          <h4 className="text-2xl mb-2">Konfiguratsiya</h4>
                        </div>
                        <div className="flex justify-between">
                          <p>CPU</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.cpu} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ram} so&apos;m</p>
                        </div>
                        {reducedObject?.ssd_price ? (
                          <div className="flex justify-between">
                            <p>SSD</p>
                            <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ssd_price} so&apos;m</p>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <p>HDD</p>
                            <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.hdd_price} so&apos;m</p>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <p>{'DISK'}</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.additional_disks} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>IP</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ipv_address_price} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>INTERNET</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.internet} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>TASIX</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.tasix} so&apos;m</p>
                        </div>
                      </>
                      <div className="flex justify-between">
                        <p>JAMI:</p>
                        <p>{vpsCalculate?.success && vpsCalculate?.configurations_total_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so&apos;m/oy</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-center mt-2">
                  <button
                    className={`px-3 py-2 rounded text-white ${handleSecondValidate() ? 'opacity-25' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={handleServerAdd}
                    disabled={handleSecondValidate()}
                  >
                    Qo'shish
                  </button>
                </div>
                <div className="w-full flex items-center justify-between mt-2">
                  <button
                    className={`px-3 py-2 rounded text-white`}
                    style={{color: currentColor, border: `1px solid ${currentColor}`}}
                    onClick={() => setCurrentStep(1)}
                  >
                    Orqaga
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-white ${handleSecondValidate() ? 'opacity-25' : ''}`}
                    style={{backgroundColor: currentColor}}
                    disabled={handleSecondValidate()}
                    onClick={async () => {
                      try {
                        await dispatch(createVps({
                          tp_id,
                          contract_date: moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ'),
                          configuration: server,
                          service: service?.id,
                          is_back_office: true,
                          pin_or_tin: userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin,
                          save: 0,
                          user_type: userByTin?.bank_mfo ? 2 : 1,
                        })).then(() => setCurrentStep(3))
                      } catch (e) {
                        toast.error(e.message)
                      }
                    }}
                  >
                    Keyingi
                  </button>
                </div>
              </>
            )}
            {typeContract === '2' && (
              <>
                <div className="w-2/4 my-2">
                  <label
                    htmlFor="type"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    Shartnoma turi
                  </label>
                  <select
                    name="type"
                    id="type"
                    className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                    value={tp_id}
                    onChange={(e) => {
                      setTpId(e.target.value)
                    }}
                  >
                    <option value="" disabled={tp_id}>Tanlang</option>
                    <option value="0">FREE</option>
                    <option value="1">START</option>
                    <option value="2">STANDARD</option>
                    <option value="3">PRO</option>
                    <option value="4">MAX</option>
                    <option value="999">AUTO</option>
                  </select>
                </div>
                <div className="w-11/12 my-2 flex items-center">
                  <div className="w-2/4">
                    <label
                      htmlFor="contract_number"
                      className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                    >
                      Shartnoma raqami
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="contract_number"
                        type={'text'}
                        className="rounded w-[65%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                        placeholder={'Shartnoma raqam'}
                        value={vpsContractNum || ''}
                        onChange={(e) => setVpsContractNumber(e.target.value)}
                      />
                      <button
                        className={`px-4 py-2 rounded text-white`}
                        style={{backgroundColor: currentColor}}
                        onClick={getVpsContractNumber}
                      >
                        Raqam olish
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-4/5">
                    <label className={'block text-gray-700 text-sm font-bold mb-1 ml-3'} htmlFor="contract_date">Shartnoma
                      sanasi</label>
                    <input
                      id="contract_date"
                      type={'date'}
                      className="rounded w-[45%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      placeholder={'Shartnoma sanasi'}
                      value={contract_date || ''}
                      onChange={(e) => setContractDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className={'w-[79%] flex items-center justify-between flex-wrap gap-4 mt-4'}>
                    <div className="ml-2 font-bold w-full">Shartnoma malumotlari</div>
                    {server && server?.map((data, index) => (
                      <div key={index} className="border rounded p-3 w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-2xl">Konfiguratsiya {index + 1}</h3>
                          {data.billing_status !== 3 && (
                            <div>
                              <button
                                onClick={() => handleServerDelete(index)}
                                disabled={data.length === 1}
                              >
                                <TrashIcon
                                  color={currentColor}
                                  className="size-6 cursor-pointer"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                        <div>
                          {data.account_id === null && (
                            <div className={'w-full mb-2'}>
                              <label
                                htmlFor="tariff"
                                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                              >
                                Tarif
                              </label>
                              <select
                                id="tariff"
                                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                name='tariff'
                                value={data.tariff || ''}
                                onChange={(e) => changeServer(e, index)}
                              >
                                <option value={''}>Tanlash</option>
                                {vpsTariffs && vpsTariffs.map((item) => (
                                  <option key={item.id} value={item.id}>{item.tariff_name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          {
                            data.billing_status !== 3 && (
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                {data && (
                                  server[index].vm_systems?.map((element, i) => (
                                    <div key={i} className="flex justify-between items-start gap-4 w-full">
                                      <div className="w-[49%] flex flex-col">
                                        <label
                                          className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                          htmlFor="vm_name"
                                        >
                                          VM: Nomini kiriting {i + 1}
                                        </label>
                                        <input
                                          disabled={data.account_id !== null}
                                          type="text"
                                          id={'vm_name'}
                                          name={'vm_name'}
                                          value={element.vm_name}
                                          onChange={(e) => changeServerNum(e, i, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                        />
                                        <div>
                                          <input
                                            type="checkbox"
                                            onChange={(e) => changeServerNum(e, i, index)}
                                            checked={element.ipv_address}
                                            disabled={(data?.tariff !== null || data?.tariff === '')}
                                            name="ipv_address"
                                            className="w-[5%] mr-2"
                                          />
                                          <label className="w-2/4">Static ip address</label>
                                        </div>
                                      </div>
                                      <div className="w-[49%] flex items-center justify-between">
                                        <div className="flex flex-col w-[49%]">
                                          <label htmlFor="version">VM: Operatsion tizim</label>
                                          <select
                                            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                            id="version"
                                            name='os_type'
                                            disabled={data?.account_id}
                                            value={data?.os_type_id || ""}
                                            onChange={(e) => changeServer(e, index)}
                                          >
                                            <option value="" disabled={data?.os_type_id !== ''}>Tanlash...</option>
                                            {operationSystems && operationSystems.map((el) => (
                                              <option key={el?.os_type_id} value={el.os_type_id}>{el.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="flex flex-col w-[49%]">
                                          <label htmlFor="version">Operatsion tizim versiyasi</label>
                                          <select
                                            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                            id="version"
                                            name='image_id'
                                            disabled={operationSystemsDetail?.length === 0 || data?.account_id}
                                            value={data?.image_id || ''}
                                            onChange={(e) => {
                                              changeServer(e, index)
                                              // dispatch(getOperationSystemsDetail(access, data.image_id))
                                            }}
                                          >
                                            <option value="" disabled={data?.image_id !== ''}>Tanlash...</option>
                                            {operationSystemsDetail && operationSystemsDetail.map((el) => (
                                              el.os_type_id === data?.os_type_id &&
                                              <option key={el?.image_id} value={el.image_id}>{el.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                                <div className="flex flex-col mt-2 w-[49%]">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="cpu">CPU
                                    (CORE)</label>
                                  <input
                                    disabled={data.tariff !== null}
                                    name="cpu"
                                    id="cpu"
                                    type={'text'}
                                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                    placeholder={'CPU'}
                                    value={data.cpu || ''}
                                    onChange={(e) => changeServer(e, index)}
                                  />
                                  {operationSystemsDetail && Number(data.cpu) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu) && Number(data.cpu) < Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu) && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      *
                                      Minimum {Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_cpu)} (CORE)
                                    </label>
                                  )}
                                </div>
                                <div className="flex flex-col mt-2 w-[49%]">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="ram">RAM
                                    (GB)</label>
                                  <input
                                    disabled={data.tariff !== null}
                                    name="ram"
                                    id="ram"
                                    type={'text'}
                                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                    placeholder={'RAM'}
                                    value={data.ram || ''}
                                    onChange={(e) => changeServer(e, index)}
                                  />
                                  {operationSystemsDetail && Number(data.ram) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram) && Number(data.ram) < (Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram)) && (
                                    <label className="text-red-500" htmlFor="ram">
                                      *
                                      Minimum {(Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_ram))} (GB)
                                    </label>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2" id={'dataSaved'}>
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="dataSaved">Operatsion
                                    sistema (GB)</label>
                                  <div>
                                    <select
                                      disabled={data.tariff !== null}
                                      name="system_storage"
                                      value={data.system_storage || ''}
                                      onChange={(e) => changeServer(e, index)}
                                      className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                                    >
                                      <option value="">Tanlang...</option>
                                      <option value="hdd">HDD</option>
                                      <option value="ssd">SSD</option>
                                    </select>
                                    <div className="flex justify-between w-full">
                                      {data.system_storage && (
                                        <input
                                          placeholder={data.system_storage.toUpperCase()}
                                          name="system_storage_disk"
                                          value={data.system_storage_disk || ''}
                                          disabled={data.tariff !== null}
                                          onChange={(e) => changeServer(e, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                          id="type"
                                          type={'text'}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {operationSystemsDetail && Number(data.system_storage_disk) <= Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk) && (Number(data.system_storage_disk)) < (Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk)) && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      *
                                      Minimum {(Number(operationSystemsDetail.find(os => os.image_id === data.image_id)?.min_disk))} (GB)
                                    </label>
                                  )}
                                  {Number(data?.system_storage_disk) > 4096 && (
                                    <label className="text-red-500" htmlFor="cpu">
                                      * Maksimal qiymat 4096 GB. Ko&apos;proq qo&apos;shish uchun yangi disk yarating
                                    </label>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2">
                                  {data.vm_systems[0].ipv_address && (
                                    <>
                                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                             htmlFor="internet"
                                      >Internet(МИР)
                                        (mbit/s)</label>
                                      <input
                                        disabled={data.tariff !== null}
                                        name="internet"
                                        value={data.internet || ''}
                                        onChange={(e) => changeServer(e, index)}
                                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                        type={'text'}
                                        id="internet"
                                      />
                                      {Number(data.internet) > 10 && (
                                        <label htmlFor="tasIx" className="text-green-500">
                                          *10 (mbit/s) gacha bepul
                                        </label>
                                      )}

                                      <div className="w-full flex flex-col mt-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                               htmlFor="tasIx"
                                        >TAS-IX/UZ-IX
                                          (mbit/s)</label>
                                        <input
                                          disabled={data.tariff !== null}
                                          name="tasix"
                                          value={data.tasix || ''}
                                          onChange={(e) => changeServer(e, index)}
                                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                          id="tasIx"
                                          type={'text'}
                                        />
                                        {Number(data.tasix) > 100 && (
                                          <label htmlFor="tasIx" className="text-green-500">
                                            *100 (mbit/s) gacha bepul
                                          </label>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="w-[49%] flex justify-between flex-col mt-2">
                                <span className="flex items-center gap-4 mb-2">
                                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                         htmlFor="dataSaved"
                                  >Malumotlarni saqlash (GB)</label>
                                  <button
                                    className={`rounded-full py-1.5 px-3 bg-inherit border ${(data.tariff !== null ? true : handleSecondValidate()) ? 'opacity-25' : ''}`}
                                    disabled={data.tariff !== null ? true : handleSecondValidate()}
                                    onClick={() => addDisks(index)}
                                  >
                                    +
                                  </button>
                                </span>
                                  {server[index]?.data_disks?.map((disk, diskIndex) => (
                                    disk.status !== 3 && (
                                      <div key={diskIndex}>
                                        <div className="flex items-center gap-4">
                                          <select
                                            disabled={data.tariff !== null}
                                            className="w-4/5 px-3 py-2 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                            name="storage"
                                            value={disk.storage || ''}
                                            onChange={(e) => changeDisks(e, index, diskIndex)}
                                          >
                                            <option value="">Tanlang...</option>
                                            <option value="ssd">SSD</option>
                                            <option value="hdd">HDD</option>
                                          </select>
                                          <div>
                                            <button
                                              className={`rounded-full py-1.5 px-3 bg-inherit border ${(data.tariff !== null ? true : handleValidateStorages()) ? "opacity-25" : ''}`}
                                              onClick={() => disksDelete(index, diskIndex)}
                                              disabled={data.tariff !== null ? true : handleValidateStorages()}
                                            >
                                              -
                                            </button>
                                          </div>
                                        </div>
                                        {disk.storage && (
                                          <input
                                            disabled={data.tariff !== null}
                                            placeholder={disk.storage.toUpperCase() || ''}
                                            name='storage_disk'
                                            value={disk.storage_disk || ""}
                                            onChange={(e) => changeDisks(e, index, diskIndex)}
                                            className="rounded w-4/5 py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                                            id='type'
                                            type={"text"}
                                          />
                                        )}
                                        {Number(disk?.storage_disk) > 4096 && (
                                          <label style={{color: 'red'}} htmlFor="cpu">
                                            * Maksimal qiymat 4096 GB. Ko&apos;proq qo&apos;shish uchun yangi disk
                                            yarating
                                          </label>
                                        )}
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-[20%] border rounded p-3">
                    <h3 className="font-bold">Serverlar</h3>
                    <div className="text-red-500 mb-2">
                      {vpsCalculate?.success === false && vpsCalculate?.err_msg}
                    </div>
                    <div className="mb-8">
                      {vpsCalculate?.device_price_type === 'Standard' &&
                        <h4 className={'text-red-500'}>
                          Jami 10dan kop yadro uchun, 15% chegirma bilan:
                        </h4>
                      }
                      {vpsCalculate?.device_price_type === 'Pro' &&
                        <h4 className={'text-red-500'}>
                          Jami 100dan kop yadro uchun, 25% chegirma bilan:
                        </h4>
                      }
                    </div>

                    {
                      server.map((data, index) => (
                        data.billing_status !== 3 && (
                          <div className="server_conf" key={index}>

                            {Number(data?.cpu) !== 1 && Number(data?.cpu) % 2 !== 0 &&
                              <h4
                                className={'text-red-500 mb-4'}
                              >
                                Xar bir virtual serverda yadrolar soni juft bo‘lishi lozim
                              </h4>
                            }
                          </div>
                        )
                      ))
                    }

                    <div className="server_conf">
                      <>
                        <div className="flex justify-between">
                          <h4 className="text-2xl mb-2">Konfiguratsiya</h4>
                        </div>
                        <div className="flex justify-between">
                          <p>CPU</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.cpu} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>RAM</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ram} so&apos;m</p>
                        </div>
                        {reducedObject?.ssd_price ? (
                          <div className="flex justify-between">
                            <p>SSD</p>
                            <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ssd_price} so&apos;m</p>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <p>HDD</p>
                            <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.hdd_price} so&apos;m</p>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <p>{'DISK'}</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.additional_disks} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>IP</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.ipv_address_price} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>INTERNET</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.internet} so&apos;m</p>
                        </div>
                        <div className="flex justify-between">
                          <p>TASIX</p>
                          <p>{vpsCalculate?.success && vpsCalculate?.configurations_prices?.length !== 0 && reducedObject?.tasix} so&apos;m</p>
                        </div>
                      </>
                      <div className="flex justify-between">
                        <p>JAMI:</p>
                        <p>{vpsCalculate?.success && vpsCalculate?.configurations_total_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so&apos;m/oy</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-center mt-2">
                  <button
                    className={`px-3 py-2 rounded text-white ${handleSecondValidate() ? 'opacity-25' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={handleServerAdd}
                    disabled={handleSecondValidate()}
                  >
                    Qo'shish
                  </button>
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="document">
                  Hujjat
                </label>
                <div className="flex items-center gap-4 rounded w-[79%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1">
                  <button
                    onClick={handleFileClick}
                    className="ml-2 py-1.5 px-2 text-white rounded"
                    style={{backgroundColor: currentColor}}
                  >
                    Fayl tanlang
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={fileName}
                    onClick={handleFileClick}
                    placeholder="Choose file"
                  />
                </div>
                <input
                  id="hiddenFileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-full flex items-center justify-between mt-2">
                  <button
                    className={`px-3 py-2 rounded text-white`}
                    style={{color: currentColor, border: `1px solid ${currentColor}`}}
                    onClick={() => setCurrentStep(1)}
                  >
                    Orqaga
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-white ${handleSecondValidate() ? 'opacity-25' : ''}`}
                    style={{backgroundColor: currentColor}}
                    disabled={handleSecondValidate()}
                    onClick={postSignedContract}
                  >
                    Saqlash
                  </button>
                </div>
              </>
            )}
            {typeContract === '3' && (
              <>
                <div className="w-11/12 my-2 flex items-center">
                  <div className="w-full">
                    <label
                      htmlFor="contract_number"
                      className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                    >
                      Shartnoma yakunlash sanasi
                    </label>
                    <div className="flex items-center gap-10">
                      <input
                        id="contract_number"
                        type={'date'}
                        className="rounded w-[65%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                        placeholder={'Shartnoma yakunlash sanasi'}
                        value={expiration_date || ''}
                        onChange={(e) => setExpirationDate(e.target.value)}
                      />
                      <button
                        className={`px-4 py-2 rounded text-white ${!expiration_date ? 'opacity-25' : ''}`}
                        style={{backgroundColor: currentColor}}
                        disabled={!expiration_date || expiration_date === ''}
                        onClick={postFinishContract}
                      >
                        Yuborish
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )
      case 3:
        return (
          <>
            <div
              dangerouslySetInnerHTML={{__html: typeContract === '3' ? vpsFinish : vpsDocument}}
              className="px-2 py-3 border rounded dark:text-white"
            />
            <div className="w-full flex items-center justify-between mt-4">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={() => {
                    navigate(-1)
                    dispatch(clearStatesVps())
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                  style={{color: currentColor}}
                  onClick={() => setCurrentStep(2)}
                >
                  Orqaga
                </button>
                <button
                  className={`px-4 py-2 rounded text-white`}
                  style={{backgroundColor: currentColor}}
                  onClick={typeContract === '3' ? postFinishContract : createVpsFunc}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  if (loading) return <Loader/>

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
      <Header category="Vps" title="Shartnomalar yaratish"/>
      <div className="mt-4">
        {displayStep(currentStep)}
      </div>
    </div>
  );
};

export default CreateVps;