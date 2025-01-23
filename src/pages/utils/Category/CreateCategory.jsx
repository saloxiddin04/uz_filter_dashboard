import React, {useEffect, useState} from 'react';
import {Button, DetailNav, Input, Loader, TabsRender} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {
  createCategory,
  fileUpload,
  getAllCategories,
  getCategory,
  updateCategory
} from "../../../redux/slices/utils/category/categorySlice";
import {useStateContext} from "../../../contexts/ContextProvider";

const tabs = [
  {
    title: 'Create Parent Category',
    active: true
  },
  {
    title: "Create Child Category",
    active: false
  }
]

const CreateCategory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();
  const {id} = useParams()

  const {categories, loading} = useSelector(state => state.category)

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  const [name, setName] = useState(null);
  const [parent, setParent] = useState(null);
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (openTab === 2) {
      dispatch(getAllCategories())
    }
  }, [dispatch, openTab]);

  useEffect(() => {
    if (id !== ':id') {
      dispatch(getCategory(id)).then(({payload}) => {
        setName(payload?.name)
        setImage(payload?.image)
      })
    }
  }, [dispatch, id]);

  const postCategory = () => {
    if (id !== ':id') {
      if (!name) return toast.error('All inputs required')

      dispatch(updateCategory({id, data: {name, image}})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Updated successfully!')
          // dispatch(getAllCategories())
          setName(null)
          setParent(null)
          setImage(null)
          setOpenTab(0)
          navigate('/category')
        }
      })
    } else {
      if (!name || (openTab === 2 && !parent)) return toast.error('All inputs required')

      dispatch(createCategory({name, parent, image})).then(({payload}) => {
        if (payload?.id) {
          toast.success('Created successfully!')
          // dispatch(getAllCategories())
          setName(null)
          setParent(null)
          setImage(null)
          setOpenTab(0)
          navigate('/category')
        }
      })
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]

    if (!file) {
      return toast.error('No file selected')
    }

    const formData = new FormData()
    formData.append('file', file)
    dispatch(fileUpload(formData)).then(({payload}) => {
      if (payload?.id) {
        setImage(payload?.id)
      }
    })
  }

  const renderCategory = () => {
    switch (openTab) {
      case 0:
        return (
          <>
            <Input
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              label="Category Name"
              type="text"
              className="w-full mb-4"
            />
            <Input
              onChange={(e) => handleFile(e)}
              label="Category Icon"
              type="file"
              className="w-full mb-4"
            />
            {id !== ':id' && image && (
              <img src={image} alt="img"/>
            )}
            <Button
              text={id !== ':id' ? "Update Category" : "Create Parent Category"}
              style={{backgroundColor: currentColor}}
              className="text-white rounded flex ml-auto"
              onClick={postCategory}
            />
          </>
        )
      case 1:
        return (
          loading ?
            <Loader/> :
            <>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="category">Parent Category</label>
              <select
                name="category"
                id="category"
                className="py-2 px-3 w-full border rounded focus:outline-none mb-4 shadow"
                value={parent || ""}
                onChange={(e) => setParent(e.target.value)}
              >
              <option value={null}>Select...</option>
                {categories?.map((item) => (
                  <option value={item?.id} key={item?.id}>{item?.name}</option>
                ))}
            </select>
            </div>
            <Input
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              label="Category Name"
              type="text"
              className="w-full mb-4"
            />
            <Input
              onChange={(e) => handleFile(e)}
              label="Category Icon"
              type="file"
              className="w-full mb-4"
              accept=".jpg,.jpeg"
            />
            <Button
              text="Create Child Category"
              style={{backgroundColor: currentColor}}
              className="text-white rounded flex ml-auto"
              onClick={postCategory}
            />
          </>
        )

      default:
        return <p>Wrong step</p>
    }
  }

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <DetailNav
          id={''}
          name={''}
          status={''}
        />
      </div>
      {id === ':id' && (
        <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
          <TabsRender
            tabs={tabs}
            color={currentColor}
            openTab={openTab}
            setOpenTab={setOpenTab}
          />
        </div>
      )}
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        {renderCategory()}
      </div>
    </>
  );
};

export default CreateCategory;