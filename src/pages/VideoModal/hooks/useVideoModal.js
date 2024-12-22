import { useContext } from "react";
import { VideoContext } from "../VideoModal";

export const useVideoModal = () => {
    const video = useContext(VideoContext);
    return video;
};

export default useVideoModal