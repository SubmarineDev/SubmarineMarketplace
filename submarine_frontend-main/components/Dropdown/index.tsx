import React from 'react';
import Select from "react-dropdown-select";
import styled from 'styled-components'

const options = [
    { value: 'price_low_to_high', label: 'Sort:  Low to High' },
    { value: 'price_high_to_low', label: 'Sort:  High to Low' },
];

const SelectStyle = styled.div`{
    .react-dropdown-select {
        padding-left: 10px;
        border: 1px solid #1B6A97 !important;
        border-radius: 5px;
    }
}`

const hanleChangeValue = () => {

}

const DropDown = ({ values, setValues }) => {
    console.log('values==========', values)
    return (
        <SelectStyle>
            <Select options={options} onChange={(values) => setValues(values)} values={values} />
        </SelectStyle>
    )
}


export default DropDown; 