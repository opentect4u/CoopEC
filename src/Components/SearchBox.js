import React, { useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router";

const initialValues = {
  select_district: '',
  select_range: '',
  select_type: '',
  society_Name: '',
};

const validationSchema = Yup.object({
  select_district: Yup.string().required('Required'),
  select_range: Yup.string().required('Required'),
  select_type: Yup.string().required('Required'),
  society_Name: Yup.string().required('Required'),
});



function SearchBox() {

  const navigation = useNavigate();

const onSubmit = (values) => {
  
  // var data = JSON.stringify(values, null, 2);
  // alert(values.select_district);  // Alerting the submitted form data

  // const params = new URLSearchParams(values).toString();

  // console.log(values, 'Form submitted');
  // navigation("/search", values);
  // navigation('/search',values);


  // navigation(`/search?${params}`);

  // navigation(`/search?${params}`, { state: values });
  navigation('/search', { state: values });
};


  const select_districtOptions = [
    { key: 'Select District', value: '' },
    { key: 'District 1', value: 'District 1' },
    { key: 'District 2', value: 'District 2' },
  ];

  const select_rangeOptions = [
    { key: 'Select Range', value: '' },
    { key: 'Range 1', value: 'Range 1' },
    { key: 'Range 2', value: 'Range 2' },
  ];

  const select_typeOptions = [
    { key: 'Select Type', value: '' },
    { key: 'Type 1', value: 'Type 1' },
    { key: 'Type 2', value: 'Type 2' },
  ];

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

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
          >
            {select_districtOptions.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
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
            value={formik.values.select_range}
          >
            {select_rangeOptions.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
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
            value={formik.values.select_type}
          >
            {select_typeOptions.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
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
            value={formik.values.society_Name}
          />
          {formik.errors.society_Name && formik.touched.society_Name && (
            <div className="required">{formik.errors.society_Name}</div>
          )}
        </label>

        {/* Submit Button */}
		<label><button type="submit">Search</button></label>
        
      </form>
    </div>
  );
}

export default SearchBox;
