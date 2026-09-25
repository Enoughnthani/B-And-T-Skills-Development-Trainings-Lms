import React from 'react'
import logoImage from "@/resources/logo.png"

export default function LogoImage({ onClick }) {


    return (
        <div onClick={onClick} className='cursor-pointer'>
            <img src={logoImage} alt="B&T LMS" className="h-9 w-auto" />
        </div>
    )
}
