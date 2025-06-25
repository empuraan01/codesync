import {useRouter} from "next/navigation";
import {useStreamVideoClient} from "@stream-io/video-react-sdk";
import {toast} from "react-hot-toast";


const useMeetingActions = () => {
    const router = useRouter();
    const client = useStreamVideoClient();

    const createInstantMeeting = async () => {
        if (!client) return;

        try{
            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data:{
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: "Instant Meeting",
                    }
                }
            });

            router.push(`/meeting/${id}`);
            toast.success("Meeting created successfully");
        }
        catch(error){
            console.error(error);
            toast.error("Failed to create meeting");
        }
    }
    const joinMeeting = async (callId: string) => {
        if (!client) {
            console.error("Client not initialized");
            toast.error("Failed to join meeting. Please refresh the page and try again.");
            return;
        }

        try {
            const call = client.call("default", callId);
            await call.get();
            
            router.push(`/meeting/${callId}`);
            toast.success("Joining meeting...");
        } catch (error) {
            console.error("Meeting not found:", error);
            toast.error("Meeting not found or has ended");
        }
    }

    return {
        createInstantMeeting,
        joinMeeting,
    }

}

export default useMeetingActions;