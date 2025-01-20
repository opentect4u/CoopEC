import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../routes/config";
import Loader from '../Components/Loader';

// let district_def_value, range_def_value, type_def_value, soci_Name_def_value;

const initialValues = {
  // select_district: formik.values.select_district ? formik.values.select_district : '',
  select_district: '',
  select_range: '',
  select_type: '',
  society_Name: '',
  filterOption: 'district',
  // filterOption: 'district',
};

const validationSchema = Yup.object({
  filterOption: Yup.string().required('Please select either District or Range'),
  select_district: Yup.string().when('filterOption', {
    is: 'district', // If filterOption is 'range'
    then: () => Yup.string().required('Select District is Required'),
    otherwise: () => Yup.string(), // Not required otherwise
  }),
  select_range: Yup.string().when('filterOption', {
    is: 'range', // If filterOption is 'district'
    then: () => Yup.string().required('Select Range is Required'),
    otherwise: () => Yup.string(), // Not required otherwise
  }),

  // packing_forwarding_extra: Yup.string().when("packing_forwarding_val", {
  //   is: "E",
  //   then: () =>
  //     Yup.number()
  //       .required("Extra is required!")
  //       .min(0.0000000000000001, "Please enter a non-zero positive input!"),
  //   otherwise: () => Yup.string(),
  // }),

  // select_district: Yup.string().required('ddddddddd'),
  // select_district: Yup.string(),
  // select_range: Yup.string(),
  // select_type: Yup.string(),
  // society_Name: Yup.string(),
});




