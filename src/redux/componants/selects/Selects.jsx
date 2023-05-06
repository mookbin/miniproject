import { useState } from "react";
import { SelectBoxWrapper, Select } from "./styles";

const OPTIONS = [
    { id: 1, value: "seoul", name: "서울" },
    { id: 2, value: "kyungki", name: "경기" },
    { id: 3, value: "spring", name: "강원" },
    { id: 4, value: "chungchyung", name: "충청" },
    { id: 5, value: "kyungsang", name: "경상" },
    { id: 6, value: "jyunla", name: "전라" },
    { id: 7, value: "jeju", name: "제주" },
];

const SelectBox = (props) => {
    return (
        <SelectBoxWrapper>
            <span style={{fontWeight:'700'}}>City&nbsp;</span>
            <Select>
                {OPTIONS.map((option) => (
                    <option
                        key={option.id}
                        value={option.value}
                        defaultValue={props.defaultValue === option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        </SelectBoxWrapper>
    );
};
export default SelectBox