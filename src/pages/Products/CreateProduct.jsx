import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {Button, DetailNav, Input} from "../../components";
import {toast} from "react-toastify";
import {fileUpload, getAllCategories} from "../../redux/slices/utils/category/categorySlice";
import {createProduct, getProduct, setLoading} from "../../redux/slices/products/productSlice";
import {getAllBrands} from "../../redux/slices/utils/brands/brandSlice";
import {getAllAttributes} from "../../redux/slices/utils/attributes/attributeSlice";
import {TrashIcon} from "@heroicons/react/16/solid";

const CreateProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();
  const {id} = useParams()
  
  const {loading, product} = useSelector((state) => state.product)
  
  const {categories} = useSelector(state => state.category)
  const {brands} = useSelector(state => state.brand)
  const {attributes} = useSelector(state => state.attribute)
  
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [category, setCategory] = useState(null)
  const [product_files, setProductFiles] = useState([
    {
      image: null
    }
  ])
  const [product_variants, setProductVariants] = useState([
    {
      category: null,
      brand: null,
      unique_code: null,
      price: null,
      discount: null,
      quantity: null,
      product_variant_attributes: [{
        attribute: null,
        value: null
      }]
    }
  ])
  
  useEffect(() => {
    dispatch(getAllBrands())
    dispatch(getAllAttributes())
    dispatch(getAllCategories())
  }, []);
  
  useEffect(() => {
    if (id !== ':id') {
      dispatch(getProduct(id)).then(({payload}) => {
        setName(payload?.name)
        setCategory(payload?.category?.id)
        setDescription(payload?.description)
        setProductFiles(payload?.product_files?.map((item) => ({
          image: item?.image?.file
        })))
        setProductVariants(
          payload?.product_variants?.map((item) => ({
            category: item?.category?.id || null,
            brand: item?.brand?.id || null,
            unique_code: item?.unique_code || null,
            price: item?.price || null,
            discount: item?.discount || null,
            quantity: item?.quantity || null,
            product_variant_attributes: item?.product_variant_attributes?.map((attr) => ({
              attribute: attr?.attribute?.id || null,
              value: attr?.value || null,
            })) || []
          })) || []
        );
      })
    }
  }, [id, dispatch]);
  
  console.log(product_files)
  
  const handleAddFile = () => {
    setProductFiles([...product_files, {image: null}]);
  };
  
  const handleRemoveFile = (index) => {
    const updatedFiles = product_files?.filter((_, i) => i !== index);
    setProductFiles(updatedFiles);
  };
  
  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    
    if (!file) {
      return toast.error('No file selected');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    dispatch(setLoading(true));
    dispatch(fileUpload(formData))
      .then(({payload}) => {
        if (payload?.id) {
          // Update the image in the product_files array
          setProductFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index].image = payload.id;
            return updatedFiles;
          });
          dispatch(setLoading(false));
        }
      })
      .catch(() => {
        dispatch(setLoading(false));
        return toast.error('Something went wrong');
      });
  };
  
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product_variants];
    
    if (field === "quantity" || field === "price") {
      updatedVariants[index][field] = Number(value) || 0;
    } else {
      updatedVariants[index][field] = value;
    }
    // updatedVariants[index][field] = value;
    setProductVariants(updatedVariants);
  };
  
  const handleAddVariant = () => {
    setProductVariants([
      ...product_variants,
      {
        category: null,
        brand: null,
        unique_code: null,
        price: null,
        discount: null,
        quantity: null,
        product_variant_attributes: [
          {
            attribute: null,
            value: null,
          },
        ],
      },
    ]);
  };
  
  const handleRemoveVariant = (index) => {
    const updatedVariants = product_variants.filter((_, i) => i !== index);
    setProductVariants(updatedVariants);
  };
  
  const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
    const updatedVariants = [...product_variants];
    updatedVariants[variantIndex].product_variant_attributes[attrIndex][field] = value;
    setProductVariants(updatedVariants);
  };
  
  const handleAddAttribute = (variantIndex) => {
    const updatedVariants = [...product_variants];
    updatedVariants[variantIndex].product_variant_attributes.push({
      attribute: null,
      value: null,
    });
    setProductVariants(updatedVariants);
  };
  
  const handleRemoveAttribute = (variantIndex, attrIndex) => {
    const updatedVariants = [...product_variants];
    updatedVariants[variantIndex].product_variant_attributes = updatedVariants[
      variantIndex
      ].product_variant_attributes.filter((_, i) => i !== attrIndex);
    setProductVariants(updatedVariants);
  };
  
  const validateProduct = () => {
    if (!name || name.trim() === "") {
      toast.error("Product name is required.");
      return false;
    }
    
    if (!description || description.trim() === "") {
      toast.error("Product description is required.");
      return false;
    }
    
    if (!category) {
      toast.error("Please select a category.");
      return false;
    }
    
    if (product_files.length === 0 || product_files.some(file => !file.image)) {
      toast.error("Please upload at least one product image.");
      return false;
    }
    
    for (let i = 0; i < product_variants.length; i++) {
      const variant = product_variants[i];
      
      if (!variant.category || variant.category.trim() === "") {
        toast.error(`Variant ${i + 1}: Category is required.`);
        return false;
      }
      
      if (!variant.brand || variant.brand.trim() === "") {
        toast.error(`Variant ${i + 1}: Brand is required.`);
        return false;
      }
      
      if (!variant.unique_code || variant.unique_code.trim() === "") {
        toast.error(`Variant ${i + 1}: Unique code is required.`);
        return false;
      }
      
      if (product_variants.some((v, index) => v.unique_code === variant.unique_code && index !== i)) {
        toast.error(`Variant ${i + 1}: Unique code must be unique.`);
        return false;
      }
      
      if (!variant.price || isNaN(variant.price) || variant.price <= 0) {
        toast.error(`Variant ${i + 1}: Price must be a positive number.`);
        return false;
      }
      
      if (variant.discount && (isNaN(variant.discount) || variant.discount < 0)) {
        toast.error(`Variant ${i + 1}: Discount must be a valid number.`);
        return false;
      }
      
      if (!variant.quantity || isNaN(variant.quantity) || variant.quantity <= 0) {
        toast.error(`Variant ${i + 1}: Quantity must be a positive number.`);
        return false;
      }
      
      for (let j = 0; j < variant.product_variant_attributes.length; j++) {
        const attribute = variant.product_variant_attributes[j];
        
        if (!attribute.attribute || attribute.attribute.trim() === "") {
          toast.error(`Variant ${i + 1}, Attribute ${j + 1}: Attribute name is required.`);
          return false;
        }
        
        if (!attribute.value || attribute.value.trim() === "") {
          toast.error(`Variant ${i + 1}, Attribute ${j + 1}: Attribute value is required.`);
          return false;
        }
      }
    }
    
    return true;
  };
  
  const postProduct = () => {
    if (!validateProduct()) {
      return;
    }
    
    const productData = {
      name,
      description,
      category,
      product_files,
      product_variants,
    };
    
    dispatch(setLoading(true));
    dispatch(createProduct(productData))
      .then(() => {
        toast.success("Product created successfully!");
        navigate('/products')
      })
      .catch(() => {
        toast.error("Failed to create product. Please try again.");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }
  
  return (
    <>
      <div className="card">
        <DetailNav
          id={id !== ':id' ? product?.id : ''}
          name={id !== ':id' ? product?.name : ''}
          status={''}
        />
      </div>
      
      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-[49%]">
            <Input
              type="text"
              placeholder="Product name"
              label={'Product name'}
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className={'w-full'}
            />
          </div>
          <div className="w-[49%] flex flex-col">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2 ml-3">Product Category</label>
            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full border rounded py-1.5 px-3 shadow focus:border focus:border-[${currentColor}]`}
              id="category"
            >
              <option value={null}>Select...</option>
              {categories && categories?.map((item) => (
                <option value={item?.id} key={item?.id}>{item?.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 ml-3">Description</label>
          <textarea
            className="w-full border rounded shadow focus:outline-none p-2"
            rows={5}
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
          />
        </div>
        
        <div className="mb-6 w-full flex flex-wrap">
          <h2 className="text-lg font-semibold mb-3 w-full">Product Files</h2>
          {product_files.map((file, index) => (
            id !== ':id' ? (
              <div key={index} className="w-2/4 aspect-auto">
                <img className="object-cover" src={file?.image} alt={file?.image} />
              </div>
            ) : (
              <div key={index} className="flex flex-col gap-4 mb-3 border rounded p-2 w-full">
                <button
                  className="text-red-500 border border-red-500 rounded p-2 hover:underline ml-auto disabled:opacity-25"
                  onClick={() => handleRemoveFile(index)}
                  disabled={product_files?.length === 1}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  className="block w-full border rounded-lg p-2"
                  onChange={(e) => handleFileUpload(e, index)}
                />
              </div>
            )
          ))}
          {id === ':id' && (
            <button
              className={`text-white px-4 py-2 rounded-lg mx-auto`}
              style={{backgroundColor: currentColor}}
              onClick={handleAddFile}
            >
              Add File
            </button>
          )}
        </div>
        
        <div className="mb-6 w-full flex flex-wrap">
          <h2 className="text-lg font-semibold mb-3 w-full">Product Variants</h2>
          {product_variants.map((variant, index) => (
            <div key={index} className="border p-4 rounded-lg mb-3 w-full flex flex-wrap">
              <button
                className="text-red-500 hover:underline my-2 border border-red-500 p-2 rounded ml-auto disabled:opacity-25"
                onClick={() => handleRemoveVariant(index)}
                disabled={id !== ':id' ? true : product_variants.length === 1}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-3 gap-4 items-end w-full">
                <div className="flex flex-col">
                  <label
                    htmlFor="category"
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3">Product Category</label>
                  <select
                    value={variant.category || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "category", e.target.value)
                    }
                    className={`w-full border rounded py-1.5 px-3 shadow`}
                    id="category"
                  >
                    <option value={null}>Select...</option>
                    {categories && categories?.map((item) => (
                      <option value={item?.id} key={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label
                    htmlFor="brand"
                    className="block text-gray-700 text-sm font-bold mb-2 ml-3">Product Brand</label>
                  <select
                    value={variant.brand || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "brand", e.target.value)
                    }
                    className={`w-full border rounded py-1.5 px-3 shadow`}
                    id="brand"
                  >
                    <option value={null}>Select...</option>
                    {brands && brands?.map((item) => (
                      <option value={item?.id} key={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Unique code"
                    label={'Unique code'}
                    value={variant.unique_code || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "unique_code", e.target.value)
                    }
                    className={'w-full'}
                  />
                </div>
                
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Price"
                    label={'Price'}
                    value={variant.price || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    className={'w-full'}
                  />
                </div>
                
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Discount"
                    label={'Discount'}
                    value={variant.discount || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "discount", e.target.value)
                    }
                    className={'w-full'}
                  />
                </div>
                
                <div className="flex flex-col">
                  <Input
                    type="text"
                    placeholder="Quanity"
                    label={'Quantity'}
                    value={variant.quantity || ""}
                    onChange={(e) =>
                      handleVariantChange(index, "quantity", e.target.value)
                    }
                    className={'w-full'}
                  />
                </div>
              </div>
              <div className="mt-4 w-full flex flex-wrap border rounded p-2">
                <h3 className="font-semibold mb-2 w-full">Attributes</h3>
                {variant.product_variant_attributes.map((attr, attrIndex) => (
                  <div key={attrIndex} className="flex items-center gap-4 mb-2 w-full">
                    <select
                      value={attr.attribute || ""}
                      onChange={(e) =>
                        handleAttributeChange(index, attrIndex, "attribute", e.target.value)
                      }
                      className={`w-full border rounded py-1.5 px-3 shadow`}
                      id="category"
                    >
                      <option value={null}>Select...</option>
                      {attributes && attributes?.map((item) => (
                        <option value={item?.id} key={item?.id}>{item?.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      className="border p-2 rounded-lg w-1/2"
                      value={attr.value || ""}
                      onChange={(e) =>
                        handleAttributeChange(index, attrIndex, "value", e.target.value)
                      }
                    />
                    <button
                      className="text-red-500 border border-red-500 rounded p-2 hover:underline disabled:opacity-25"
                      onClick={() => handleRemoveAttribute(index, attrIndex)}
                      disabled={id !== ':id' ? true : variant.product_variant_attributes.length === 1}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  className="text-white px-4 py-2 rounded-lg mt-2 mx-auto disabled:opacity-25"
                  onClick={() => handleAddAttribute(index)}
                  style={{
                    backgroundColor: currentColor
                  }}
                  disabled={id !== ':id'}
                >
                  Add Attribute
                </button>
              </div>
            </div>
          ))}
          <button
            className="text-white px-4 py-2 rounded-lg mx-auto disabled:opacity-25"
            onClick={handleAddVariant}
            style={{
              backgroundColor: currentColor
            }}
            disabled={id !== ':id'}
          >
              Add Variant
            </button>
         </div>
        
        {id === ':id' && (
          <div className="w-full flex">
            <Button
              text={loading ? 'Loading...' : (id !== ':id' ? "Update Product" : "Create Product")}
              style={{backgroundColor: currentColor}}
              className="text-white rounded flex ml-auto disabled:opacity-25"
              onClick={postProduct}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CreateProduct;