function SearchBox({district_def_Valu, range_def_Valu, type_def_Valu, soci_Name_def_Valu, radioBtn_Valu}) {
  
  
  // console.log(district_def_Valu, range_def_Valu, type_def_Valu, soci_Name_def_Valu)
  // const resp={
  //   select_district: district_def_Valu,
  //   select_range: '',
  //   select_type: '',
  //   society_Name: '',
  // }
  // console.log(resp, 'lllllllllll');
  
  // const [formValues, setValues] = useState(resp);
  

  const [getRadioValue, setRadioValue] = useState('');
  const [getDistrictList, setDistrictList] = useState([]);
  const [getRangeList, setRangeList] = useState([]);
  const [getSocietyType, setSocietyType] = useState([]);
  const [formValues,setFormValues]  = useState(initialValues);
  const [getLoading_range, setLoading_range] = useState(true);


  const districtList = async()=>{

    await axios.post(`${BASE_URL}/wapi/distlist`,
      // {},
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {

      if(res.status == '200'){
      if(res.data.suc > 0){
        setDistrictList(res?.data?.msg)
      }

      }

        
      })  
   }

   const rangeList = async()=>{

    // console.log(districValue, 'kkkkkkkkkkkkkkkk');
    
    await axios.post(`${BASE_URL}/wapi/rangelist`,
      {
        auth_key:"xxxxx",
        // dist_id: districValue
      }
      ,
      {
          headers: {
            auth_key: 'c299cf0ae55ac8a2e3932b65fe5f08538962c5114b0f7d5680db8193eb2d3116',
          },
      }
      ).then(res => {

      if(res.status == '200'){
      if(res.data.suc > 0){
        setRangeList(res?.data?.msg)
        setLoading_range(false);
        console.log(res?.data?.msg, 'getRangeList');
      } else {
        setLoading_range(false);
      }

      }

        
      })  
   }

   const societyType = async()=>{

    await axios.post(`${BASE_URL}/wapi/sotypelist`,
      // {},
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {

      if(res.status == '200'){
      if(res.data.suc > 0){
        setSocietyType(res?.data?.msg);
        // console.log(res?.data?.msg, 'kkkkkkkkkk');
        
      }

      }

        
      })  
   }


const navigation = useNavigate();

const onSubmit = (values) => {
  console.log(values, 'valuesvaluesvaluesvaluesvalues');
  
  navigation('/search', { state: values});
  // alert('go')
};

useEffect(()=>{
  if(getRadioValue == 'range'){
    formik.setFieldValue("select_district", "");
  } else if (getRadioValue == 'district'){
    formik.setFieldValue("select_range", "");
  }
          // setRadioValue(e.target.value)
}, [getRadioValue])

useEffect(()=>{
  districtList();
  societyType();
},[])


  const formik = useFormik({
    initialValues:formValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });
  
  useEffect(() => {
    console.log('Formik values:', formik.values);
  }, [formik.values]);
  
  useEffect(()=>{
  rangeList();
  setLoading_range(true);
  }, [formik.values.select_district])

 useEffect(()=>{
  setFormValues({
    select_district: district_def_Valu,
    select_range: range_def_Valu,
    select_type: type_def_Valu,
    society_Name: soci_Name_def_Valu,
    filterOption: radioBtn_Valu == undefined ? "district" : radioBtn_Valu
   })
 },[])
 
  return (
    <div className="search_box">
      <h2>Search</h2>
     {/* {district_def_Valu} */}
      <form onSubmit={formik.handleSubmit}>
        {/* Select District */}

        <div className="radio_button_ranDis">
    <label>
      <input
        type="radio"
        name="filterOption"
        value="district"
        checked={formik.values.filterOption === "district"}
        // onChange={formik.handleChange}
        onChange={(e) => {
          setRadioValue(e.target.value)
          console.log(e.target.value, '///////////////////////////////');
          formik.setFieldValue("filterOption", e.target.value); // Update Formik state
        }}
  
      />
      {/* <div className="required">{formik.values.filterOption}</div> */}
      <span class="checkmark"></span>
      District
    </label>
    <label>
      <input
        type="radio"
        name="filterOption"
        value="range"
        checked={formik.values.filterOption === "range"}
        // onChange={formik.handleChange}
        onChange={(e) => {
          setRadioValue(e.target.value)
          console.log(e.target.value, 'rrrrrrrrrrrrrr///////////////////////////////');
          formik.setFieldValue("filterOption", e.target.value); // Update Formik state
        }}
  
      />
      <span class="checkmark"></span>
      Range
    </label>
  </div>

    {/* Conditional Rendering for Select District */}
    {formik.values.filterOption === "district" && (
    <label>
          
    <select
      id="select_district"
      name="select_district"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.select_district}
      // value={district_def_Valu && formik.values.select_district === '' ? district_def_Valu : formik.values.select_district}
    >
      
      <option value=''>Select District  </option>
      {getDistrictList?.map((option) => ( 
        <option key={option.dist_name} value={option.dist_code}>
          {option.dist_name}
        </option>
      ))}
    </select>

    {formik.errors.select_district && formik.touched.select_district && (
      <div className="required">{formik.errors.select_district}</div>
    )}
  </label>
  )}

  {/* Conditional Rendering for Select Range */}
  {formik.values.filterOption === "range" && (
    <label className="range_dropdown_cu">

    {/* {getLoading_range ?(
    <Loader align = {'center'} gap = {'middle'} size = {'small'} />
    ):(
    <>
    </>
    )} */}

<select
      id="select_range"
      name="select_range"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value= {formik.values.select_range}
      >

      {getRangeList.length < 1 ? (
          <option value=''>No ranges available </option>
        ) : (
          <>
          <option value=''>Select Range </option>
          <Loader align = {'center'} gap = {'middle'} size = {'small'} />
            {getRangeList.map((option) => (
              <option key={option.range_name} value={option.range_id}>
                {option.range_name} 
              </option>
            ))}
          </>
        )}

      </select>


      
      {formik.errors.select_range && formik.touched.select_range && (
        <div className="required">{formik.errors.select_range}
        
        
        </div>
      )}


    </label>
  )}

        {/* <label>
          
          <select
            id="select_district"
            name="select_district"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.select_district}
            // value={district_def_Valu && formik.values.select_district === '' ? district_def_Valu : formik.values.select_district}
          >
            
            <option value='0'>Select District * </option>
            {getDistrictList?.map((option) => ( 
              <option key={option.dist_name} value={option.dist_code}>
                {option.dist_name}
              </option>
            ))}
          </select>

          {formik.errors.select_district && formik.touched.select_district && (
            <div className="required">{formik.errors.select_district}</div>
          )}
        </label> */}


{/* {JSON.stringify({ getLoading_range }, null, 2)} */}

    
        {/* Select Range */}
        {/* <label className="range_dropdown_cu">

        {getLoading_range ?(
        <Loader align = {'center'} gap = {'middle'} size = {'small'} />
        ):(
        <>
        </>
        )}

          <select
          id="select_range"
          name="select_range"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value= {formik.values.select_range}
          >

          {getRangeList.length < 1 ? (
              <option value='0'>No ranges available *</option>
            ) : (
              <>
              <option value='0'>Select Range * </option>
              <Loader align = {'center'} gap = {'middle'} size = {'small'} />
                {getRangeList.map((option) => (
                  <option key={option.range_name} value={option.range_id}>
                    {option.range_name} 
                  </option>
                ))}
              </>
            )}

          </select>


          
          {formik.errors.select_range && formik.touched.select_range && (
            <div className="required">{formik.errors.select_range}</div>
          )}
        </label> */}

        {/* Select Type */}
        <label>
          <select
            id="select_type"
            name="select_type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value= {formik.values.select_type}
            // value={type_def_Valu && formik.values.select_type === '' ? type_def_Valu : formik.values.select_type}
          >
            <option value=''>Select Society Type</option>
            {getSocietyType.map((option) => (
              <option key={option.soc_type_name} value={option.soc_type_id}>
                {option.soc_type_name}
              </option>
            ))}
          </select>
          {formik.errors.select_type && formik.touched.select_type && (
            <div className="required">{formik.errors.select_type}</div>
          )}
        </label>

        {/* Society Name */}
        <label>
          <input
            id="society_Name"
            name="society_Name"
            type="text"
			      placeholder="Society Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value= {formik.values.society_Name}
            // value={soci_Name_def_Valu && formik.values.society_Name === '' ? soci_Name_def_Valu : formik.values.society_Name}
          />
          {formik.errors.society_Name && formik.touched.society_Name && (
            <div className="required">{formik.errors.society_Name}</div>
          )}
        </label>

        {/* Submit Button */}
		<label className="searchSec"><button type="submit">Search</button></label>
    <label className="resetSec"><button type="reset">Reset</button></label>

        
      </form>
    </div>
  );
}

export default SearchBox;