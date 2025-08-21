'use client';

import { useEffect } from "react";

export default function DebugClientFetch({query}) {
    useEffect(() => {
        if(!query || !query.trim()) return ;
        fetch(`/api/products/search?name=${encodeURIComponent(query.trim())}`)
            .then((r) => {
                // console.log("client fetch status",r.status);
                return r.json();
            })
            // .then((data) => console.log('client fetch data:',data))
            // .catch((err) => console.error('client fetch error:',err)); 
    },[query]);

    return null;
}