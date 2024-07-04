import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import {clearSavedContractDetails, savePkcs} from "../store/actions/contractActions";
import {useNavigate} from 'react-router-dom';
import {EIMZOClient, dates} from './eSignClient';
// import {axios2} from "../axios";
import instance from '../../API';
import {toast} from "react-toastify";
import {oneIdGetUserDetail, setAccessToken, setLogout, setRefresh, setUser} from "../../redux/slices/auth/authSlice";
import {api_url, APIS} from "../../config";
import axios from "axios";
import {getContractDetail, savePkcs} from "../../redux/slices/contracts/contractsSlice";

export function HooksCommission() {
  const [pkcs, setPkcs] = useState('');
  const [id, setId] = useState([]);
  const [idx, setIdx] = useState([]);
  const [err_msg, setErrMsg] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {access_token, user} = useSelector((state) => state.user);

  let EIMZO_MAJOR = 3;
  let EIMZO_MINOR = 37;

  let errorCAPIWS =
    "Ошибка соединения с E-IMZO. Возможно у вас не установлен модуль E-IMZO или Браузер E-IMZO.";
  let errorBrowserWS =
    "Браузер не поддерживает технологию WebSocket. Установите последнюю версию браузера.";
  //   let errorUpdateApp =
  //     "ВНИМАНИЕ !!! Установите новую версию приложения E-IMZO или Браузера E-IMZO.<br /><a href="https://e-imzo.uz/main/downloads/" role="button">Скачать ПО E-IMZO</a>";
  let errorWrongPassword = "Пароль неверный.";

  let AppLoad = function () {
    EIMZOClient.API_KEYS = [
      'localhost',
      '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
      '127.0.0.1',
      'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
      'null',
      'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
      'cabinet.unicon.uz',
      'A54F16144CDCE3332E16564A9508DBF6B461E696DCCBE84569C6E18876F0F78EFA6805B4EF2DAEA6AA13179FF5E3AB5B7631A90C56DC227D190CA6958C39B171',
    ];
    EIMZOClient.checkVersion(
      function (major, minor) {
        let newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
        let installedVersion = parseInt(major) * 100 + parseInt(minor);
        if (installedVersion < newVersion) {
          // uiUpdateApp()
        } else {
          EIMZOClient.installApiKeys(function () {
            return uiLoadKeys();
          }, function (e, r) {
            if (r) {
              uiShowMessage(r);
            } else {
              wsError(e);
            }
          });
        }
      },
      function (e, r) {
        if (r) {
          uiShowMessage(r);
        } else {
          uiNotLoaded(e);
        }
      }
    );
  };

  let uiShowMessage = function (message) {
    toast.success(message);
  };

  let uiNotLoaded = function (e) {
    if (e) {
      wsError(e);
    } else {
      uiShowMessage(errorBrowserWS);
    }
  };

  let uiLoadKeys = function () {
    uiClearCombo();
    EIMZOClient.listAllUserKeys(
      function (o, i) {
        let itemId = "itm-" + o.serialNumber;
        setId([...id, o]);
        id.push(o)
        idx.push(i)
        return itemId;
      },
      function (itemId, v) {
        return uiCreateItem(itemId, v);
      },
      function (items, firstId) {
        uiFillCombo(items);
        uiComboSelect(firstId);
      },
      function (e, r) {
        if (e) {
          uiShowMessage(errorCAPIWS + " : " + e);
        } else {
          uiShowMessage(r);
        }
      }
    );
  };

  let uiComboSelect = function (itm) {
    if (itm) {
      let el = document.getElementById(itm);
      el.setAttribute("selected", "true");
      // el.removeAttribute("disabled");
    }
  };

  let uiClearCombo = function () {
    let combo = document.getElementById("S@loxiddin");
    combo.length = 0;
  };

  let uiFillCombo = function (items) {
    document.getElementById("S@loxiddin").innerHTML = "";
    let combo = document.getElementById("S@loxiddin");
    for (let itm in items) {
      combo.append(items[itm]);
    }
  };

  let uiCreateItem = function (itmkey, vo) {
    let now = new Date();
    vo.expired = dates.compare(now, vo.validTo) > 0;
    let itm = document.createElement("option");
    itm.value = itmkey;
    if (vo.O === '') {
      itm.text = vo.CN;
    } else {
      itm.text = vo.O
    }
    if (!vo.expired) {
    } else {
      itm.style.color = "gray";
      itm.text = itm.text + " (срок истек)";
      itm.disabled = true;
    }
    itm.setAttribute("vo", JSON.stringify(vo));
    itm.setAttribute("id", itmkey);
    itm.setAttribute('name', vo.PINFL)
    itm.setAttribute("disabled", '');
    return itm;
  };

  let wsError = function (e) {
    if (e) {
      uiShowMessage(errorCAPIWS + " : " + e);
    } else {
      uiShowMessage(errorBrowserWS);
    }
  };

  const sign = (data_b4, service, contract_id) => {
    const itm = document.getElementById("S@loxiddin").value;
    if (itm) {
      let id = document.getElementById(itm);
      let vo = JSON.parse(id.getAttribute("vo"));
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
      EIMZOClient.loadKey(
        vo,
        function (id) {
          EIMZOClient.createPkcs7(
            id,
            data_b4,
            null,
            function (pkcs7) {
              setPkcs(pkcs7)
              localStorage.setItem('pkcs7', JSON.stringify(pkcs7))
              dispatch(
                savePkcs(
                  {
                    pkcs7: pkcs7,
                    contract_id: contract_id,
                  },
                  service,
                )
              ).then((res) => {
                  if (!res?.success) {
                    toast.error(res?.err_msg)
                    setErrMsg(res?.err_msg)
                    setError(true)
                  } else {
                    dispatch(getContractDetail(contract_id))
                  }
                }
              );
            },
            function (e, r) {
              if (r) {
                if (r.indexOf("BadPaddingException") !== -1) {
                  instance.delete(`${api_url}/${service}/reject/${contract_id}`, {headers}).then(() => navigate(-1))
                  uiShowMessage(errorWrongPassword);
                } else {
                  instance.delete(`${api_url}/${service}/reject/${contract_id}`, {headers}).then(() => navigate(-1))
                  uiShowMessage(r);
                }
              } else {
                uiShowMessage(errorBrowserWS);
              }
              if (e) wsError(e);
            },
            '',
            ''
          );
        },
        function (e, r) {
          if (r) {
            if (r.indexOf("BadPaddingException") !== -1) {
              uiShowMessage(errorWrongPassword);
            } else {
              uiShowMessage(r);
            }
          } else {
            uiShowMessage(errorBrowserWS);
          }
          if (e) wsError(e);
        },
        ''
      );
    } else
      toast.error("E-IMZO kalit topilmadi")
  };

  const signIn = () => {
    let itm = document.getElementById("S@loxiddin").value
    if (itm) {
      let id = document.getElementById(itm)
      let vo = JSON.parse(id.getAttribute("vo"))

      const challenge = localStorage.getItem('challenge')

      const postChallenge = async (pkcs7) => {
        try {
          const response = await instance.post(`${APIS.eriLogin}`, {pkcs7, is_client: 1})
          instance.defaults.headers.common = {Authorization: `Bearer ${response?.data?.access}`};
          if (!response?.data?.success) {
            toast.error(response?.data?.err_msg)
          } else {
            await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
              if (res?.payload?.userdata?.role?.name === 'mijoz') {
                toast.success('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
                await dispatch(setLogout())
              } else {
                await dispatch(setUser(res))
                await dispatch(setAccessToken(response?.data?.access))
                await dispatch(setRefresh(response?.data?.refresh))
                await navigate('/dashboard')
                // window.location.reload()
              }
            })
            // if (responseData?.auth_method === 'strong') {
            //   navigate('/two-factor')
            // } else {
            //   await dispatch(oneIdGetUserDetail(responseData?.access)).then((res) => {
            //     if (res?.userdata?.role?.name === 'mijoz') {
            //       toast.success('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
            //     } else {
            //       navigate('/shartnomalar')
            //       // window.location.reload()
            //     }
            //   })
            // }
          }
        } catch (e) {
          console.log(e)
        }
      }

      EIMZOClient.loadKey(
        vo,
        function (id) {
          EIMZOClient.createPkcs7Auth(
            id,
            challenge,
            null,
            function (pkcs7) {
              localStorage.setItem('pkcs7', JSON.stringify(pkcs7))
              if (pkcs7) {
                postChallenge(pkcs7)
                localStorage.removeItem('challenge')
              }
            },
            function (e, r) {
              if (r) {
                if (r.indexOf("BadPaddingException") !== -1) {
                  uiShowMessage(errorWrongPassword)
                } else {
                  uiShowMessage(r)
                }
              } else {
                uiShowMessage(errorBrowserWS)
              }
              if (e) wsError(e)
            },
            "",
            ""
          )
        },
        function (e, r) {
          if (r) {
            if (r.indexOf("BadPaddingException") !== -1) {
              uiShowMessage(errorWrongPassword)
            } else {
              uiShowMessage(r)
            }
          } else {
            uiShowMessage(errorBrowserWS)
          }
          if (e) wsError(e)
        },
        ""
      )
    } else toast.error("E-IMZO kalit topilmadi")
  }

  return {
    AppLoad,
    uiLoadKeys,
    sign,
    signIn,
    pkcs,
    id,
    idx,
    err_msg,
    error,
    setError,
    setErrMsg
  };
}