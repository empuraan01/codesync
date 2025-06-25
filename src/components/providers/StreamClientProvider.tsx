"use client"

import { ReactNode, useState, useEffect } from "react";
import { StreamVideoClient, StreamVideoProvider, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVidProvider = ({children}: {children: ReactNode}) => {
    const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
    const {isLoaded, user} = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;

        const client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
            user:{
                id: user?.id,
                name: user?.firstName || "" + " " + user?.lastName || "" || user?.id,
                image: user?.imageUrl || "",

            },
            tokenProvider: streamTokenProvider
        });

        setStreamVideoClient(client);
    }, [user, isLoaded]);

    if (!streamVideoClient) return <LoaderUI/>;
    return (
        <StreamVideo client={streamVideoClient}>
            {children}
        </StreamVideo>
    )
}

export default StreamVidProvider;


