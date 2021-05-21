import React, { FunctionComponent } from 'react'
import { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import Register from './components/Register'
import { RegsiterInput } from './RegisterDataContainer'

interface RegisterViewProps {
    alert: boolean,
    handleAlert: (alert: boolean) => void,
    passwordMismatches: () => boolean,
    register: UseFormRegister<RegsiterInput>, 
    handleSubmit: UseFormHandleSubmit<RegsiterInput>,
    onSubmit: (data: RegsiterInput) => void
}

const RegisterView: FunctionComponent<RegisterViewProps> = (
    {
        alert,
        handleAlert,
        passwordMismatches,
        register, 
        handleSubmit,
        onSubmit
    }
) => {
    return (
        <Register 
            alert={alert}
            handleAlert={handleAlert}
            passwordMismatches={passwordMismatches}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}/>
    )
}

export default RegisterView