import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Button, DetailNav, Input} from "../../../components";
import {toast} from "react-toastify";
import {createAttribute, getAttribute, updateAttribute} from "../../../redux/slices/utils/attributes/attributeSlice";

const CreateAttributes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();
  const {id} = useParams()

  const {loading, attribute} = useSelector(state => state.attribute)

  const [name, setName] = useState(null);

  useEffect(() => {
    if (id !== ':id') {
      dispatch(getAttribute(id)).then(({payload}) => {
        setName(payload?.name)
      })
    }
  }, [id]);

  const postAttribute = () => {
    if (id === ':id') {
      if (!name) return toast.error('All inputs required')

      dispatch(createAttribute({name})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Attribute created successfully!')
          navigate('/attributes')
          setName(null)
        }
      })
    } else {
      if (!name) return toast.error('All inputs required')

      dispatch(updateAttribute({id, data: {name}})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Attribute updated successfully!')
          navigate('/attributes')
          setName(null)
        }
      })
    }
  }

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <DetailNav
          id={id !== ':id' ? attribute?.id : ''}
          name={id !== ':id' ? attribute?.name : ''}
          status={''}
        />
      </div>

      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <Input
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          label="Attribe Name"
          type="text"
          className="w-full mb-4"
        />

        <Button
          text={loading ? 'Loading...' : (id !== ':id' ? "Update Attribute" : "Create Attribute")}
          style={{backgroundColor: currentColor}}
          className="text-white rounded flex ml-auto disabled:opacity-25"
          disabled={loading}
          onClick={postAttribute}
        />
      </div>
    </>
  );
};

export default CreateAttributes;