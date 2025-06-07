"use client"
import React from "react"
import axios from "axios"
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/nextjs";

export default function AddAdmin() {
    const { getToken } = useAuth();
    const { user } = useUser();
    console.log(user)
   return (
    <div>
        <button onClick={async () => {
            try{
                const token = await getToken();
                const response = await axios.post("/api/admin/add-admin" , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }   
                })
                if(response.data.success){
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }catch(error){
                toast.error(error.message)
            }
        }}>Add Admin</button>
        <button onClick={async () => {
            try{
                const token = await getToken();
                const response = await axios.post("/api/admin/removeallroles" , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }   
                })
                if(response.data.success){
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            }catch(error){
                toast.error(error.message)
            }
        }
        }>Remove Admin</button>

    </div>
   )
}