"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation";

export default function VisitorTracker(){
    const pathname = usePathname();

    useEffect(()=>{
        const sendVisit = async () => {
            try{
                await fetch("/api/track-visitor",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({page:pathname}),
                });
            }catch(err){
                // console.error("Visitor tracking failed:",err);
            }
        };

        sendVisit();
    },[pathname]);


    return null;
}