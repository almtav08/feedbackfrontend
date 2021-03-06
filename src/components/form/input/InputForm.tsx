import React, { FunctionComponent } from "react";
import "./input-form.css";
import { Form } from "react-bootstrap";
import { UseFormRegister } from "react-hook-form";

interface InputFormProps {
    name: string;
    label: string;
    value: string;
    type: string;
    input: string;
    register: UseFormRegister<any>;
    required: boolean
}

const InputForm: FunctionComponent<InputFormProps> = (
    {
        name,
        label,
        value,
        type,
        input,
        register,
        required
    }
) => {
    return (
        <Form.Group
            controlId={name}
        >
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                defaultValue={value}
                {...register(input)}
                required={required}
            />
        </Form.Group>
    );
};

export default InputForm;


