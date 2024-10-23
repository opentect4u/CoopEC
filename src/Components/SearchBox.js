import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../routes/config";

// let district_def_value, range_def_value, type_def_value, soci_Name_def_value;

const initialValues = {
  // select_district: formik.values.select_district ? formik.values.select_district : '',
  select_district: '',
  select_range: '',
  select_type: '',
  society_Name: '',
};

const validationSchema = Yup.object({
  select_district: Yup.string().required('Required'),
  select_range: Yup.string().required('Required'),
  select_type: Yup.string(),
  society_Name: Yup.string(),
});







function SearchBox({district_def_Valu, range_def_Valu, type_def_Valu, soci_Name_def_Valu}) {
  
  
  // const resp={
  //   select_district: district_def_Valu,
  //   select_range: '',
  //   select_type: '',
  //   society_Name: '',
  // }
  // console.log(resp, 'lllllllllll');
  
  // const [formValues, setValues] = useState(resp);



  const [getDistrictList, setDistrictList] = useState([]);
  const [getRangeList, setRangeList] = useState([]);
  const [getSocietyType, setSocietyType] = useState([]);

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

   const rangeList = async(districValue)=>{

    // console.log(districValue, 'kkkkkkkkkkkkkkkk');
    
    await axios.post(`${BASE_URL}/wapi/rangelist`,
      {
        auth_key:"xxxxx",
        dist_id: districValue
      }
      // ,
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {

      if(res.status == '200'){
      if(res.data.suc > 0){
        setRangeList(res?.data?.msg)
        console.log(getRangeList, 'getRangeList');
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

  
  
  navigation('/search', { state: values});
};

useEffect(()=>{

  // console.log(searchPlaceholder, 'searchPlaceholder');
  districtList();
  societyType();

},[])




  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  useEffect(()=>{

  rangeList(formik.values.select_district);
    
  }, [formik.values.select_district])

  return (
    <div className="search_box">
      <h2>Search</h2>

      <form onSubmit={formik.handleSubmit}>
        {/* Select District */}
        <label>
          <select
            id="select_district"
            name="select_district"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.select_district}
            // value={district_def_Valu && formik.values.select_district === '' ? district_def_Valu : formik.values.select_district}
          >
            <option value='0'>Select District *</option>
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

        {/* Select Range */}
        <label>

          <select
          id="select_range"
          name="select_range"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value= {formik.values.select_range}
          // value={range_def_Valu && formik.values.select_range === '' ? range_def_Valu : formik.values.select_range}
          >

          {getRangeList.length < 1 ? (
              <option value='0'>No ranges available *</option>
            ) : (
              <>
              <option value='0'>Select Range * </option>
                {getRangeList.map((option) => (
                  <option key={option.range_name} value={option.range_id}>
                    {option.range_name}
                  </option>
                ))}
              </>
            )}

          {/* {select_rangeOptions.map((option) => (
          <option key={option.key} value={option.value}>
          {option.key}
          </option>
          ))} */}
          </select>
          
          {formik.errors.select_range && formik.touched.select_range && (
            <div className="required">{formik.errors.select_range}</div>
          )}
        </label>

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
            <option value='0'>Select Society Type</option>
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
